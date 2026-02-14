import { Recipe } from './recipeTypes';

// Import all recipe JSON files
import butterChicken from './recipes/butter-chicken.json';
import spaghettiBolognese from './recipes/spaghetti-bolognese.json';
import chickenStirFry from './recipes/chicken-stir-fry.json';
import beefTacos from './recipes/beef-tacos.json';
import sundayRoast from './recipes/sunday-roast.json';
import porridge from './recipes/porridge.json';

// Recipe database
const recipeDatabase: Recipe[] = [
    butterChicken as Recipe,
    spaghettiBolognese as Recipe,
    chickenStirFry as Recipe,
    beefTacos as Recipe,
    sundayRoast as Recipe,
    porridge as Recipe,
];

/**
 * Get all available recipes
 */
export const getAllRecipes = (): Recipe[] => {
    return recipeDatabase;
};

/**
 * Get recipe by ID
 */
export const getRecipeById = (id: string): Recipe | undefined => {
    return recipeDatabase.find(r => r.id === id);
};

/**
 * Get recipes by meal type
 */
export const getRecipesByMealType = (mealType: 'breakfast' | 'lunch' | 'dinner'): Recipe[] => {
    return recipeDatabase.filter(r => r.mealType.includes(mealType));
};

/**
 * Get recipes by tag
 */
export const getRecipesByTag = (tag: string): Recipe[] => {
    return recipeDatabase.filter(r => r.tags.includes(tag));
};

/**
 * Get recipes with leftovers
 */
export const getLeftoverRecipes = (): Recipe[] => {
    return recipeDatabase.filter(r => r.hasLeftovers);
};

/**
 * Calculate portion multiplier based on family size
 * Adult = 1.0, Child = 0.5, Infant = 0.25
 */
export const calculatePortionMultiplier = (
    adults: number,
    children: number = 0,
    infants: number = 0
): number => {
    return adults * 1.0 + children * 0.5 + infants * 0.25;
};

/**
 * Scale recipe ingredients for family size
 */
export const scaleRecipeIngredients = (
    recipe: Recipe,
    adults: number,
    children: number = 0,
    infants: number = 0
) => {
    const familyPortions = calculatePortionMultiplier(adults, children, infants);
    const scaleFactor = familyPortions / recipe.servings;

    return recipe.ingredients.map(ingredient => ({
        ...ingredient,
        scaledAmount: Math.ceil(ingredient.amount * scaleFactor), // Round up
    }));
};
