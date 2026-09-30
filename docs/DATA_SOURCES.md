# Data Sources

- `src/data/foods.ts`: small representative demo dataset used to keep the local demo deterministic. Values should be rechecked against authoritative food labels before real-world use.
- `scripts/seed-usda-foods.mjs`: optional server-side import path for USDA FoodData Central. It requires `USDA_API_KEY` and writes provenance fields into `sample_data/usda-foods.json`. Never expose the key in the frontend or commit it.
