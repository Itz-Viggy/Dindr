'use client';

import { Restaurant } from '@/types/restaurant';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, Star, DollarSign } from 'lucide-react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onAccept: () => void;
  onReject: () => void;
}

export function RestaurantCard({ restaurant, onAccept, onReject }: RestaurantCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);

  // Rotation based on x position: -200px -> -10deg, 200px -> 10deg
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  // Opacity for "Like" (Green) overlay: 0 -> 0, 150 -> 1
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);

  // Opacity for "Nope" (Red) overlay: -150 -> 1, 0 -> 0
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 500) {
      // Swipe Right (Accept)
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onAccept();
    } else if (info.offset.x < -threshold || velocity < -500) {
      // Swipe Left (Reject)
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onReject();
    } else {
      // Reset
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, touchAction: 'none' }}
      animate={controls}
      onDragEnd={handleDragEnd}
      className="relative w-full max-w-md mx-auto cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.05 }}
    >
      {/* Swipe Overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 z-20 border-4 border-green-500 rounded-lg px-4 py-2 transform -rotate-12 pointer-events-none"
      >
        <span className="text-green-500 font-bold text-4xl uppercase tracking-widest">Like</span>
      </motion.div>

      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 z-20 border-4 border-red-500 rounded-lg px-4 py-2 transform rotate-12 pointer-events-none"
      >
        <span className="text-red-500 font-bold text-4xl uppercase tracking-widest">Nope</span>
      </motion.div>

      <Card className="relative w-full overflow-hidden glass border-white/10 shadow-2xl select-none">
        {/* Restaurant Image & Info Container */}
        <div className="relative h-96 w-full">
          {restaurant.image_url ? (
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable="false"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Restaurant Info - Now inside the image container */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
            <h2 className="text-3xl font-bold mb-2 shadow-black/50 drop-shadow-lg">{restaurant.name}</h2>

            <div className="flex items-center gap-2 text-sm mb-3 text-white/90">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.address}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="font-semibold">{restaurant.price_range}</span>
              </div>
              <div className="bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                <span className="text-sm">{restaurant.cuisine}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (kept for accessibility/fallback) */}
        <div className="p-4 flex justify-center gap-6 bg-black/20 backdrop-blur-md border-t border-white/10">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 flex items-center justify-center border-2 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag interference
              onReject();
            }}
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" className="stroke-red-500" />
              <line x1="6" y1="6" x2="18" y2="18" className="stroke-red-500" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 flex items-center justify-center border-2 border-green-500/50 bg-green-500/10 hover:bg-green-500/20 hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag interference
              onAccept();
            }}
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" className="stroke-green-500" />
            </svg>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}