import Link from 'next/link';
import { Button } from "../../components/ui/button";
import { Heart, Utensils, Sparkles } from "lucide-react";

const Hero = () => {
  return (
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

        {/* Scroll indicator */}
       
      </div>
    </div>
  );
};

export default Hero;