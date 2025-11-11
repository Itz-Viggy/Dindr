import type { Restaurant } from '@dindr/contracts';
import { getDiscoveryServiceUrl } from './service-client';

export async function searchRestaurantsViaService(zipcode: string, radius: number): Promise<Restaurant[]> {
  const response = await fetch(`${getDiscoveryServiceUrl()}/restaurants/search`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ zipcode, radius }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await safeReadError(response);
    throw new Error(error ?? 'Failed to fetch restaurants from discovery service');
  }

  return (await response.json()) as Restaurant[];
}

async function safeReadError(response: Response): Promise<string | null> {
  try {
    const payload = await response.json();
    return typeof payload?.error === 'string' ? payload.error : null;
  } catch {
    return null;
  }
}
