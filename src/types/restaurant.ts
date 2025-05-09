export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  price_range: string;
  rating: number;
  image_url: string;
  distance?: number; // Will be calculated on the client side
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface RestaurantSearchParams {
  location: Location;
  radius: number; // in kilometers
  cuisine?: string;
  price_range?: string;
  min_rating?: number;
} 