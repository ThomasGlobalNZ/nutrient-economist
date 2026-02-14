import { GeneratedCart, CartItem } from './utils';
import { Product } from './mockData';

export type ChefStyle = 'standard' | 'batch_cook' | 'low_effort';
export type ChefHealth = 'balanced' | 'protein_focus' | 'comfort';

export interface Meal {
    id: string;
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    ingredients: string[];
    prepTime: number; // minutes
    isLeftover: boolean;
    emoji: string;
}

export interface DayPlan {
    day: string; // Mon, Tue, etc.
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
}

export interface ChefPlan {
    schedule: DayPlan[];
    insights: string[]; // "Cheeky tips"
}

// --- RECIPE DATABASE (Internal Knowledge) ---
// In a real AI, this would be generated. Here, we use "Heuristic Templates" via strict rules.

const BREAKFAST_TEMPLATES = [
    { name: "Oats & Fruits", keys: ['Oats', 'Milk'], emoji: '🥣', prep: 5 },
    { name: "Scrambled Eggs on Toast", keys: ['Eggs', 'Bread'], emoji: '🍳', prep: 10 },
    { name: "Peanut Butter Toast", keys: ['Bread', 'Peanut Butter'], emoji: '🍞', prep: 3 },
    { name: "Yoghurt & Muesli", keys: ['Yoghurt'], emoji: 'parfait', prep: 2 },
    { name: "Leftover Savoury Brekkie", keys: [], emoji: '🥡', prep: 5 },
];

const LUNCH_TEMPLATES = [
    { name: "Ham & Cheese Sandwiches", keys: ['Bread', 'Ham', 'Cheese'], emoji: '🥪', prep: 5 },
    { name: "Chicken Salad", keys: ['Chicken', 'Salad'], emoji: '🥗', prep: 10 },
    { name: "Tuna Pasta Salad", keys: ['Tuna', 'Pasta', 'Mayo'], emoji: '🍝', prep: 15 },
    { name: "Egg Salad Sandwich", keys: ['Eggs', 'Bread', 'Mayo'], emoji: '🥪', prep: 10 },
    { name: "Leftover Dinner", keys: [], emoji: '🥡', prep: 2, isLeftover: true },
];

const DINNER_TEMPLATES = [
    // Mince Based
    { name: "Spag Bol", keys: ['Mince', 'Pasta', 'Tomato'], emoji: '🍝', prep: 25 },
    { name: "Savoury Mince & Rice", keys: ['Mince', 'Rice', 'Veg'], emoji: '🍚', prep: 20 },

    // Sausage Based
    { name: "Sausages & Mash", keys: ['Sausages', 'Potatoes'], emoji: '🌭', prep: 20 },
    { name: "Curried Sausages", keys: ['Sausages', 'Rice'], emoji: '🍛', prep: 25 },

    // Chicken Based
    { name: "Chicken Stir Fry", keys: ['Chicken', 'Veg'], emoji: 'wok', prep: 15 },
    { name: "Roast Chicken & Veg", keys: ['Chicken', 'Potatoes', 'Veg'], emoji: '🍗', prep: 45 },

    // Vegetarian / Budget
    { name: "Lentil Bolognese", keys: ['Lentils', 'Pasta', 'Tomato'], emoji: '🍝', prep: 20 },
    { name: "Egg Fried Rice", keys: ['Eggs', 'Rice', 'Veg'], emoji: '🍳', prep: 15 },
    { name: "Tofu Curry", keys: ['Tofu', 'Rice'], emoji: '🍛', prep: 20 },
    { name: "Beans on Toast (Budget Night)", keys: ['Beans', 'Bread'], emoji: '🫘', prep: 5 },
];

// --- ENGINE ---

export const generateMealPlan = (
    cart: GeneratedCart,
    style: ChefStyle = 'standard',
    health: ChefHealth = 'balanced',
    hasPantryStaples: boolean = false
): ChefPlan => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const schedule: DayPlan[] = [];

    // 1. ANALYZE CART (What do we actually have?)
    // Relaxed Matching:
    // - If hasPantryStaples is TRUE, we assume we have 'Pasta', 'Rice', 'Flour', 'Oil', 'Spices', 'Mayo', 'Peanut Butter'.
    const pantryAssumptions = ['Pasta', 'Rice', 'Oil', 'Mayo', 'Peanut Butter'];
    if (hasPantryStaples) {
        pantryAssumptions.push('Tomato'); // Let's simplify and say they have minimal cans.
    }

    const hasItem = (key: string) => {
        // 1. Check Cart
        const inCart = cart.items.some(i => i.product.name.includes(key) || i.product.category.includes(key.toLowerCase()));
        if (inCart) return true;

        // 2. Check Pantry Assumptions
        if (hasPantryStaples && pantryAssumptions.includes(key)) return true;

        // 3. Category Fallbacks
        if (key === 'Veg') return cart.items.some(i => i.product.category === 'veg');

        return false;
    };

    const availableBreak = BREAKFAST_TEMPLATES.filter(t => t.keys.every(k => hasItem(k)));
    const availableLunch = LUNCH_TEMPLATES.filter(t => t.keys.every(k => hasItem(k)));
    const availableDinner = DINNER_TEMPLATES.filter(t => t.keys.every(k => hasItem(k)));

    // Fallbacks if cart is empty/weird
    if (availableBreak.length === 0) availableBreak.push(BREAKFAST_TEMPLATES[0]);
    if (availableLunch.length === 0) availableLunch.push(LUNCH_TEMPLATES[0]); // Sandwich Fallback
    if (availableDinner.length === 0) availableDinner.push(DINNER_TEMPLATES[DINNER_TEMPLATES.length - 1]); // Beans fallback

    // 2. GENERATE SCHEDULE
    let lastDinner: Meal | null = null;

    for (let i = 0; i < cart.durationDays; i++) {
        const dayName = days[i % 7];

        // BREAKFAST: Rotate between 2 options to keep it interesting but simple
        const bTemplate = availableBreak[i % availableBreak.length];

        // DINNER: Rotate through available dinners
        // If Batch Cooking, cook once every 3 days
        let dTemplate = availableDinner[i % availableDinner.length];
        if (style === 'batch_cook') {
            const batchIndex = Math.floor(i / 3); // Change every 3 days
            dTemplate = availableDinner[batchIndex % availableDinner.length];
        }

        // LUNCH: 
        // If BatchCook or LowEffort, try to use Leftovers
        let lTemplate = availableLunch[0];
        if ((style === 'batch_cook' || style === 'low_effort') && lastDinner) {
            lTemplate = { ...lastDinner, name: `Leftover ${lastDinner.name}`, isLeftover: true, prep: 2, keys: [] };
        } else {
            lTemplate = availableLunch[i % availableLunch.length];
        }

        // Construct Meals
        const breakfast: Meal = {
            id: `b-${i}`, name: bTemplate.name, type: 'breakfast',
            ingredients: bTemplate.keys, prepTime: bTemplate.prep, isLeftover: false, emoji: bTemplate.emoji
        };

        const lunch: Meal = {
            id: `l-${i}`, name: lTemplate.name, type: 'lunch',
            ingredients: lTemplate.keys || [], prepTime: lTemplate.prep, isLeftover: !!lTemplate.isLeftover, emoji: lTemplate.emoji
        };

        const dinner: Meal = {
            id: `d-${i}`, name: dTemplate.name, type: 'dinner',
            ingredients: dTemplate.keys, prepTime: dTemplate.prep, isLeftover: false, emoji: dTemplate.emoji
        };

        schedule.push({ day: dayName, breakfast, lunch, dinner, snacks: [] });
        lastDinner = dinner;
    }

    // 3. GENERATE INSIGHTS
    const insights = [
        "💡 Cheeky Tip: If you run out of milk, switched to black coffee. It's cheaper and makes you look intense.",
        style === 'batch_cook' ? "🔥 You're in Batch Mode! Cook once, eat like a king for 3 days." : "✨ Variety Mode! New dinner every night.",
    ];

    return { schedule, insights };
};
