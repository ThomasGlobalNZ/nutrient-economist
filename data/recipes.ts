
import { CartItem } from './utils';

export interface Recipe {
    id: string;
    title: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string[];
    matchingIngredients: string[];
    tags: string[];
    chefTreat?: string;
    batchPrepTip?: string;
}

// SIMULATED AI RESPONSE
export const generateMockRecipes = (cartItems: CartItem[], infantCount: number = 0): Recipe[] => {
    const itemNames = cartItems.map(i => i.product.name.toLowerCase());
    const recipes: Recipe[] = [];

    // HELPER: Add Baby Step if needed
    const addBabyStep = (steps: string[]) => {
        if (infantCount > 0) {
            return [...steps, '👶 BABY PREP: Blitz/Puree a portion before you salt it. Smooth as silk for the wee one.'];
        }
        return steps;
    };

    const getTags = (baseTags: string[]) => {
        if (infantCount > 0) return [...baseTags, 'Baby Friendly', 'Batch Cook'];
        return baseTags;
    };

    // 1. MINCE + PASTA -> Bolognese 
    if (itemNames.some(n => n.includes('mince')) && itemNames.some(n => n.includes('pasta') || n.includes('sauce') || n.includes('tomato'))) {
        recipes.push({
            id: 'r1',
            title: 'Spag Bol on a Budget',
            prepTime: '10 mins',
            cookTime: '25 mins',
            ingredients: ['Beef Mince', 'Pasta', 'Canned Tomatoes', 'Onions', 'Mixed Veg'],
            instructions: addBabyStep([
                'Chuck the mince in a pan with the onions. Brown it off.',
                'Dump in the tomatoes and simmer for a bit (10 mins).',
                'Stir in the frozen veg to keep it healthy(ish).',
                'Slap it over boiled pasta and you\'re sorted.'
            ]),
            matchingIngredients: ['p1', 'c2', 'v4', 'v3', 'v1'],
            tags: getTags(['Classic', 'High Protein']),
            chefTreat: 'Pairs well with a cheeky Red (or a cold cola).',
            batchPrepTip: '❄️ FREEZER GOLD: Cook double. Freeze half. Future you will thank past you when the chaotic weeknight hits.'
        });
    }

    // 2. CHICKEN + RICE -> Stir Fry 
    if (itemNames.some(n => n.includes('chicken')) && itemNames.some(n => n.includes('rice'))) {
        recipes.push({
            id: 'r2',
            title: 'Chook & Veggie Rice',
            prepTime: '10 mins',
            cookTime: '15 mins',
            ingredients: ['Chicken Breast', 'Rice', 'Mixed Veg', 'Soy Sauce (Pantry)'],
            instructions: addBabyStep([
                'Dice the chook and fry it till it\'s golden.',
                'Toss in the frozen veg and cook for 5.',
                'Mix in the rice and soy sauce.',
                'Get it in ya.'
            ]),
            matchingIngredients: ['p2', 'c1', 'v1'],
            tags: getTags(['Quick', 'Healthy', 'Lean']),
            chefTreat: 'Goes great with a crisp Sauvignon Blanc.',
            batchPrepTip: '🕒 SAVE TIME: Dice the chicken and chop any fresh veg on Sunday. Throw it in the pan Monday night - done in 10.'
        });
    }

    // 3. ROAST VEG + PROTEIN -> Tray Bake (USER REQUESTED)
    // Matches if we have Mixed Veg or Potatoes + Any Protein
    if (itemNames.some(n => n.includes('veg') || n.includes('potato')) && itemNames.some(n => n.includes('meat') || n.includes('chicken') || n.includes('mince') || n.includes('sausage'))) {
        recipes.push({
            id: 'r_roast',
            title: 'The "Chuck it in the Oven" Roast',
            prepTime: '5 mins',
            cookTime: '30 mins',
            ingredients: ['Any Protein', 'Mixed Veg / Potatoes', 'Oil & Spices (Pantry)'],
            instructions: addBabyStep([
                'Toss the veg in oil and whatever spices you\'ve got in the cupboard.',
                'Chuck them in the oven at 200°C for 20 mins.',
                'While that\'s happening, season your protein and fry it up in a pan.',
                'Throw it all together at the end. Easy as.'
            ]),
            matchingIngredients: ['v1', 'p5'], // Generic matches
            tags: getTags(['Healthy', 'Low Effort', 'Gluten Free']),
            chefTreat: 'Perfect time for a beer while the oven does the work.',
            batchPrepTip: '🍱 LUNCH PREP: Roast a massive tray of veg. Use it for salads/sides all week.'
        });
    }

    // 4. LENTILS + POTATO -> Shepherd's Pie 
    if (itemNames.some(n => n.includes('lentil') || n.includes('mince')) && itemNames.some(n => n.includes('potato'))) {
        recipes.push({
            id: 'r3',
            title: 'Proper Cottage Pie',
            prepTime: '20 mins',
            cookTime: '40 mins',
            ingredients: ['Mince or Lentils', 'Potatoes', 'Mixed Veg', 'Milk/Butter'],
            instructions: addBabyStep([
                'Cook up the base (Mince or Lentils) with the veg.',
                'Mash the spuds with a splash of milk (don\'t be shy).',
                'Whack the mash on top and bake till it\'s crispy.',
            ]),
            matchingIngredients: ['p1', 'p5', 'c5', 'v1', 'd1'],
            tags: getTags(['Comfort Food', 'Healthy']),
            chefTreat: 'Best enjoyed with a dark ale or stout.',
            batchPrepTip: '🥘 PREP HERO: Assemble the whole thing on the weekend but don\'t bake it. Monday night: oven -> table.'
        });
    }

    // 5. TUNA + PASTA -> Tuna Bake
    if (itemNames.some(n => n.includes('tuna')) && itemNames.some(n => n.includes('pasta'))) {
        recipes.push({
            id: 'r4',
            title: 'Cheesy Tuna Bake',
            prepTime: '5 mins',
            cookTime: '25 mins',
            ingredients: ['Canned Tuna', 'Pasta', 'Milk/Cheese', 'Mixed Veg'],
            instructions: addBabyStep([
                'Boil pasta until it\'s almost done.',
                'Mix the tuna, veg, and a white sauce.',
                'Drown it in cheese and bake until bubbly.',
            ]),
            matchingIngredients: ['p4', 'c2', 'd2', 'v1'],
            tags: getTags(['Family Fave']),
            chefTreat: 'Goes down well with a Pinot Gris.',
            batchPrepTip: '🍱 LUNCH SORTED: Makes epic leftovers for work lunches. Tastes better the next day.'
        });
    }

    // FALLBACK
    if (recipes.length === 0) {
        recipes.push({
            id: 'r_generic',
            title: 'The "End of Week" Fry Up',
            prepTime: '5 mins',
            cookTime: '10 mins',
            ingredients: ['Any Protein', 'Rice', 'Frozen Veg', 'Egg (Optional)'],
            instructions: addBabyStep(['Huck it all in a pan and hope for the best!']),
            matchingIngredients: [],
            tags: getTags(['Quick', 'Budget']),
            chefTreat: 'Whatever is left in the fridge, mate.'
        });
    }

    // SORTING LOGIC: Prioritize "Quick" and "Healthy"
    return recipes.sort((a, b) => {
        const aScore = (a.tags.includes('Quick') ? 1 : 0) + (a.tags.includes('Healthy') ? 1 : 0);
        const bScore = (b.tags.includes('Quick') ? 1 : 0) + (b.tags.includes('Healthy') ? 1 : 0);
        return bScore - aScore; // Descending
    }).slice(0, 3);
};
