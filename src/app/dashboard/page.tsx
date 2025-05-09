"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "../../..//components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { LogOut } from "lucide-react";
import { RestaurantSearch } from "@/components/restaurant-search";
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/sign-in");
      } else {
        setUser(user);
      }
    };

    checkUser();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // The search will be triggered by the RestaurantSearch component
      // We just need to handle the loading state
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                {user.user_metadata.name || user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start swiping on restaurants to find your next dining spot.
              </p>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Restaurant Search</h2>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search Restaurants'
              )}
            </Button>
          </div>
          <RestaurantSearch onSearchStart={() => setIsSearching(true)} onSearchEnd={() => setIsSearching(false)} />
        </div>
      </div>
    </div>
  );
}