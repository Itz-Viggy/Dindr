"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSessionAction = handleSessionAction;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON key) must be provided');
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const SESSION_EXPIRATION = 24 * 60 * 60 * 1000;
async function handleSessionAction(payload) {
    const { sessionId, action, restaurant } = payload;
    await cleanupExpiredSessions();
    switch (action) {
        case 'create':
            return createSession(sessionId);
        case 'validate':
            return validateSession(sessionId);
        case 'join':
            return joinSession(sessionId);
        case 'update_restaurant':
            if (!restaurant) {
                throw Object.assign(new Error('Restaurant data is required'), { status: 400 });
            }
            return updateRestaurant(sessionId, restaurant);
        case 'clear_matches':
            return clearMatches(sessionId);
        default:
            throw Object.assign(new Error('Invalid action'), { status: 400 });
    }
}
async function cleanupExpiredSessions() {
    await supabase
        .from('sessions')
        .delete()
        .lt('created_at', new Date(Date.now() - SESSION_EXPIRATION).toISOString());
}
async function createSession(sessionId) {
    const { data, error } = await supabase
        .from('sessions')
        .insert([
        {
            session_id: sessionId,
            status: 'active',
            restaurants: [],
            matches: [],
            created_at: new Date().toISOString(),
        },
    ])
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
}
async function validateSession(sessionId) {
    const { data, error } = await supabase
        .from('sessions')
        .select('created_at')
        .eq('session_id', sessionId)
        .single();
    if (error) {
        return { exists: false };
    }
    const sessionAge = Date.now() - new Date(data.created_at).getTime();
    if (sessionAge > SESSION_EXPIRATION) {
        await supabase.from('sessions').delete().eq('session_id', sessionId);
        return { exists: false };
    }
    return { exists: true };
}
async function joinSession(sessionId) {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();
    if (error) {
        throw error;
    }
    if (!data) {
        throw Object.assign(new Error('Session not found'), { status: 404 });
    }
    const sessionAge = Date.now() - new Date(data.created_at).getTime();
    if (sessionAge > SESSION_EXPIRATION) {
        await supabase.from('sessions').delete().eq('session_id', sessionId);
        throw Object.assign(new Error('Session has expired'), { status: 410 });
    }
    return data;
}
async function updateRestaurant(sessionId, restaurant) {
    const { data: currentSession, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();
    if (error) {
        throw error;
    }
    if (!currentSession) {
        throw Object.assign(new Error('Session not found'), { status: 404 });
    }
    const sessionAge = Date.now() - new Date(currentSession.created_at).getTime();
    if (sessionAge > SESSION_EXPIRATION) {
        await supabase.from('sessions').delete().eq('session_id', sessionId);
        throw Object.assign(new Error('Session has expired'), { status: 410 });
    }
    const restaurants = [
        ...(currentSession.restaurants ?? []).map((r) => ({
            ...r,
            likes: typeof r.likes === 'number' ? r.likes : 0,
        })),
    ];
    const index = restaurants.findIndex((r) => r.id === restaurant.id);
    if (index === -1) {
        restaurants.push({ ...restaurant, likes: 1 });
    }
    else {
        restaurants[index].likes += 1;
    }
    const matches = [...(currentSession.matches ?? [])];
    const matchedRestaurant = restaurants.find((r) => r.likes === 2);
    if (matchedRestaurant) {
        matches.push(matchedRestaurant);
    }
    const { data: updatedSession, error: updateError } = await supabase
        .from('sessions')
        .update({
        restaurants,
        matches,
    })
        .eq('session_id', sessionId)
        .select()
        .single();
    if (updateError) {
        throw updateError;
    }
    return updatedSession;
}
async function clearMatches(sessionId) {
    const { data: existingSession, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();
    if (error) {
        throw error;
    }
    if (!existingSession) {
        throw Object.assign(new Error('Session not found'), { status: 404 });
    }
    const { data: clearedSession, error: clearError } = await supabase
        .from('sessions')
        .update({
        matches: [],
        restaurants: [],
    })
        .eq('session_id', sessionId)
        .select()
        .single();
    if (clearError) {
        throw clearError;
    }
    return clearedSession;
}
