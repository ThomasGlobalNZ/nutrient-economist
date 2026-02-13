
import { Product, products } from './mockData';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface GeneratedCart {
    items: CartItem[];
    total: number;
    remainingBudget: number;
    totalMeals: number; // "Protein Portions"
    daysCovered: number;
    infantCount: number;
}

// Helper to calculate "PD Score" (Protein Density per Dollar)
export const calculateValueScore = (product: Product) => {
    return (product.protein_g / product.price).toFixed(1);
};

export const generateSmartCart = (
    budget: number,
    adults: number,
    infants: number,
    // Dietary Preferences
    isVegetarian: boolean = false,
    isGlutenFree: boolean = false,
    // Pantry Check
    hasPantryStaples: boolean = false,
    // Store Preference
    preferredStore: 'Any' | 'PaknSave' | 'Woolworths' | 'NewWorld' = 'Any'
): GeneratedCart => {
    let currentSpend = 0;
    const cart: CartItem[] = [];

    // --- SAFETY & DIETARY CHECKS ---
    const isInfantMode = infants > 0;

    // Filter functions
    const isSafeForFamily = (p: Product) => {
        // 1. Infant Safety
        if (isInfantMode && p.sodium_level === 'high') return false;

        // 2. Vegetarian
        if (isVegetarian && !p.isVegetarian) return false;

        // 3. Gluten Free
        if (isGlutenFree && !p.isGlutenFree) return false;

        // 4. Pantry Check
        if (hasPantryStaples && p.isPantryStaple) return false;

        // 5. Store Preference
        if (preferredStore !== 'Any') {
            if (p.store === 'General') return true;
            if (preferredStore === 'PaknSave' && (p.store === 'Woolworths' || p.store === 'NewWorld')) return false;
            if (preferredStore === 'Woolworths' && (p.store === 'PaknSave' || p.store === 'NewWorld')) return false;
            if (preferredStore === 'NewWorld' && (p.store === 'PaknSave' || p.store === 'Woolworths')) return false;
        }

        return true;
    };

    // --- STRATEGY: INFANT PRIORITY ---
    if (infants > 0) {
        // FIND CHEAPEST FORMULA AVAILABLE
        const formulas = products
            .filter(p => p.category === 'baby' && p.name.includes('Formula'))
            .filter(isSafeForFamily) // Apply store filters etc.
            .sort((a, b) => a.price - b.price); // Cheapest First

        const selectedFormula = formulas[0];

        if (selectedFormula && currentSpend + selectedFormula.price <= budget) {
            cart.push({ product: selectedFormula, quantity: 1 });
            currentSpend += selectedFormula.price;
        }

        const pouch = products.find(p => p.category === 'baby' && p.brand_tier === 'budget');
        if (pouch && currentSpend + (pouch.price * 5) <= budget) {
            cart.push({ product: pouch, quantity: 5 });
            currentSpend += (pouch.price * 5);
        }
    }

    // Create a copy and sort by value (Protein/Price) descending
    // FILTER out unsafe/non-compliant items
    const sortedProducts = [...products]
        .filter(isSafeForFamily)
        .sort((a, b) => {
            const valA = a.protein_g / a.price;
            const valB = b.protein_g / b.price;
            return valB - valA;
        });

    // --- STRATEGY: ADULT BASICS ---
    const basics = [
        products.find(p => p.category === 'carb' && p.image === '🥣' && isSafeForFamily(p)), // Oats
        products.find(p => p.category === 'carb' && (p.image === '🍚' || p.image === '🍝') && isSafeForFamily(p)), // Rice/Pasta
        products.find(p => p.category === 'veg' && p.brand_tier === 'budget' && isSafeForFamily(p)),
        products.find(p => p.category === 'fat' && p.image === '🥛' && isSafeForFamily(p)),
    ];

    if (!hasPantryStaples) {
        const hasCarb = basics.some(b => b && b.category === 'carb');
        if (!hasCarb) {
            const potatoes = products.find(p => p.name.includes('Potatoes') && isSafeForFamily(p));
            if (potatoes) basics.push(potatoes);
        }
    }

    // Add Seasonal/Fresh if budget allows
    if (budget / (adults + infants) > 50) {
        basics.push(products.find(p => p.name.includes('Avocado') && isSafeForFamily(p)));
        basics.push(products.find(p => p.category === 'fruit' && p.brand_tier === 'standard' && isSafeForFamily(p)));
    }

    basics.forEach(item => {
        if (item) {
            let qty = 1;
            if (adults > 2 && item.price < 5) qty = 2;

            if (currentSpend + (item.price * qty) <= budget) {
                const existing = cart.find(c => c.product.id === item.id);
                if (!existing) {
                    cart.push({ product: item, quantity: qty });
                    currentSpend += (item.price * qty);
                }
            }
        }
    });

    // Fill remaining budget
    for (const item of sortedProducts) {
        if (item.category === 'baby') continue;

        if (currentSpend + item.price <= budget) {
            const existing = cart.find(c => c.product.id === item.id);
            if (existing) {
                const maxQty = adults * 2;
                if (existing.quantity < maxQty) {
                    existing.quantity += 1;
                    currentSpend += item.price;
                }
            } else {
                cart.push({ product: item, quantity: 1 });
                currentSpend += item.price;
            }
        }
    }

    // --- METRICS CALCULATION (REFINED) ---
    // Count Protein Portions
    let proteinPortions = 0;

    cart.forEach(item => {
        const cat = item.product.category;
        const name = item.product.name.toLowerCase();

        // Proteins are definitely meals
        if (cat === 'protein') {
            proteinPortions += (item.product.servings_per_unit * item.quantity);
        }
        // Some fats are proteins in disguise for vegetarians
        else if (cat === 'fat') {
            if (name.includes('egg') || name.includes('cheese') || name.includes('tofu')) {
                proteinPortions += (item.product.servings_per_unit * item.quantity);
            }
        }
    });

    // REALISM FACTOR:
    const dailyMainMealNeed = adults * 1;
    let daysCovered = dailyMainMealNeed > 0 ? (proteinPortions / dailyMainMealNeed) : 0;
    daysCovered = daysCovered * 0.8; // Conservative estimate

    return {
        items: cart,
        total: currentSpend,
        remainingBudget: budget - currentSpend,
        totalMeals: Math.floor(proteinPortions),
        daysCovered: Number(daysCovered.toFixed(1)),
        infantCount: infants // Propagate context
    };
};
