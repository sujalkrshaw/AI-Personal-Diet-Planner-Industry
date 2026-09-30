# Architecture

## Data flow
1. React collects a demo wellness profile.
2. Local AI fallback creates a structured plan.
3. Food logs are stored locally in demo mode or in `users/{uid}/food_logs` in Firestore.
4. Wokwi simulates an ESP32 smart scale.
5. ESP32 posts JSON over HTTPS to `ingestScaleTelemetry`.
6. Cloud Function validates the device key and UID, then writes a scale reading.
7. React subscribes with Firestore `onSnapshot` and renders the newest weight without refresh.

## Security boundaries
The browser never receives a Firebase Admin service account. Device ingestion uses a separate secret. Firestore and Storage rules restrict user-owned records to the authenticated UID.
