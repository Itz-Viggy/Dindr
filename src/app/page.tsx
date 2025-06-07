"use client";
import Link from 'next/link';
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Heart, Utensils, Sparkles, Smartphone, Users, MapPin, Clock, Star, Zap } from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "Swipe to Decide",
      description: "Just like dating, but for food! Swipe right on restauraunts you love, left on ones you don't.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "Group Decisions",
      description: "Create rooms with friends and family. Everyone swipes, and we find what you all agree on.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "Local Restaurants",
      description: "Discover amazing restaurants and dishes near you. We know all the best spots in your area.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "Quick Matches",
      description: "No more endless scrolling. Get matched with your perfect meal in under 60 seconds.",
      color: "from-green-500 to-emerald-500"
    },
  
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 overflow-hidden">
        {/* Animated background elements - optimized for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-4 text-yellow-300 animate-float text-xl">
            <Utensils size={24} />
          </div>
          <div className="absolute top-32 right-8 text-pink-300 animate-float text-lg" style={{ animationDelay: '2s' }}>
            <Heart size={20} />
          </div>
          <div className="absolute bottom-32 left-8 text-purple-300 animate-float text-base" style={{ animationDelay: '4s' }}>
            <Sparkles size={18} />
          </div>
          <div className="absolute top-48 right-4 text-orange-300 animate-float text-2xl" style={{ animationDelay: '1s' }}>
            🍕
          </div>
          <div className="absolute bottom-48 right-12 text-yellow-300 animate-float text-xl" style={{ animationDelay: '3s' }}>
            🍔
          </div>
          <div className="absolute top-64 left-12 text-pink-300 animate-float text-lg" style={{ animationDelay: '5s' }}>
            🌮
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
          {/* Logo/Brand */}
          <div className="mb-6 animate-fade-in">
            <div className="text-4xl sm:text-5xl md:text-6xl font-handwriting font-bold text-white mb-2 transform hover:scale-110 transition-transform duration-300">
              Dindr
            </div>
            <div className="w-16 h-1 bg-white rounded-full mx-auto"></div>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 animate-fade-in max-w-4xl leading-tight" style={{ animationDelay: '0.2s' }}>
            Never Wonder
            <span className="block text-yellow-300">What to Eat</span>
            <span className="block">Again</span>
          </h1>

          {/* Subheading */}
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-3 sm:mb-4 animate-fade-in max-w-2xl px-2" style={{ animationDelay: '0.4s' }}>
            Tired of the <span className="font-handwriting text-yellow-300 text-lg sm:text-xl md:text-2xl lg:text-3xl">"I don't know, you pick"</span> loop?
          </div>
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 animate-fade-in px-2" style={{ animationDelay: '0.6s' }}>
            Let <span className="font-bold text-yellow-300">Dindr</span> decide for you.
          </div>

          {/* Tagline */}
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <span className="inline-block mx-1 sm:mx-2 transform hover:scale-110 transition-transform duration-300">Swipe.</span>
            <span className="inline-block mx-1 sm:mx-2 transform hover:scale-110 transition-transform duration-300">Match.</span>
            <span className="inline-block mx-1 sm:mx-2 transform hover:scale-110 transition-transform duration-300">Eat.</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg gap-3 sm:gap-4 animate-fade-in px-4" style={{ animationDelay: '1s' }}>
            <Link href="/auth/sign-in" passHref>
              <Button 
                size="lg" 
                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Swiping
              </Button>
            </Link>
            <Link href="/auth/sign-up" passHref>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Dindr</span> Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We've revolutionized the way you choose what to eat. No more arguments, no more indecision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border-0 shadow-lg"
              >
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;