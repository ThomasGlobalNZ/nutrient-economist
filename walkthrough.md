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

### Verified Features
1.  **Smart Allocation Algo:** Correctly splits budget between Infants (Formula/Pouches) and Adults.
2.  **Dynamic Rendering:** UI updates instantly when budget/people count changes.
3.  **Visual Feedback:** "Survival Mode" triggers correctly on low budgets.
4.  **Tab Navigation:** Smooth transition between Setup, Haul, and Share tabs.
5.  **Smart Swap:** Modal allows swapping items for alternatives in the same category.
6.  **Visual Overhaul:** Premium typography (Plus Jakarta Sans) and card-based UI.
7.  **Granular Allergens:** Multi-select chips for Peanuts, Dairy, Gluten, etc.
8.  **True Value Metrics:** "Best Value" and "High Protein" badges on relevant items.
9.  **Legal Compliance:** Disclaimer modal appears on first visit.
10. **Pricing Realism:** 
    -   **Clubcard Toggle:** Applies simulated discounts to standard/premium items.
    -   **Safety Buffer:** Slider (0%, 5%, 10%) adds a "Cover Your 🍑" margin to the total.
    -   **More Alternatives:** Added GF Bread/Pasta and more Baby Formulas to database.
11. **The "Human Factor":**
    -   **Treat Logic:** If budget permits (> $8 surplus), we automatically add a "Treat" (Whittakers, Arnotts, or Chips). Because life is too short.
    -   **Smart Swaps:** Added **Frozen Veggies** (Stir Fry, Berries) for budget/longevity and **Whole Chicken** for high-value protein.
12. **Value Strategy:**
    -   **Bulk Toggle:** Option to prioritize 5kg Rice/3kg Pasta for long-term savings.
    -   **Clubcard Visibility:** Now explicit shows "Total Savings" in the cart footer.
13. **The Snack Attack:** 
    -   **Dip Protocol:** If you have Chips, the app tries to add **Reduced Cream + Onion Soup** (or Hummus).
    -   **Juice:** If budget is healthy, we add 2.4L Orange Juice.
14. **Feedback Loop:**
    -   Added a "Have feedback?" link in the footer to collect user thoughts via email.
15. **Price Transparency:**
    -   **Was/Now Pricing:** Explicitly shows the original price vs Clubcard price.
    -   **Loyalty Badges:** Tags items with "Everyday Rewards", "Clubcard", or "Club Deal" based on the store.

16. **Refined Bulk Logic:**
    -   "Buy in Bulk" now explicitly targets items >2kg within the same sub-category (e.g. 500g Pasta -> 3kg Pasta).
    -   **Visual Feedback:** Items selected via bulk logic now show a purple **"BULK SAVER 📦"** badge.
17. **Safety Buffer:**
    -   Restored the user-adjustable safety buffer (0-20%) in the "Spend" tab for peace of mind.
18. **Snack Attack 🥝:**
    -   New **"Include Snacks"** toggle in the Diet tab.
    -   Automatically adds Kiwi Classics (Dip, Chips, Biscuits) if budget allows.
    -   **Smart Swaps:** The swap button is now category-aware!
        -   Chips ↔️ Chips (Bluebird, Copper Kettle, Eta, Grain Waves)
        -   Biscuits ↔️ Biscuits (Gingernuts, Toffee Pops, Squiggles, Farmbake, Oreos)
        -   Chocolate ↔️ Chocolate (Whittakers, Cadbury)

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
