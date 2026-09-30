import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const DEVICE_INGEST_KEY = defineSecret("DEVICE_INGEST_KEY");

setGlobalOptions({
  region: "asia-south1",
  maxInstances: 10,
});

initializeApp();

const db = getFirestore();

export const ingestScaleTelemetry = onRequest(
  { secrets: [DEVICE_INGEST_KEY] },
  async (req, res): Promise<void> => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "method_not_allowed" });
        return;
      }

      const key = req.header("x-device-key");
      const expected = DEVICE_INGEST_KEY.value();

      if (!expected || key !== expected) {
        res.status(401).json({ error: "unauthorized_device" });
        return;
      }

      const { uid, deviceId, weightKg, batteryPct } = req.body || {};

      if (
        typeof uid !== "string" ||
        typeof deviceId !== "string" ||
        typeof weightKg !== "number" ||
        typeof batteryPct !== "number"
      ) {
        res.status(400).json({ error: "invalid_payload" });
        return;
      }

      const ref = await db
        .collection("users")
        .doc(uid)
        .collection("scale_readings")
        .add({
          uid,
          deviceId,
          weightKg,
          batteryPct,
          timestamp: FieldValue.serverTimestamp(),
        });

      res.status(201).json({
        ok: true,
        readingId: ref.id,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "internal_error" });
    }
  }
);
