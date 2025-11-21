"use client";

import Link from 'next/link';
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import { Heart, Utensils, Sparkles, Smartphone, Users, MapPin, Clock, ArrowRight, Flame } from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Swipe to Decide",
      description: "Just like dating, but for food! Swipe right on restaurants you love, left on ones you don't.",
      color: "text-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Decisions",
      description: "Create rooms with friends. Everyone swipes, and we find the perfect match for the whole group.",
      color: "text-purple-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Local Gems",
      description: "Discover amazing restaurants near you. From hidden spots to top-rated favorites.",
      color: "text-orange-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Matches",
      description: "Stop the endless scrolling. Get matched with your perfect meal in under 2 minutes.",
      color: "text-green-500"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-purple-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full backdrop-blur-md bg-background/70 border-b border-white/5 supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-lg">
            <Flame className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Dindr</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/sign-in">
            <Button variant="ghost" className="hover:bg-white/5">Sign In</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-purple-500/30">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-purple-200">The #1 Food Matching App</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
              Never Wonder <br />
              <span className="gradient-text text-glow">What to Eat</span> Again
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              Tired of the "I don't know, you pick" loop? Let Dindr decide for you.
              Swipe, match, and eat with friends, family, or your partner.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <Link href="/auth/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-full shadow-lg shadow-purple-500/25 transition-all hover:scale-105">
                  Start Swiping Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/sign-in" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full h-14 text-lg border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full transition-all hover:scale-105">
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Floating Elements Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
              <motion.div
                animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-[10%] text-6xl opacity-20 blur-[1px]"
              >
                🍕
              </motion.div>
              <motion.div
                animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 right-[15%] text-6xl opacity-20 blur-[1px]"
              >
                🍔
              </motion.div>
              <motion.div
                animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-40 right-[20%] text-5xl opacity-20 blur-[1px]"
              >
                🌮
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 id="how-it-works" className="text-3xl md:text-5xl font-bold mb-6 scroll-mt-28">How Dindr Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've revolutionized the way you choose what to eat. No more arguments, just delicious decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass glass-hover p-8 rounded-3xl border border-white/5 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to stop arguing about dinner?</h2>
              <Link href="/auth/sign-up">
                <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-100 rounded-full transition-all hover:scale-105">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="relative z-10 py-12 px-6 border-t border-white/5 scroll-mt-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm">
          <p>© 2025 Dindr. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
