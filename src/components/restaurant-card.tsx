'use client';

import type { Restaurant } from '@dindr/contracts';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ThumbsUp, ThumbsDown, MapPin, Star, DollarSign } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onAccept: () => void;
  onReject: () => void;
}

export function RestaurantCard({ restaurant, onAccept, onReject }: RestaurantCardProps) {
  return (
    <Card className="relative w-full max-w-md mx-auto overflow-hidden">
      {/* Restaurant Image */}
      <div className="relative h-64 w-full">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{restaurant.address}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>{restaurant.price_range}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 flex flex-col items-center justify-center gap-1"
          onClick={onReject}
        >
          <ThumbsDown className="h-6 w-6 text-red-500" />
          <span className="text-sm font-medium text-red-500">N</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 flex flex-col items-center justify-center gap-1"
          onClick={onAccept}
        >
          <ThumbsUp className="h-6 w-6 text-green-500" />
          <span className="text-sm font-medium text-green-500">Y</span>
        </Button>
      </div>
    </Card>
  );
} 