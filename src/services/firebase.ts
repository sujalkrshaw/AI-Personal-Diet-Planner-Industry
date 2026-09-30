import {initializeApp,getApps} from 'firebase/app'; import {getAuth} from 'firebase/auth'; import {getFirestore} from 'firebase/firestore'; import {getStorage} from 'firebase/storage';
const env=import.meta.env;
export const demoMode=env.VITE_DEMO_MODE!=='false';
const config={apiKey:env.VITE_FIREBASE_API_KEY,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN,projectId:env.VITE_FIREBASE_PROJECT_ID,storageBucket:env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:env.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:env.VITE_FIREBASE_APP_ID};
export const firebaseConfigured=Object.values(config).every(Boolean);
export const app=(!demoMode&&firebaseConfigured)?(getApps()[0]??initializeApp(config)):null;
export const auth=app?getAuth(app):null; export const db=app?getFirestore(app):null; export const storage=app?getStorage(app):null;
