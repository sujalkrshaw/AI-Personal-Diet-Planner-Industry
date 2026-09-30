# NutriCloud AI — Personal Diet Planner + IoT Smart Scale

An end-to-end portfolio project combining **React, Tailwind CSS, Firebase, serverless APIs, nutrition data, AI fallback logic, and an ESP32/HX711 Wokwi smart-scale pipeline**.

> **Demo-first design:** `VITE_DEMO_MODE=true` is the default, so the dashboard runs locally without Firebase credentials. Firebase/Wokwi integration is included for the production-style demonstration.

## What it demonstrates
- User wellness profile and personalized educational meal-plan generation
- Local AI/rule-based fallback that works without paid AI APIs
- Food logging and daily calorie progress
- Firebase Auth / Firestore / Storage integration points
- Firestore real-time smart-scale listener
- HTTPS Cloud Function for device telemetry with device-key validation
- Wokwi ESP32 + HX711 + OLED simulation
- Firestore security rules for user isolation
- Automated frontend tests and CI-ready structure
- Firebase Hosting + Functions deployment configuration

## Architecture
```text
Wokwi ESP32 + HX711 + OLED
          │ HTTPS POST + device key
          ▼
Cloud Function: ingestScaleTelemetry
          │ Admin SDK
          ▼
Firestore: users/{uid}/scale_readings
          │ onSnapshot()
          ▼
React + Tailwind Dashboard
          │
          ├── Food logging / nutrition data
          └── AI plan + history
```

## 1. Fastest local run (recommended first)
Requirements: Node.js 20+.

```powershell
cd AI-Personal-Diet-Planner-Industry
Copy-Item .env.example .env
npm install
npm test
npm run check
npm run build
npm run dev
```
Open **http://localhost:5173**.

No Firebase account, API key, or Wokwi setup is required for this first run. The local mode generates safe demo telemetry in the browser and persists demo data in localStorage.

## 2. Firebase production-style setup
1. Create a separate Firebase project for this portfolio app.
2. Enable Authentication → Email/Password, Firestore and Storage.
3. Add a Web App and copy its configuration to `.env`.
4. Set `VITE_DEMO_MODE=false`.
5. Install Firebase CLI: `npm install -g firebase-tools`, then `firebase login`.
6. Link the folder: `firebase use --add`.
7. Install/build functions: `npm install --prefix functions` then `npm run --prefix functions build`.
8. Generate a strong device key and store it as a Functions secret: `firebase functions:secrets:set DEVICE_INGEST_KEY`.
9. Deploy: `firebase deploy --only firestore:rules,storage,functions,hosting`.

**Never commit** `.env`, service-account JSON, Firebase Admin private keys, or production device keys.

## 3. Wokwi smart scale
Open `wokwi/smart-scale` in Wokwi/VS Code. The wiring is already in `diagram.json`:

| Component | ESP32 |
|---|---|
| HX711 VCC | 5V |
| HX711 GND | GND |
| HX711 DT | GPIO 16 |
| HX711 SCK | GPIO 4 |
| OLED VCC | 3.3V |
| OLED GND | GND |
| OLED SDA | GPIO 21 |
| OLED SCL | GPIO 22 |
| Status LED | GPIO 2 → 220Ω → GND |

After deploying `ingestScaleTelemetry`, replace `INGEST_URL`, `USER_UID`, and `DEVICE_KEY` in `sketch.ino`. Run the simulation and watch the serial monitor for HTTP 201. The React dashboard will update through Firestore in production mode.

For real hardware, replace simplified TLS handling with CA/certificate validation and use device credentials appropriate to the deployment.

## Nutrition data
`src/data/foods.ts` contains representative food records with transparent source language. For a production data pipeline, use USDA FoodData Central and keep its API key server-side. The project intentionally does not expose an API key in the browser.

## AI safety boundary
The included local engine is an explainable recommendation/fallback layer. Generated plans are **general wellness examples, not medical or clinical nutrition advice**.

## Recruiter proof checklist
Capture real evidence after you run it:
1. Dashboard overview
2. Profile configuration
3. Generated plan
4. Food search + calorie progress
5. Wokwi ESP32/HX711 simulation
6. Firebase Firestore `scale_readings`
7. Live dashboard update after changing simulated telemetry
8. Firebase Security Rules
9. `npm test` output
10. Production Firebase Hosting URL

Do not claim Firebase deployment, live cloud telemetry, USDA import, or passing tests until you have actually run and captured them.

## Suggested GitHub commit sequence
`feat: build dashboard shell` → `feat: add local AI fallback` → `feat: add food logging` → `feat: add Firebase data layer` → `feat: add secure telemetry function` → `feat: add Wokwi smart scale` → `test: add automated coverage` → `docs: add deployment and architecture guide`.
