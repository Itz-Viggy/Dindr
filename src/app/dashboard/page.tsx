"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { LogOut, Loader2, Utensils, Heart, Sparkles, Search } from "lucide-react";
import { RestaurantSearch } from "@/components/restaurant-search";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [showGroupDiningSearch, setShowGroupDiningSearch] = useState(false);


  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
      // Search logic is handled by RestaurantSearch
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative p-4 sm:p-6 selection:bg-purple-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Animated Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-[10%] text-6xl opacity-20 blur-[1px] animate-bounce" style={{ animationDuration: '3s' }}>
          🍕
        </div>
        <div className="absolute bottom-40 right-[15%] text-6xl opacity-20 blur-[1px] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          🍔
        </div>
        <div className="absolute top-40 right-[20%] text-5xl opacity-20 blur-[1px] animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>
          🌮
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <span className="text-3xl font-bold tracking-tight">Dindr</span>
              <div className="w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mt-1 opacity-50"></div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground hover:text-white font-medium rounded-full shadow-lg transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>

        <div className="grid gap-8">
          <Card className="glass border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10 pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl font-bold">Welcome back!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {user?.user_metadata?.name || user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl">
                Start swiping on restaurants to find your next dining spot. We've got amazing places waiting for you!
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 shadow-2xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2">Restaurant Search</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Find the perfect place to satisfy your cravings
                  </CardDescription>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 px-6 py-3"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search Restaurants
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {showGroupDiningSearch && (
              <div className="p-6 pt-0 animate-in fade-in slide-in-from-top-4 duration-300">
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Find Group Dining Spots</CardTitle>
                    <CardDescription>Tailored for larger parties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RestaurantSearch
                      onSearchStart={() => setIsSearching(true)}
                      onSearchEnd={() => setIsSearching(false)}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="glass glass-hover border-white/10 shadow-xl cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⭐</div>
                <h3 className="text-xl font-bold mb-2">Your Favorites</h3>
                <p className="text-muted-foreground text-sm">Revisit places you loved (COMING SOON!)</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => setShowGroupDiningSearch(prev => !prev)}
              className="glass glass-hover border-white/10 shadow-xl cursor-pointer group"
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
                <h3 className="text-xl font-bold mb-2">Group Dining</h3>
                <p className="text-muted-foreground text-sm">Plan meals with friends</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
