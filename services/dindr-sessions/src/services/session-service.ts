import { createClient } from '@supabase/supabase-js';
import type { Restaurant, SessionRecord } from '@dindr/contracts';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON key) must be provided');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SESSION_EXPIRATION = 24 * 60 * 60 * 1000;

export type SessionAction =
  | 'create'
  | 'validate'
  | 'join'
  | 'update_restaurant'
  | 'clear_matches';

export interface SessionPayload {
  sessionId: string;
  action: SessionAction;
  restaurant?: Restaurant;
}

export async function handleSessionAction(payload: SessionPayload): Promise<any> {
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

async function createSession(sessionId: string) {
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

async function validateSession(sessionId: string) {
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

async function joinSession(sessionId: string) {
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

async function updateRestaurant(sessionId: string, restaurant: Restaurant) {
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

  const restaurants = [...(currentSession.restaurants ?? [])];
  const index = restaurants.findIndex((r: Restaurant & { likes: number }) => r.id === restaurant.id);

  if (index === -1) {
    restaurants.push({ ...restaurant, likes: 1 });
  } else {
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

  return updatedSession as SessionRecord;
}

async function clearMatches(sessionId: string) {
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

  return clearedSession as SessionRecord;
}
