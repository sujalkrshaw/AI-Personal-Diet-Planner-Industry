import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'firebase/auth';
import {auth,demoMode} from './firebase';
export const register=(email:string,password:string)=>{if(demoMode||!auth) return Promise.resolve({demo:true});return createUserWithEmailAndPassword(auth,email,password)};
export const login=(email:string,password:string)=>{if(demoMode||!auth) return Promise.resolve({demo:true});return signInWithEmailAndPassword(auth,email,password)};
export const logout=()=>auth?signOut(auth):Promise.resolve();
export const observeAuth=(cb:(user:any)=>void)=>auth?onAuthStateChanged(auth,cb):(()=>{});
