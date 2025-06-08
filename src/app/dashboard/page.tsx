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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 overflow-hidden relative p-4 sm:p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-4 text-yellow-300 animate-bounce text-xl">
          <Utensils size={24} />
        </div>
        <div className="absolute top-32 right-8 text-pink-300 animate-pulse text-lg">
          <Heart size={20} />
        </div>
        <div className="absolute bottom-32 left-8 text-purple-300 animate-bounce text-base" style={{ animationDelay: '2s' }}>
          <Sparkles size={18} />
        </div>
        <div className="absolute top-48 right-4 text-orange-300 animate-pulse text-2xl" style={{ animationDelay: '1s' }}>
          🍕
        </div>
        <div className="absolute bottom-48 right-12 text-yellow-300 animate-bounce text-xl" style={{ animationDelay: '3s' }}>
          🍔
        </div>
        <div className="absolute top-64 left-12 text-pink-300 animate-pulse text-lg" style={{ animationDelay: '4s' }}>
          🌮
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2 transform hover:scale-110 transition-transform duration-300">
              Dindr
            </div>
            <div className="w-12 h-1 bg-white rounded-full"></div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-2 border-white/50 text-white hover:bg-white hover:text-purple-600 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Welcome back!</CardTitle>
              <CardDescription className="text-white/80 text-lg">
                {user?.user_metadata?.name || user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-base leading-relaxed">
                Start swiping on restaurants to find your next dining spot. We've got amazing places waiting for you!
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">Restaurant Search</CardTitle>
                  <CardDescription className="text-white/80">
                    Find the perfect place to satisfy your cravings
                  </CardDescription>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 px-6 py-3"
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
            <CardContent>
              <RestaurantSearch onSearchStart={() => setIsSearching(true)} onSearchEnd={() => setIsSearching(false)} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 align-center">
            

            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-lg font-bold text-white mb-2">Group Dining</h3>
                <p className="text-white/80 text-sm">Plan meals with friends</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
