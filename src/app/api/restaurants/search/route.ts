import { NextResponse } from 'next/server';
import { searchRestaurantsViaService } from '@/lib/services/discovery-client';

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

    const restaurants = await searchRestaurantsViaService(zipcode, radius);

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
