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
  image_url: string | null;
  distance?: number;
  likes?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface RestaurantSearchParams {
  location: Location;
  radius: number;
  cuisine?: string;
  price_range?: string;
  min_rating?: number;
}

export interface SessionRecord {
  id?: number;
  session_id: string;
  status: 'active' | 'inactive';
  restaurants: RestaurantWithLikes[];
  matches: RestaurantWithLikes[];
  created_at: string;
}

export type RestaurantWithLikes = Restaurant & { likes: number };

export type SessionAction =
  | 'create'
  | 'validate'
  | 'join'
  | 'update_restaurant'
  | 'clear_matches';

export interface SessionRequest {
  sessionId: string;
  action: SessionAction;
  restaurant?: Restaurant;
}

export interface SessionResponse {
  exists?: boolean;
  error?: string;
  status?: string;
  restaurants?: RestaurantWithLikes[];
  matches?: RestaurantWithLikes[];
  created_at?: string;
}
