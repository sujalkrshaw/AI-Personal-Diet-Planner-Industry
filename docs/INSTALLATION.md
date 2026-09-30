# Installation — Windows 10/11

## Phase A: prove the app works locally
```powershell
node --version
npm --version
cd AI-Personal-Diet-Planner-Industry
Copy-Item .env.example .env
npm install
npm test
npm run check
npm run build
npm run dev
```
If a command fails, fix that command before moving to Firebase.

## Phase B: Firebase
Create a dedicated Firebase project, enable Email/Password Auth, Firestore and Storage, register a Web App, and place its web configuration in `.env`. Then:
```powershell
npm install -g firebase-tools
firebase login
firebase use --add
npm install --prefix functions
npm run --prefix functions build
firebase deploy --only firestore:rules,storage,functions,hosting
```

## Phase C: Wokwi
Deploy the Functions first. Put the resulting `ingestScaleTelemetry` URL, demo user's UID, and device key into `wokwi/smart-scale/sketch.ino`. Start Wokwi. A successful telemetry request should return HTTP 201 and create a Firestore document.
