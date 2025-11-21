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
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex items-center justify-center px-4 py-12 selection:bg-purple-500/30">
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

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Dindr</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <Card className="glass border-white/10 shadow-2xl">
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-11 bg-black/20 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl h-12 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-11 bg-black/20 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl h-12 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-6">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 text-lg rounded-full shadow-lg shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 h-12"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-muted-foreground">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-foreground hover:text-white font-semibold py-3 text-lg rounded-full transition-all duration-300 h-12"
              >
                <Link href="/auth/sign-up">Create Account</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
