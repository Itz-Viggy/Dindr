import { NextResponse } from 'next/server';
import { searchRestaurants } from '@/lib/places';

export async function POST(request: Request) {
  try {
    console.log('Received search request');
    const body = await request.json();
    console.log('Request body:', body);

    const { radius, zipcode } = body;
    
    if (!zipcode || !/^\d{5}(-\d{4})?$/.test(zipcode)) {
      console.error('Invalid zipcode:', zipcode);
      return NextResponse.json(
        { error: 'Invalid zipcode provided' },
        { status: 400 }
      );
    }

    if (!radius || typeof radius !== 'number' || radius < 1 || radius > 25) {
      console.error('Invalid radius:', radius);
      return NextResponse.json(
        { error: 'Invalid radius provided. Must be between 1 and 25 miles' },
        { status: 400 }
      );
    }

    console.log('Searching restaurants with params:', {
      zipcode,
      radius,
    });

    const restaurants = await searchRestaurants(
      zipcode,
      radius
    );

    console.log(`Found ${restaurants.length} restaurants`);
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error in search route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search restaurants' },
      { status: 500 }
    );
  }
}

// Helper function to calculate distance (same as client-side)
function calculateDistance(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
} 