export type Food={id:string;name:string;serving:string;calories:number;protein:number;carbs:number;fat:number};
// Representative nutrition records for portfolio/demo use. Verify package labels or USDA FoodData Central before clinical use.
export const foods:Food[]=[
{id:'oats',name:'Oatmeal, cooked',serving:'1 cup',calories:166,protein:5.9,carbs:28.1,fat:3.6},
{id:'banana',name:'Banana, raw',serving:'1 medium',calories:105,protein:1.3,carbs:27,fat:.4},
{id:'rice',name:'Brown rice, cooked',serving:'1 cup',calories:218,protein:4.5,carbs:45.8,fat:1.6},
{id:'dal',name:'Lentils, cooked',serving:'1 cup',calories:230,protein:17.9,carbs:39.9,fat:.8},
{id:'paneer',name:'Paneer, Indian cheese',serving:'100 g',calories:265,protein:18,carbs:6,fat:20},
{id:'egg',name:'Egg, whole, cooked',serving:'1 large',calories:78,protein:6.3,carbs:.6,fat:5.3},
{id:'chicken',name:'Chicken breast, roasted',serving:'100 g',calories:165,protein:31,carbs:0,fat:3.6},
{id:'yogurt',name:'Plain yogurt, low-fat',serving:'1 cup',calories:154,protein:12.9,carbs:17.3,fat:3.8},
{id:'apple',name:'Apple, raw',serving:'1 medium',calories:95,protein:.5,carbs:25.1,fat:.3},
{id:'roti',name:'Whole-wheat roti',serving:'1 piece',calories:120,protein:3.5,carbs:18,fat:3}
];
