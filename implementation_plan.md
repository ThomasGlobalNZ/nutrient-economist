# Implementation Plan - Allergens, AI, and Deployment

## Goal Description
The goal is to enhance the Nutrient Economist app by adding detailed product information (allergens, preservatives), implementing an AI-driven meal suggestion feature (initially mocked directly in the app for "Phase 6"), and configuring the project for deployment to GitHub Pages.

## User Review Required
> [!IMPORTANT]
> **AI Implementation**: I will implement a "Mock AI" service initially that generates recipes based on the cart items locally. This ensures the app works immediately without requiring an API key.
> **Deployment**: I will configure `next.config.ts` for a static export, which is required for GitHub Pages.

## Proposed Changes

### Data Layer
#### [MODIFY] [mockData.ts](file:///c:/Users/Tom/Documents/Developer/Side%20Hustle%20Ideas/nutrient-economist/data/mockData.ts)
- Update `Product` interface to include `allergens: string[]` and `preservatives: string[]`.
- Populate `products` data with common baby allergens (e.g., dairy, soy, egg) and preservatives (e.g., nitrates, sulphites).

### UI Components
#### [MODIFY] [MealPlan.tsx](file:///c:/Users/Tom/Documents/Developer/Side%20Hustle%20Ideas/nutrient-economist/components/MealPlan.tsx)
- Enhance to show "AI Suggestions" based on the cart.
- Display allergens and preservatives warnings next to items.

#### [NEW] [AiChef.tsx](file:///c:/Users/Tom/Documents/Developer/Side%20Hustle%20Ideas/nutrient-economist/components/AiChef.tsx)
- A new component to simulate the AI Meal Chef.
- Takes the cart as input and "generates" recipes (Breakfast, Lunch, Dinner).
- Logic:
    - If cart has Oats + Milk -> Suggest "Creamy Porridge".
    - If cart has Eggs + Toast -> Suggest "Scrambled Eggs on Toast".
    - If cart has Mince + Pasta + Tomato -> Suggest "Bolognese".

### Configuration
#### [MODIFY] [next.config.ts](file:///c:/Users/Tom/Documents/Developer/Side%20Hustle%20Ideas/nutrient-economist/next.config.ts)
- Add `output: 'export'` for static site generation.
- Add `basePath: '/nutrient-economist'` for correct asset loading on GitHub Pages.
- Add `images: { unoptimized: true }` for compatibility with GitHub Pages.

## Verification Plan
### Automated Tests
- Build the project using `npm run build` to ensure static export works.
### Manual Verification
- Verify that products show allergen/preservative info.
- Verify that the "AI Chef" shows reasonable recipes based on the selected items.
- Verify that the deployment guide includes the command to build and deploy to the `gh-pages` branch.
