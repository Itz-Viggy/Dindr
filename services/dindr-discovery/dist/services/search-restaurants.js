"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRestaurants = searchRestaurants;
const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';
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
function getMostSpecificRestaurantType(types) {
    const specificType = types.find((type) => SPECIFIC_RESTAURANT_TYPES.includes(type));
    if (specificType) {
        return specificType
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    const restaurantType = types.find((type) => type.includes('restaurant') &&
        !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type));
    if (restaurantType) {
        return restaurantType
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return 'Restaurant';
}
async function getPlaceDetails(placeId) {
    const response = await fetch(`${GOOGLE_PLACES_API_URL}/details/json?` +
        new URLSearchParams({
            place_id: placeId,
            fields: 'name,types,formatted_address,geometry,rating,price_level,photos',
            key: process.env.GOOGLE_PLACES_API_KEY ?? '',
        }), { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
        throw new Error('Failed to fetch place details');
    }
    const data = (await response.json());
    return data.result;
}
async function searchRestaurants(zipcode, radius) {
    const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?` +
        new URLSearchParams({
            address: zipcode,
            key: process.env.GOOGLE_PLACES_API_KEY ?? '',
        }), { signal: AbortSignal.timeout(10000) });
    if (!geocodeResponse.ok) {
        throw new Error('Failed to fetch geocode data');
    }
    const geocodeData = (await geocodeResponse.json());
    if (geocodeData.status !== 'OK') {
        throw new Error(`Failed to geocode zipcode: ${geocodeData.status}`);
    }
    const location = geocodeData.results[0].geometry.location;
    const response = await fetch(`${GOOGLE_PLACES_API_URL}/nearbysearch/json?` +
        new URLSearchParams({
            location: `${location.lat},${location.lng}`,
            radius: (radius * 1609.34).toString(),
            type: 'restaurant',
            key: process.env.GOOGLE_PLACES_API_KEY ?? '',
        }), { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
        throw new Error('Failed to fetch restaurants from Google Places');
    }
    const data = (await response.json());
    if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
    }
    const restaurants = await Promise.all(data.results.map(async (place) => {
        try {
            const details = await getPlaceDetails(place.place_id);
            const cuisine = getMostSpecificRestaurantType(details.types ?? place.types ?? []);
            return {
                id: place.place_id,
                name: place.name,
                description: place.vicinity,
                address: details.formatted_address ?? place.vicinity,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                cuisine,
                price_range: place.price_level ? '$'.repeat(place.price_level) : '$$',
                rating: place.rating ?? 0,
                image_url: place.photos?.[0]?.photo_reference
                    ? `${GOOGLE_PLACES_API_URL}/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
                    : null,
            };
        }
        catch (error) {
            console.error(`Error getting details for ${place.name}:`, error);
            return null;
        }
    }));
    return restaurants.filter((restaurant) => restaurant !== null);
}
