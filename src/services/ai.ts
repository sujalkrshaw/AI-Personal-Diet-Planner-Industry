import {foods,Food} from '../data/foods';
export type Profile={name:string;age:number;height:number;weight:number;activity:string;preference:string;goal:string;allergies:string};
export type Plan={id:string;createdAt:string;breakfast:Food;lunch:Food;snack:Food;dinner:Food;calories:number;protein:number;note:string;source:'local-fallback'|'ai-api'};
const pick=(names:string[])=>foods.find(f=>names.includes(f.id))!;
export function generateLocalPlan(p:Profile):Plan{
 const vegetarian=p.preference==='Vegetarian'||p.preference==='Vegan';
 const breakfast=pick(['oats']); const lunch=pick(vegetarian?['dal']:['chicken']); const snack=pick(['banana']); const dinner=pick(vegetarian?['paneer']:['egg']);
 const total=[breakfast,lunch,snack,dinner].reduce((s,f)=>s+f.calories,0);
 return {id:crypto.randomUUID(),createdAt:new Date().toISOString(),breakfast,lunch,snack,dinner,calories:total,protein:[breakfast,lunch,snack,dinner].reduce((s,f)=>s+f.protein,0),note:`Educational wellness plan for ${p.goal.toLowerCase()} with ${p.preference.toLowerCase()} preference. Not medical advice.`,source:'local-fallback'};
}
