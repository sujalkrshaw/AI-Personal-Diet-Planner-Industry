import { demoMode, db } from './firebase';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

export type Scale = {
  weightKg: number;
  batteryPct: number;
  deviceId: string;
  timestamp: string;
};

const KEY = 'nutricloud-demo';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function write(value: any) {
  localStorage.setItem(KEY, JSON.stringify(value));
}

export async function saveProfile(uid: string, profile: any) {
  if (!demoMode && db) {
    return setDoc(doc(db, 'users', uid), profile, { merge: true });
  }

  const data = read();
  data.profile = profile;
  write(data);
}

export async function addFood(uid: string, food: any) {
  if (!demoMode && db) {
    return addDoc(
      collection(db, 'users', uid, 'food_logs'),
      {
        ...food,
        createdAt: serverTimestamp(),
      },
    );
  }

  const data = read();
  data.foods = [
    ...(data.foods || []),
    {
      ...food,
      createdAt: new Date().toISOString(),
    },
  ];
  write(data);
}

export async function savePlan(uid: string, plan: any) {
  if (!demoMode && db) {
    return addDoc(collection(db, 'users', uid, 'diet_plans'), plan);
  }

  const data = read();
  data.plans = [...(data.plans || []), plan];
  write(data);
}

export function subscribeScale(
  uid: string,
  callback: (rows: Scale[]) => void,
) {
  if (!demoMode && db) {
    return onSnapshot(
      query(
        collection(db, 'users', uid, 'scale_readings'),
        orderBy('timestamp', 'desc'),
      ),
      (snapshot) => {
        callback(
          snapshot.docs
            .map((document) => document.data() as Scale)
            .slice(0, 20),
        );
      },
    );
  }

  const tick = () => {
    const data = read();
    const previousWeight = data.scale?.[0]?.weightKg ?? 70.5;

    const variation = (Math.random() - 0.5) * 0.16;
    const nextWeight =
      Math.round((previousWeight + variation) * 10) / 10;

    const row: Scale = {
      weightKg: nextWeight,
      batteryPct: 94,
      deviceId: 'ESP32-SCALE-001',
      timestamp: new Date().toISOString(),
    };

    data.scale = [row, ...(data.scale || [])].slice(0, 20);

    write(data);
    callback(data.scale);
  };

  tick();

  const timer = window.setInterval(tick, 4000);

  return () => window.clearInterval(timer);
}

export function loadDemo() {
  return read();
}
