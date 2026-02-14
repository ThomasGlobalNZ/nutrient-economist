// Recipe Type Definitions

export interface RecipeIngredient {
    productId: string; // Links to mockData.ts Product.id
    amount: number;
    unit: string; // 'g', 'ml', 'whole', 'can', etc.
    name: string; // Human readable name
}

export interface Recipe {
    id: string;
    name: string;
    emoji: string; // Visual identifier
    servings: number; // Base servings (e.g., 4 adults)
    prepTime: number; // minutes - NEW: separate prep from cook
    cookTime: number; // minutes
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[]; // ['comfort', 'asian', 'freezer-friendly', 'quick']
    hasLeftovers: boolean; // Makes enough for 2+ meals
    mealType: ('breakfast' | 'lunch' | 'dinner')[]; // Can be multiple
    ingredients: RecipeIngredient[];
    steps: string[];
    image?: string; // Optional photo path
    notes?: string; // Chef's tips
}

export interface MealPlan {
    [day: string]: { // 'mon', 'tue', etc.
        breakfast?: string; // recipe.id or 'leftover'
        lunch?: string;
        dinner?: string;
    };
}

export interface ScaledIngredient extends RecipeIngredient {
    scaledAmount: number; // Adjusted for family size
    productMatch?: any; // Matched Product from mockData
}
