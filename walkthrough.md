# SmartKete: AI & Deployment Update 🥝🤖

**Status:** Ready for GitHub Pages Deployment
**Version:** 0.2.0 (AI Chef Edition)

## New Features
### 1. The AI Meal Chef 🧑‍🍳
We've added a mock AI engine that generates meal ideas based on your specific cart items.
-   **Smart Logic:**
    -   *Oats + Milk* -> "Creamy Porridge"
    -   *Mince + Pasta + Tomato* -> "Budget Bolognese"
    -   *Eggs + Bread* -> "Scrambled Eggs on Toast"
-   **Baby Safe Mode:** If you have an infant selected, the AI Chef highlights safety tips (e.g., "Check allergens", "Avoid honey").

### 2. Health & Safety Data 🛡️
We've enriched the product database with critical information for parents:
-   **Allergens:** ⚠️ Warnings for Dairy, Soy, Gluten, Egg, etc.
-   **Preservatives:** 🧪 Alerts for Sulphites, Nitrates, and additives.
-   **Sodium:** 🧂 High Sodium warnings for baby-safe planning.

### 3. GitHub Pages Deployment 🚀
The project is now configured for static export to GitHub Pages.
-   **Config:** Updated `next.config.ts` with `output: 'export'` and `basePath`.
-   **Scripts:** Added `npm run deploy` to automate the build & push process.
-   **Guide:** See `DEPLOY.md` for the exact commands to go live.

## How to Test
1.  **Run Locally:** `npm run dev`
2.  **Add an Infant:** Toggle "Infant" to 1.
3.  **View Meal Plan:** See the new "AI Meal Chef" box and allergen tags.

## How to Deploy
1.  **Install Tool:** `npm install -D gh-pages`
2.  **Deploy:** `npm run deploy`
3.  **View:** Go to `https://ThomasGlobalNZ.github.io/nutrient-economist` (after enabling Pages in GitHub Settings).
