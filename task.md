# Tasks

- [x] Research KaiWise app features and unique selling points <!-- id: 0 -->
- [x] Brainstorm 3-5 unique "smart" conceptual variations <!-- id: 1 -->
- [x] Research top consumer pain points in New Zealand (Housing, Cost of Living, etc.) <!-- id: 3 -->
- [x] Brainstorm 3-5 non-food app concepts for the NZ market <!-- id: 4 -->
- [x] Present non-food concepts to user for feedback <!-- id: 5 -->
- [x] Analyze 'Grocer' app features and identify gaps <!-- id: 6 -->
- [x] Refine or pivot concepts based on competitive landscape <!-- id: 7 -->
- [x] Present refined concepts to user <!-- id: 8 -->
- [x] Create Implementation Plan for "The Nutrient Economist" <!-- id: 9 -->
- [x] Develop MVP (Web App) <!-- id: 10 -->
- [x] Brainstorm and select a unique NZ brand name ("SmartKete") <!-- id: 11 -->
- [x] Update app branding to **SmartKete** (Logo, Title, Metadata) <!-- id: 12 -->
- [x] **Phase 2.5: Mechanics Refinement** <!-- id: 21 -->
    - [x] Verify mathematical viability of "Smart Cart" <!-- id: 22 -->
    - [x] Implement "Meal Plan View" (Breakfast/Lunch/Dinner distribution) <!-- id: 23 -->
    - [x] Update Data: Add Seasonal Fruit, Avocados, Baby Formula <!-- id: 24 -->
    - [x] Add "Family Composition" Input (Adults, Infants) <!-- id: 25 -->
    - [x] Update Logic: Prioritize Baby Formula if infant present <!-- id: 26 -->
    - [x] **Refine Metrics:** Fix "Meals" count to track **Main Meals** (Protein) not just servings <!-- id: 27 -->
    - [x] Remove Meal Plan Toggle (Deferred to AI feature) <!-- id: 28 -->
- [x] **Phase 3: Real Data Integration (Revised)** <!-- id: 13 -->
    - [x] Research NZ grocery data sources (Woolworths/New World blocked) <!-- id: 14 -->
    - [x] **Create "Feb 2026 Manual Snapshot"** (High-fidelity mock data) <!-- id: 32 -->
    - [x] Clean up failed scraper code <!-- id: 35 -->
- [x] **Phase 4: Personalization (Health & Safety)** <!-- id: 16 -->
    - [x] **Implement "Low Sodium for Infants" Logic** (Avoid Brine/High Salt) <!-- id: 38 -->
    - [x] **Add "Excluded Items" Toggles** (Vegetarian / Gluten Free) <!-- id: 36 -->
    - [x] **Add "Pantry Staples" Checks** (Rice/Pasta, Oil/Butter) <!-- id: 37 -->
    - [x] **Add "Store Preference" Selector** (Pak'nSave / Woolworths / New World) <!-- id: 39 -->
- [x] **Phase 5: Deployment** <!-- id: 18 -->
    - [x] **Final Polish:** Remove metric display (simplify UI) <!-- id: 40 -->
    - [x] **UX Polish:** Clearer Units & Smart Formula Selection <!-- id: 47 -->
    - [x] **Build & Verify PWA** <!-- id: 19 -->
    - [x] **Create Deployment Guide (DEPLOY.md)** <!-- id: 42 -->
    - [x] **READY FOR DEPLOYMENT** <!-- id: 41 -->

## Phase 6: Future Roadmap
- [x] **AI Meal Chef:** Integrate LLM (Mocked) to generate recipes from Smart Cart <!-- id: 43 -->
    - [x] **Detail Polish:** Split Prep/Cook times for clearer planning <!-- id: 43a -->
    - [x] **Smart Logic:** Auto-add "Baby Friendly" tips if infant selected <!-- id: 43b -->
    - [x] **Tone of Voice:** Inject "Kiwi/Cheeky" personality <!-- id: 43c -->
    - [x] **Meal Prep Hints:** Add "Batch Cook" tips for parents <!-- id: 43d -->
- [ ] **Polishing:** Add cool animations/micro-interactions <!-- id: 48 -->

## Phase 6.5: AI & Data Enhancement (Current Focus)
- [x] **Data Update:** Add Allergens & Preservatives to Product Data <!-- id: 60 -->
- [x] **AI Feature:** Implement "Mock AI Chef" logic for daily meal plans <!-- id: 61 -->
- [x] **UI Update:** Display allergen warnings and meal suggestions <!-- id: 62 -->
- [x] **Deployment Config:** Setup Next.js for GitHub Pages (Static Export) <!-- id: 63 -->

## Phase 6.6: Health & Safety Refinement
- [x] **Data/UI Update:** Add "Preservative Free" Filter <!-- id: 70 -->
- [x] **Data/UI Update:** Add "Infant Allergen Awareness" (Highlighting/Filtering) <!-- id: 71 -->

## Phase 7: Final Deployment
> See `DEPLOY_CHECKLIST.md` for detailed steps on GitHub, Vercel, and Domain setup.
- [ ] **Initialize Git & Push to GitHub** <!-- id: 50 -->
- [ ] **Deploy to Vercel** <!-- id: 51 -->
- [ ] **Integrate Real AI API** <!-- id: 52 -->

## Phase 8: SmartKete V2 (The Upgrade)
- [x] **Data Layer Refactor:** Implement calculated "Needs vs Budget" logic <!-- id: 80 -->
- [x] **Data Layer Refactor:** Add Duration (7/14 days) and Meal Frequency (3-5) <!-- id: 81 -->
- [x] **UI Overhaul:** Implement Tabbed Interface (Setup / Haul / Share) <!-- id: 82 -->
- [x] **Phase 8: Deployment (GitHub Pages)**
    - [x] **Config:** Set `output: 'export'` and `basePath` in `next.config.ts` <!-- id: 82 -->
    - [x] **Script:** Add `deploy` script to `package.json` (with `-t` flag for dotfiles) <!-- id: 83 -->
    - [x] **Deploy:** Run `npm run deploy` <!-- id: 86 -->

- [ ] **Phase 8.5: Refinements**
    - [x] **Fix Bulk Buy Logic:** Prioritize >2kg items correctly <!-- id: 90 -->
    - [x] **Restore Safety Buffer:** Add slider back to UI <!-- id: 91 -->
- [x] **Phase 9: Snack Attack (User Request)**
    - [x] **Data:** Add Kiwi Classics (Onion Soup + Reduced Cream, Griffins) <!-- id: 95 -->
    - [x] **UI:** Add "Include Snacks" Toggle in Diet Tab <!-- id: 96 -->
    - [x] **Logic:** specific "Snack Filling" algorithm <!-- id: 97 -->
- [x] **Phase 10: Feedback & Data Crowdsourcing (User Request)**
    - [x] **UI:** Create `CrowdsourceModal` for "Real Spend" input <!-- id: 100 -->
    - [x] **Integration:** Add "Verify Shop" button in Shopping List <!-- id: 101 -->
    - [x] **Logic:** Generate `mailto` link with structured data <!-- id: 102 -->
- [x] **Phase 11: Manual Entry & Store Expansion (User Request)**
    - [x] **Data:** Add `FreshChoice`, `TheKaiCo` to Store options <!-- id: 105 -->
    - [x] **UI:** Create `AddCustomItemModal` with search functionality <!-- id: 106 -->
    - [x] **Integration:** Add "Add Custom Item" button to Shopping List <!-- id: 107 -->
- [x] **Phase 12: UI Fixes (User Request)**
    - [x] **Meals Tab:** Implement MealPlanningWizard in meals tab <!-- id: 110 -->
    - [x] **Safety Buffer:** Remove UI selector (keep hardcoded 5%) <!-- id: 111 -->
    - [x] **Staples:** Move checkbox from Budget to Diet tab <!-- id: 112 -->
    - [x] **Navigation:** Update flow to include Meals tab <!-- id: 113 -->
