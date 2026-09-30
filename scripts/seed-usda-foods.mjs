import fs from "node:fs/promises";
const key=process.env.USDA_API_KEY;
if(!key){console.error("Missing USDA_API_KEY. Get a data.gov/FoodData Central key and keep it server-side.");process.exit(1)}
const foods=["oatmeal","banana","brown rice","lentils","egg","chicken breast","plain yogurt","apple"];
const out=[];
for(const q of foods){const r=await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(q)}&pageSize=1`);if(!r.ok)throw new Error(`${q}: ${r.status}`);const d=await r.json();const f=d.foods?.[0];if(f)out.push({fdcId:f.fdcId,name:f.description,source:"USDA FoodData Central",publishedAt:new Date().toISOString()})}
await fs.mkdir("sample_data",{recursive:true});await fs.writeFile("sample_data/usda-foods.json",JSON.stringify(out,null,2));console.log(`Imported ${out.length} records.`);
