import type { SessionRequest } from '@dindr/contracts';
import { getSessionsServiceUrl } from './service-client';

export async function postSessionAction<T = unknown>(payload: SessionRequest): Promise<T> {
  const response = await fetch(`${getSessionsServiceUrl()}/sessions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
}

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body && typeof body.error === 'string') {
      return body.error;
    }
    return `Sessions service request failed with status ${response.status}`;
  } catch {
    return `Sessions service request failed with status ${response.status}`;
  }
}
