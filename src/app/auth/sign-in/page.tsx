"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Mail, Lock, Heart, Utensils, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase";
import { useToast } from "../../../../hooks/use-toast";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-4 text-yellow-300 animate-bounce text-xl">
          <Utensils size={24} />
        </div>
        <div className="absolute top-32 right-8 text-pink-300 animate-pulse text-lg">
          <Heart size={20} />
        </div>
        <div
          className="absolute bottom-32 left-8 text-purple-300 animate-bounce text-base"
          style={{ animationDelay: "2s" }}
        >
          <Sparkles size={18} />
        </div>
        <div
          className="absolute top-48 right-4 text-orange-300 animate-pulse text-2xl"
          style={{ animationDelay: "1s" }}
        >
          🍕
        </div>
        <div
          className="absolute bottom-48 right-12 text-yellow-300 animate-bounce text-xl"
          style={{ animationDelay: "3s" }}
        >
          🍔
        </div>
        <div
          className="absolute top-64 left-12 text-pink-300 animate-pulse text-lg"
          style={{ animationDelay: "4s" }}
        >
          🌮
        </div>
      </div>

      {/* Main Sign-in Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2 transform hover:scale-110 transition-transform duration-300">
              Dindr
            </div>
            <div className="w-16 h-1 bg-white rounded-full mx-auto mb-4"></div>
            <p className="text-white/90 text-lg">Welcome back!</p>
          </div>

          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
              <CardDescription className="text-white/80">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-11 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20 rounded-xl h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-11 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20 rounded-xl h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 h-12"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-white/80 hover:text-white text-sm hover:underline transition-colors duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 px-4 text-white/1000">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 border-white/50 text-white hover:bg-white hover:text-purple-600 font-semibold py-3 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 bg-transparent h-12"
                >
                  <Link href="/sign-up">Create Account</Link>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
