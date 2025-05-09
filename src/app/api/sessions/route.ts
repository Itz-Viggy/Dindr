import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Session expiration time in milliseconds (24 hours)
const SESSION_EXPIRATION = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const { sessionId, action, restaurant } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Clean up expired sessions
    await supabase
      .from('sessions')
      .delete()
      .lt('created_at', new Date(Date.now() - SESSION_EXPIRATION).toISOString());

    switch (action) {
      case 'create':
        const { data: session, error: createError } = await supabase
          .from('sessions')
          .insert([
            {
              session_id: sessionId,
              status: 'active',
              restaurants: [],
              matches: [],
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        return NextResponse.json(session);

      case 'validate':
        const { data: existingSession, error: validateError } = await supabase
          .from('sessions')
          .select('created_at')
          .eq('session_id', sessionId)
          .single();

        if (validateError) {
          return NextResponse.json({ exists: false });
        }

        // Check if session is expired
        const sessionAge = Date.now() - new Date(existingSession.created_at).getTime();
        if (sessionAge > SESSION_EXPIRATION) {
          // Delete expired session
          await supabase
            .from('sessions')
            .delete()
            .eq('session_id', sessionId);
          return NextResponse.json({ exists: false });
        }

        return NextResponse.json({ exists: true });

      case 'join':
        const { data: joinSession, error: joinError } = await supabase
          .from('sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (joinError) throw joinError;
        if (!joinSession) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Check if session is expired
        const joinSessionAge = Date.now() - new Date(joinSession.created_at).getTime();
        if (joinSessionAge > SESSION_EXPIRATION) {
          // Delete expired session
          await supabase
            .from('sessions')
            .delete()
            .eq('session_id', sessionId);
          return NextResponse.json({ error: 'Session has expired' }, { status: 410 });
        }

        return NextResponse.json(joinSession);

      case 'update_restaurant':
        if (!restaurant) {
          return NextResponse.json({ error: 'Restaurant data is required' }, { status: 400 });
        }

        const { data: currentSession, error: updateError } = await supabase
          .from('sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (updateError) throw updateError;
        if (!currentSession) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Check if session is expired
        const updateSessionAge = Date.now() - new Date(currentSession.created_at).getTime();
        if (updateSessionAge > SESSION_EXPIRATION) {
          // Delete expired session
          await supabase
            .from('sessions')
            .delete()
            .eq('session_id', sessionId);
          return NextResponse.json({ error: 'Session has expired' }, { status: 410 });
        }

        // Check if both users have liked this restaurant
        const updatedRestaurants = [...(currentSession.restaurants || [])];
        const existingRestaurantIndex = updatedRestaurants.findIndex(
          (r: any) => r.id === restaurant.id
        );

        if (existingRestaurantIndex === -1) {
          updatedRestaurants.push({
            ...restaurant,
            likes: 1
          });
        } else {
          updatedRestaurants[existingRestaurantIndex].likes += 1;
        }

        // If both users liked the restaurant, add it to matches
        const matches = [...(currentSession.matches || [])];
        const matchedRestaurant = updatedRestaurants.find((r: any) => r.likes === 2);
        if (matchedRestaurant) {
          matches.push(matchedRestaurant);
        }

        const { data: updatedSession, error: saveError } = await supabase
          .from('sessions')
          .update({
            restaurants: updatedRestaurants,
            matches
          })
          .eq('session_id', sessionId)
          .select()
          .single();

        if (saveError) throw saveError;
        return NextResponse.json(updatedSession);

      case 'clear_matches':
        const { data: sessionToClear, error: clearError } = await supabase
          .from('sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (clearError) throw clearError;
        if (!sessionToClear) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const { data: clearedSession, error: clearSaveError } = await supabase
          .from('sessions')
          .update({
            matches: [],
            restaurants: []
          })
          .eq('session_id', sessionId)
          .select()
          .single();

        if (clearSaveError) throw clearSaveError;
        return NextResponse.json(clearedSession);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 