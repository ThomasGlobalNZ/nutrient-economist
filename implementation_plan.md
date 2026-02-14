# Implementation Plan - Phase 13: The Smartest Cart

## Goal Description
Implement the "Smartest Cart" logic by making "Bulk Buying" an automatic, core feature (removing the user toggle) and enabling a "Manual Real Search" that mocks the experience of searching a real supermarket database.

## User Review Required
> [!IMPORTANT]
> **Data Source**: Research confirms that "Grocer NZ" does not expose a public API and prohibits scraping. **Decision**: We will continue using a rich internal database ("Mock Real") that simulates real brands (e.g., Mainland, Anchor) and prices. The system will be structured to swap this for a real API (like a future custom scraper) easily.
> **Auto-Bulk**: The "Buy in Bulk" toggle is gone. The app will now *automatically* upgrading to bulk sizes (e.g., 1kg Rice vs 500g) if it saves money per unit and fits within the total budget.

## Proposed Changes

### Logic & Data
#### [MODIFY] [utils.ts](file:///c:/Users/Tom/Documents/Developer/Side%20Hustle%20Ideas/nutrient-economist/data/utils.ts)
- **Auto-Bulk Logic**: Remove `isBulkBuy` parameter. Implement internal rule: `if (bulkOption.pricePerUnit < standard.pricePerUnit && cartTotal < budget) useBulk()`.
- **Swaps**: Implement `findSwap(product)` to suggest alternatives (e.g., "Butter too pricey? Try Margarine" or "Out of budget? Swap Steaks for Mince").

### UI Components
#### [MODIFY] [ShoppingList.tsx](file:///c:/Users/Tom/Documents/Developer/Side%20Hustle%20Ideas/nutrient-economist/components/ShoppingList.tsx)
- **Manual Add**: Create a search interface that queries our internal "Real Brand" database.
- **Smart Feedback**: If the app auto-swapped to bulk, show a small pill: "Swapped to 1kg (Saved $2.50)".

## Verification Plan
### Manual Verification
- **Auto-Bulk**: Set a high budget, ensure 5kg Rice/Pasta is chosen. Set low budget, ensure 500g/1kg is chosen.
- **Manual Search**: Type "Cheese" and see specific brand options (Mainland, Rolling Meadow) instead of generic "Cheese".
