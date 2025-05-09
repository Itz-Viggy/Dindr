'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Slider } from '../../components/ui/slider';
import { Restaurant } from '@/types/restaurant';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';
import { Search, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { RestaurantCard } from './restaurant-card';
import { SessionManager } from './session-manager';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RestaurantSearchProps {
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
}

export function RestaurantSearch({ onSearchStart, onSearchEnd }: RestaurantSearchProps) {
  const [radius, setRadius] = useState(5);
  const [zipcode, setZipcode] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [matchedRestaurant, setMatchedRestaurant] = useState<Restaurant | null>(null);
  const { toast } = useToast();

  // Set up real-time subscription for matches
  useEffect(() => {
    if (!sessionId) return;

    console.log('Setting up real-time subscription for session:', sessionId);

    const channel = supabase.channel(`session_${sessionId}`);

    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'sessions',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          const newData = payload.new as any;
          
          if (newData.matches?.length > 0) {
            const latestMatch = newData.matches[newData.matches.length - 1];
            console.log('Found match:', latestMatch);
            
            // Only show match if it's not already shown
            if (!matchedRestaurant || matchedRestaurant.id !== latestMatch.id) {
              console.log('Showing match notification');
              setMatchedRestaurant(latestMatch);
              toast({
                title: 'It\'s a Match! 🎉',
                description: 'You both liked the same restaurant!',
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription for session:', sessionId);
      subscription.unsubscribe();
    };
  }, [sessionId, matchedRestaurant, toast]);

  const handleSearch = async () => {
    try {
      if (!zipcode || !/^\d{5}(-\d{4})?$/.test(zipcode)) {
        setError('Please enter a valid 5-digit zipcode');
        return;
      }

      setIsLoading(true);
      onSearchStart?.();
      setError(null);
      
      console.log('Searching with zipcode:', zipcode);
      
      const response = await fetch('/api/restaurants/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          radius,
          zipcode,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search restaurants');
      }

      console.log('Search results:', data);
      setRestaurants(data);
      setCurrentIndex(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search restaurants';
      setError(errorMessage);
      console.error('Error searching restaurants:', err);
      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      onSearchEnd?.();
    }
  };

  const handleAccept = async () => {
    if (!sessionId) {
      toast({
        title: 'No Active Session',
        description: 'Please start or join a session first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          action: 'update_restaurant',
          restaurant: restaurants[currentIndex],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update session');
      }

      toast({
        title: 'Restaurant Saved',
        description: `Added ${restaurants[currentIndex].name} to your favorites`,
      });
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update session';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      // Move to next card even if there's an error
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleReject = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleSessionStart = (code: string) => {
    setSessionId(code);
  };

  const handleStartNewSearch = async () => {
    if (!sessionId) return;

    try {
      // Clear matches in the session
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          action: 'clear_matches',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear matches');
      }

      // Reset local state
      setMatchedRestaurant(null);
      setCurrentIndex(0);
      setRestaurants([]);
    } catch (err) {
      console.error('Error clearing matches:', err);
      toast({
        title: 'Error',
        description: 'Failed to clear matches',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <SessionManager
        onSessionStart={handleSessionStart}
        onMatchFound={setMatchedRestaurant}
      />

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Zipcode</label>
            <Input
              type="text"
              placeholder="Enter your zipcode (e.g., 10001)"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Search Radius: {radius} miles</label>
            <Slider
              value={[radius]}
              onValueChange={(values: number[]) => setRadius(values[0])}
              min={1}
              max={25}
              step={1}
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Restaurants
              </>
            )}
          </Button>
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm p-4 bg-red-50 rounded-md">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {matchedRestaurant ? (
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">It's a Match! 🎉</h2>
          <p className="text-lg mb-2">{matchedRestaurant.name}</p>
          <p className="text-gray-600">{matchedRestaurant.address}</p>
          <Button
            onClick={handleStartNewSearch}
            className="mt-4"
          >
            Start New Search
          </Button>
        </Card>
      ) : restaurants.length > 0 && currentIndex < restaurants.length ? (
        <RestaurantCard
          restaurant={restaurants[currentIndex]}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ) : restaurants.length > 0 && currentIndex >= restaurants.length ? (
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold">No more restaurants</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : null}
    </div>
  );
} 