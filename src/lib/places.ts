import { Restaurant } from '@/types/restaurant';

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

// List of specific restaurant types we want to prioritize
const SPECIFIC_RESTAURANT_TYPES = [
  'american_restaurant',
  'bakery',
  'bar',
  'barbecue_restaurant',
  'brazilian_restaurant',
  'breakfast_restaurant',
  'brunch_restaurant',
  'buffet_restaurant',
  'burger_restaurant',
  'cafe',
  'chinese_restaurant',
  'coffee_shop',
  'dessert_shop',
  'diner',
  'fast_food_restaurant',
  'french_restaurant',
  'greek_restaurant',
  'ice_cream_shop',
  'indian_restaurant',
  'italian_restaurant',
  'japanese_restaurant',
  'korean_restaurant',
  'latin_american_restaurant',
  'mediterranean_restaurant',
  'mexican_restaurant',
  'middle_eastern_restaurant',
  'pizza_restaurant',
  'ramen_restaurant',
  'sandwich_shop',
  'seafood_restaurant',
  'steak_house',
  'sushi_restaurant',
  'thai_restaurant',
  'vietnamese_restaurant',
];

// Function to get the most specific restaurant type
function getMostSpecificRestaurantType(types: string[]): string {
  console.log('Processing types:', types);
  
  // First try to find a specific restaurant type
  const specificType = types.find(type => SPECIFIC_RESTAURANT_TYPES.includes(type));
  if (specificType) {
    return specificType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Then try to find any restaurant type that's not generic
  const restaurantType = types.find(type => 
    type.includes('restaurant') && 
    !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type)
  );
  
  if (restaurantType) {
    return restaurantType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // If no specific type found, return generic restaurant
  return 'Restaurant';
}

async function getPlaceDetails(placeId: string): Promise<any> {
  const response = await fetch(
    `${GOOGLE_PLACES_API_URL}/details/json?` +
    new URLSearchParams({
      place_id: placeId,
      fields: 'name,types,formatted_address,geometry,rating,price_level,photos',
      key: process.env.GOOGLE_PLACES_API_KEY || '',
    })
  );

  if (!response.ok) {
    throw new Error('Failed to fetch place details');
  }

  const data = await response.json();
  return data.result;
}

export async function searchRestaurants(
  zipcode: string,
  radius: number // in miles
): Promise<Restaurant[]> {
  // First, get the coordinates for the zipcode
  const geocodeResponse = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?` +
    new URLSearchParams({
      address: zipcode,
      key: process.env.GOOGLE_PLACES_API_KEY || '',
    })
  );

  const geocodeData = await geocodeResponse.json();
  
  if (geocodeData.status !== 'OK') {
    throw new Error(`Failed to geocode zipcode: ${geocodeData.status}`);
  }

  const location = geocodeData.results[0].geometry.location;
  console.log('Geocoded location:', location);

  // Then search for restaurants near those coordinates
  const response = await fetch(
    `${GOOGLE_PLACES_API_URL}/nearbysearch/json?` +
    new URLSearchParams({
      location: `${location.lat},${location.lng}`,
      radius: (radius * 1609.34).toString(), // Convert miles to meters
      type: 'restaurant',
      key: process.env.GOOGLE_PLACES_API_KEY || '',
    })
  );

  if (!response.ok) {
    throw new Error('Failed to fetch restaurants from Google Places');
  }

  const data = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  // Get detailed information for each restaurant
  const restaurants = await Promise.all(
    data.results.map(async (place: any) => {
      try {
        const details = await getPlaceDetails(place.place_id);
        console.log(`Details for ${place.name}:`, details);
        
        const cuisine = getMostSpecificRestaurantType(details.types || place.types);
        console.log(`Restaurant: ${place.name}, Types: ${details.types || place.types}, Selected Cuisine: ${cuisine}`);
        
        return {
          id: place.place_id,
          name: place.name,
          description: place.vicinity,
          address: details.formatted_address || place.vicinity,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          cuisine,
          price_range: place.price_level ? '$'.repeat(place.price_level) : '$$',
          rating: place.rating || 0,
          image_url: place.photos?.[0]?.photo_reference 
            ? `${GOOGLE_PLACES_API_URL}/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            : null,
        };
      } catch (error) {
        console.error(`Error getting details for ${place.name}:`, error);
        return null;
      }
    })
  );

  // Filter out any failed requests
  return restaurants.filter((restaurant): restaurant is Restaurant => restaurant !== null);
} 