import {describe,it,expect} from 'vitest';import{generateLocalPlan}from'../src/services/ai';
const p:any={name:'Test',age:21,height:170,weight:68,activity:'Moderate',preference:'Vegetarian',goal:'Fitness-oriented demo',allergies:''};
describe('local AI fallback',()=>{it('returns all meals and nutrition summary',()=>{const plan=generateLocalPlan(p);expect(plan.breakfast).toBeTruthy();expect(plan.lunch).toBeTruthy();expect(plan.dinner).toBeTruthy();expect(plan.calories).toBeGreaterThan(0);expect(plan.source).toBe('local-fallback')})});
