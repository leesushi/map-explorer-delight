# Map Explorer Delight

A Next.js (App Router) app that embeds Google Maps with a custom polygon overlay, a pinned destination, and walking directions from the user's location (or a default fallback).

## Features
- Google Maps JavaScript API integration via `@react-google-maps/api`
- Custom polygon overlay that stays anchored to map coordinates while zooming
- Pinned destination loaded from environment variables
- Walking directions with distance/time details
- Geolocation fallback when location access is unavailable

## Environment Variables
Create a `.env` file based on `.env.example`:

```sh
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_PIN_LAT=40.7128
NEXT_PUBLIC_PIN_LONG=-74.0060
```

Make sure these APIs are enabled for your key:
- Maps JavaScript API
- Directions API

## Local Development
```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

## Docker
```sh
cp .env.example .env
docker compose up --build
```

The app will run at `http://localhost:3000`.

## Approach
- App Router entry point renders a client-side map container component.
- Map configuration reads `NEXT_PUBLIC_*` env vars and provides defaults.
- Geolocation hook handles permissions/unavailable cases and falls back to Times Square.
- Directions use the Google DirectionsService with walking mode and render a styled polyline.
