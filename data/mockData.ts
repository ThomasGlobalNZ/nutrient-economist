
export interface Product {
    id: string;
    name: string;
    price: number; // NZD - Feb 2026 Snapshot
    unit: string;
    weight_g: number;
    protein_g: number;
    calories: number;
    category: 'protein' | 'carb' | 'veg' | 'fat' | 'fruit' | 'baby';
    image: string;
    brand_tier: 'budget' | 'standard' | 'premium';
    servings_per_unit: number;
    sodium_level: 'low' | 'moderate' | 'high'; // Health safety tag
    store: 'PaknSave' | 'Woolworths' | 'NewWorld' | 'General'; // Updated Source
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isPantryStaple: boolean;
    allergens: string[]; // NEW: Baby safety
    preservatives: string[]; // NEW: Health conscious
}

// ------------------------------------------------------------------
// FEB 2026 HIGH-FIDELITY MARKET SNAPSHOT 
// Prices based on major NZ Supermarket "Budget/Value" lines
// ------------------------------------------------------------------

export const products: Product[] = [
    // --- PROTEINS ---
    { id: 'p1', name: 'Value Beef Mince', price: 13.90, unit: '1kg', weight_g: 1000, protein_g: 180, calories: 2200, category: 'protein', image: '🥩', brand_tier: 'budget', servings_per_unit: 8, sodium_level: 'low', store: 'PaknSave', isVegetarian: false, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'p2', name: 'Waitoa Chicken Breast', price: 14.50, unit: '1kg', weight_g: 1000, protein_g: 310, calories: 1650, category: 'protein', image: '🍗', brand_tier: 'standard', servings_per_unit: 6, sodium_level: 'low', store: 'General', isVegetarian: false, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'p3', name: 'Colony Eggs', price: 14.90, unit: 'Tray (20)', weight_g: 1200, protein_g: 120, calories: 1400, category: 'protein', image: '🥚', brand_tier: 'budget', servings_per_unit: 10, sodium_level: 'low', store: 'PaknSave', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: ['Egg'], preservatives: [] },
    { id: 'p4', name: 'Pams Tuna', price: 2.10, unit: '185g Can', weight_g: 185, protein_g: 45, calories: 200, category: 'protein', image: '🐟', brand_tier: 'budget', servings_per_unit: 2, sodium_level: 'moderate', store: 'NewWorld', isVegetarian: false, isGlutenFree: true, isPantryStaple: true, allergens: ['Fish'], preservatives: [] },
    { id: 'p5', name: 'Value Lentils', price: 1.20, unit: '400g Can', weight_g: 400, protein_g: 36, calories: 320, category: 'protein', image: '🥫', brand_tier: 'budget', servings_per_unit: 2, sodium_level: 'moderate', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: true, allergens: [], preservatives: ['Sulphites'] },
    { id: 'p6', name: 'Hellers Sausages', price: 11.00, unit: '1kg Pack', weight_g: 1000, protein_g: 120, calories: 2800, category: 'protein', image: '🌭', brand_tier: 'budget', servings_per_unit: 8, sodium_level: 'high', store: 'General', isVegetarian: false, isGlutenFree: false, isPantryStaple: false, allergens: ['Soy', 'Gluten', 'Sulphites'], preservatives: ['Sodium Nitrite (250)', 'Sulphur Dioxide (220)'] },
    { id: 'p7', name: 'Premium Angus Mince', price: 18.99, unit: '1kg', weight_g: 1000, protein_g: 190, calories: 2100, category: 'protein', image: '🥩', brand_tier: 'premium', servings_per_unit: 8, sodium_level: 'low', store: 'NewWorld', isVegetarian: false, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },

    // --- CARBS ---
    { id: 'c1', name: 'Value White Rice', price: 9.50, unit: '5kg Bag', weight_g: 5000, protein_g: 350, calories: 18000, category: 'carb', image: '🍚', brand_tier: 'budget', servings_per_unit: 60, sodium_level: 'low', store: 'PaknSave', isVegetarian: true, isGlutenFree: true, isPantryStaple: true, allergens: [], preservatives: [] },
    { id: 'c2', name: 'Value Pasta', price: 1.20, unit: '500g', weight_g: 500, protein_g: 60, calories: 1800, category: 'carb', image: '🍝', brand_tier: 'budget', servings_per_unit: 5, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: false, isPantryStaple: true, allergens: ['Gluten (Wheat)'], preservatives: [] },
    { id: 'c3', name: 'Value White Toast Bread', price: 1.40, unit: 'Loaf', weight_g: 600, protein_g: 48, calories: 1500, category: 'carb', image: '🍞', brand_tier: 'budget', servings_per_unit: 10, sodium_level: 'moderate', store: 'General', isVegetarian: true, isGlutenFree: false, isPantryStaple: false, allergens: ['Gluten (Wheat)', 'Soy'], preservatives: ['Calcium Propionate (282)'] },
    { id: 'c4', name: 'Harraways Rolled Oats', price: 6.20, unit: '1.5kg', weight_g: 1500, protein_g: 195, calories: 5600, category: 'carb', image: '🥣', brand_tier: 'standard', servings_per_unit: 30, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: false, isPantryStaple: true, allergens: ['Gluten (Oats)'], preservatives: [] },
    { id: 'c5', name: 'Ugly Bag Potatoes', price: 5.99, unit: '4kg', weight_g: 4000, protein_g: 80, calories: 3000, category: 'carb', image: '🥔', brand_tier: 'budget', servings_per_unit: 20, sodium_level: 'low', store: 'PaknSave', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'c6', name: 'Orange Kumara', price: 8.99, unit: '1kg', weight_g: 1000, protein_g: 16, calories: 860, category: 'carb', image: '🍠', brand_tier: 'standard', servings_per_unit: 5, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'c7', name: 'Artisan Sourdough', price: 6.50, unit: 'Loaf', weight_g: 600, protein_g: 50, calories: 1400, category: 'carb', image: '🥖', brand_tier: 'premium', servings_per_unit: 8, sodium_level: 'moderate', store: 'NewWorld', isVegetarian: true, isGlutenFree: false, isPantryStaple: false, allergens: ['Gluten (Wheat)'], preservatives: [] },

    // --- VEG ---
    { id: 'v1', name: 'Value Frozen Mixed Veg', price: 3.50, unit: '1kg', weight_g: 1000, protein_g: 30, calories: 600, category: 'veg', image: '🥦', brand_tier: 'budget', servings_per_unit: 10, sodium_level: 'low', store: 'PaknSave', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'v2', name: 'Fresh Carrots', price: 2.50, unit: '1.5kg', weight_g: 1500, protein_g: 15, calories: 600, category: 'veg', image: '🥕', brand_tier: 'budget', servings_per_unit: 15, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'v3', name: 'Brown Onions', price: 2.80, unit: '1.5kg', weight_g: 1500, protein_g: 15, calories: 600, category: 'veg', image: '🧅', brand_tier: 'budget', servings_per_unit: 15, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'v4', name: 'Canned Tomatoes (Diced)', price: 1.10, unit: '400g Can', weight_g: 400, protein_g: 4, calories: 100, category: 'veg', image: '🍅', brand_tier: 'budget', servings_per_unit: 4, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: true, allergens: [], preservatives: ['Citric Acid'] },

    // --- FRUIT ---
    { id: 'f1', name: 'Bananas (Loose)', price: 3.80, unit: '1kg', weight_g: 1000, protein_g: 10, calories: 890, category: 'fruit', image: '🍌', brand_tier: 'standard', servings_per_unit: 8, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'f2', name: 'Apples (Odd Bunch)', price: 4.00, unit: '1.5kg', weight_g: 1500, protein_g: 7, calories: 780, category: 'fruit', image: '🍎', brand_tier: 'budget', servings_per_unit: 10, sodium_level: 'low', store: 'Woolworths', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
    { id: 'f3', name: 'Gold Kiwifruit', price: 7.99, unit: '1kg', weight_g: 1000, protein_g: 11, calories: 610, category: 'fruit', image: '🥝', brand_tier: 'premium', servings_per_unit: 8, sodium_level: 'low', store: 'NewWorld', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },

    // --- DAIRY/FATS ---
    { id: 'd1', name: 'Value Standard Milk', price: 2.90, unit: '2L', weight_g: 2000, protein_g: 66, calories: 1200, category: 'fat', image: '🥛', brand_tier: 'budget', servings_per_unit: 8, sodium_level: 'low', store: 'PaknSave', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: ['Dairy'], preservatives: [] },
    { id: 'd2', name: 'Mild Cheese Block', price: 13.50, unit: '1kg', weight_g: 1000, protein_g: 250, calories: 3800, category: 'fat', image: '🧀', brand_tier: 'budget', servings_per_unit: 25, sodium_level: 'moderate', store: 'PaknSave', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: ['Dairy'], preservatives: ['Sorbic Acid (200)'] },
    { id: 'd3', name: 'Butter (Salted)', price: 6.50, unit: '500g', weight_g: 500, protein_g: 4, calories: 3600, category: 'fat', image: '🧈', brand_tier: 'standard', servings_per_unit: 50, sodium_level: 'moderate', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: true, allergens: ['Dairy'], preservatives: [] },

    // --- BABY ---
    { id: 'b1', name: 'Karicare Formula Step 1', price: 23.50, unit: '900g', weight_g: 900, protein_g: 100, calories: 4500, category: 'baby', image: '🍼', brand_tier: 'standard', servings_per_unit: 30, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: ['Dairy', 'Soy', 'Fish'], preservatives: [] },
    { id: 'b2', name: 'Heinz Nurture Formula', price: 18.00, unit: '900g', weight_g: 900, protein_g: 100, calories: 4500, category: 'baby', image: '🍼', brand_tier: 'budget', servings_per_unit: 30, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: ['Dairy', 'Soy', 'Fish'], preservatives: [] }, // CHEAPER OPTION
    { id: 'b3', name: 'Watties Baby Food', price: 1.90, unit: '120g Pouch', weight_g: 120, protein_g: 2, calories: 80, category: 'baby', image: '👶', brand_tier: 'standard', servings_per_unit: 1, sodium_level: 'low', store: 'General', isVegetarian: true, isGlutenFree: true, isPantryStaple: false, allergens: [], preservatives: [] },
];

export const calculateValueScore = (product: Product) => {
    return (product.protein_g / product.price).toFixed(1);
};
