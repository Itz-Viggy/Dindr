function getBaseUrl(envVar: string, serviceName: string): string {
  const url = process.env[envVar];
  if (!url) {
    throw new Error(`${serviceName} base URL is not configured. Set ${envVar}.`);
  }
  return url.replace(/\/$/, '');
}

export function getDiscoveryServiceUrl(): string {
  return getBaseUrl('DINDR_DISCOVERY_URL', 'Discovery service');
}

export function getSessionsServiceUrl(): string {
  return getBaseUrl('DINDR_SESSIONS_URL', 'Sessions service');
}
