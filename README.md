# Dindr

Dindr is a Next.js application for collaboratively discovering nearby restaurants and coordinating matches between friends. The app now delegates heavy data work to two dedicated microservices so the web UI can remain a thin experience layer.

## Architecture overview

- **Next.js UI (`/`)** – Renders the client experience, proxies browser requests to the microservices, and subscribes to Supabase real-time updates to surface matches instantly.
- **Discovery service (`services/dindr-discovery`)** – Handles zipcode geocoding, Google Places searches, and response shaping. Exposes `POST /restaurants/search`.
- **Sessions service (`services/dindr-sessions`)** – Owns Supabase-backed session lifecycle logic. Exposes `POST /sessions` that mirrors the original Next.js API contract.
- **Shared contracts (`packages/contracts`)** – Provides TypeScript interfaces (`Restaurant`, `SessionRequest`, etc.) consumed by the UI and both services.

The Next.js API routes are now thin proxies that forward validated requests to the corresponding service, keeping the browser contract stable while enabling independent deployments.

## Environment variables

| Name | Used by | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Next.js UI | Supabase project URL for client subscriptions. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Next.js UI | Supabase anon key for client use. |
| `DINDR_DISCOVERY_URL` | Next.js UI | Base URL (e.g. `http://localhost:4001`) for the discovery service. |
| `DINDR_SESSIONS_URL` | Next.js UI | Base URL (e.g. `http://localhost:4002`) for the sessions service. |
| `GOOGLE_PLACES_API_KEY` | Discovery service | Google Places API key used for geocoding and place lookups. |
| `SUPABASE_URL` | Sessions service | Supabase project URL for server-side access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Sessions service | Service-role key with permission to mutate session rows. `SUPABASE_ANON_KEY` can be used for local development if the service-role key is unavailable. |

## Local development

1. Install dependencies for each workspace (from the repository root):
   ```bash
   npm install
   (cd services/dindr-discovery && npm install)
   (cd services/dindr-sessions && npm install)
   ```
2. Provide the environment variables described above. For local work you can export them in your shell or create per-service `.env` files.
3. Start the services in separate terminals:
   ```bash
   cd services/dindr-discovery && npm run dev
   cd services/dindr-sessions && npm run dev
   ```
4. Start the Next.js UI (from the repository root):
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to use the app.

## Building the services

Each service compiles to JavaScript via TypeScript:

```bash
cd services/dindr-discovery && npm run build
cd services/dindr-sessions && npm run build
```

Compiled output is written to `dist/` in the respective service directory.

## Testing

Automated tests are not yet configured for the services. For manual verification:

- Call `POST /restaurants/search` with a zipcode and radius to receive a list of normalized restaurants.
- Call `POST /sessions` with actions `create`, `validate`, `join`, `update_restaurant`, and `clear_matches` to verify Supabase-backed workflows.

Feel free to expand on this foundation with integration tests or contract tests between the UI and services.
