
import { Product, products } from './mockData';

export interface CartItem {
    product: Product;
    quantity: number;
    savings?: number; // V2.3: Track savings per line item
}

export interface GeneratedCart {
    items: CartItem[];
    total: number;
    remainingBudget: number;
    totalMeals: number; // "Main Portions" generated
    daysCovered: number;
    infantCount: number;
    // V2 New Fields
    durationDays: number;
    mealsRequired: number; // Total servings needed (Adults * Frequency * Days)
    isSurvivalMode: boolean; // True if budget was too low for preferences
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
    preferredStore: 'Any' | 'PaknSave' | 'Woolworths' | 'NewWorld' = 'Any',
    // Health & Safety
    isPreservativeFree: boolean = false,
    // V2: Granular Allergens (Array of strings)
    // e.g. ['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Egg']
    excludedAllergens: string[] = [],
    // V2: Life Setup
    durationDays: number = 7,
    mealsPerDay: number = 3,
    // V3: Pricing Realism
    includeSnacks: boolean = false,
    // V2: Cravings & Health
    cravings: string[] = [],
    healthGoals: any = {}
): GeneratedCart => {
    let currentSpend = 0;
    const cart: CartItem[] = [];

    // --- V2: CALCULATE REQUIREMENTS ---
    const totalServingsRequired = adults * mealsPerDay * durationDays;

    // Estimate "Min Cost Per Serving" (Very rough: $1.50 for breakfast/lunch, $3.00 dinner avg -> $2.00)
    // If budget is effectively < $1.50 per meal, trigger SURVIVAL MODE
    // Formula: (Budget - (Infants * $20)) / RequiredServings
    // $20 is a heuristic for "Infant Tax"
    const budgetPerMeal = (budget - (infants * 20)) / totalServingsRequired;
    const isSurvivalMode = budgetPerMeal < 1.50;

    // --- SAFETY & DIETARY CHECKS ---
    const isInfantMode = infants > 0;

    // Filter functions
    const isSafeForFamily = (p: Product) => {
        // 1. Infant Safety (Sodium)
        // Only apply if infant is eating it (main family meal)
        if (isInfantMode && p.sodium_level === 'high') return false;

        // 2. Vegetarian
        if (isVegetarian && !p.isVegetarian) return false;

        // 3. Gluten Free (via Boolean Toggle OR Granular List)
        if (isGlutenFree && !p.isGlutenFree) return false;
        if (excludedAllergens.includes('Gluten') && !p.isGlutenFree) return false;

        // 4. Pantry Check
        if (hasPantryStaples && p.isPantryStaple) return false;

        // 5. Preservative Free
        if (isPreservativeFree && p.preservatives && p.preservatives.length > 0) return false;

        // 6. Granular Allergens (Global Exclusion)
        // If we selected "Peanuts", exclude anything with Peanuts
        if (excludedAllergens.length > 0 && p.allergens) {
            const hasBadAllergen = p.allergens.some(alg =>
                excludedAllergens.some(ex => alg.includes(ex))
            );
            if (hasBadAllergen) return false;
        }

        // 7. Store Preference
        if (preferredStore !== 'Any') {
            if (p.store === 'General') return true;
            if (preferredStore === 'PaknSave' && (p.store === 'Woolworths' || p.store === 'NewWorld')) return false;
            if (preferredStore === 'Woolworths' && (p.store === 'PaknSave' || p.store === 'NewWorld')) return false;
            if (preferredStore === 'NewWorld' && (p.store === 'PaknSave' || p.store === 'Woolworths')) return false;
        }

        return true;
    };

    const isSafeForBaby = (p: Product) => {
        // Infants are extra sensitive
        if (excludedAllergens.length > 0 && p.allergens) {
            const hasBadAllergen = p.allergens.some(alg =>
                excludedAllergens.some(ex => alg.includes(ex))
            );
            if (hasBadAllergen) return false;
        }
        return true;
    };

    // --- HELPER: GET PRICE ---
    const getPriceDetails = (p: Product) => {
        let price = p.price;
        let savings = 0;
        return { price, savings };
    };

    // Accessor for simple price checks
    const getPrice = (p: Product) => getPriceDetails(p).price;


    // --- STRATEGY: INFANT PRIORITY ---
    if (infants > 0) {
        // FIND CHEAPEST FORMULA AVAILABLE
        const formulas = products
            .filter(p => p.category === 'baby' && p.name.includes('Formula'))
            .filter(isSafeForFamily) // General safety
            .filter(isSafeForBaby)   // Allergen specific
            .sort((a, b) => getPrice(a) - getPrice(b)); // Cheapest First (using discounted price)

        const selectedFormula = formulas[0];

        // V2: Adjust Formula Quantity for Duration
        // 1 Tin (900g) lasts ~1 week? Let's say 1 tin per week per child
        const formulaQty = Math.max(1, Math.ceil(durationDays / 7));

        if (selectedFormula && currentSpend + (getPrice(selectedFormula) * formulaQty) <= budget) {
            cart.push({ product: selectedFormula, quantity: formulaQty });
            currentSpend += (getPrice(selectedFormula) * formulaQty);
        }

        // FIND BABY FOOD/POUCHES (Excluding the formula we just added)
        const pouch = products.find(p =>
            p.category === 'baby' &&
            p.brand_tier === 'budget' &&
            p.id !== selectedFormula?.id &&
            !p.name.includes('Formula') &&
            isSafeForBaby(p)
        ) || products.find(p =>
            p.category === 'baby' &&
            p.brand_tier === 'standard' &&
            p.id !== selectedFormula?.id &&
            !p.name.includes('Formula') &&
            isSafeForBaby(p)
        );

        // V2: 2 Pouches per day per infant?
        const pouchQty = durationDays * 2 * infants;

        if (pouch && currentSpend + (getPrice(pouch) * pouchQty) <= budget) {
            cart.push({ product: pouch, quantity: pouchQty });
            currentSpend += (getPrice(pouch) * pouchQty);
        }
    }

    // --- SNACK ATTACK (Phase 9) ---
    if (includeSnacks) {
        // KIWI DIP PROTOCOL
        // Needs Reduced Cream + Onion Soup (~$4.50 combined)
        const reducedCream = products.find(p => p.id === 'snack-dip-reduced-cream');
        const onionSoup = products.find(p => p.id === 'snack-dip-onion-soup');

        if (reducedCream && onionSoup && currentSpend + getPrice(reducedCream) + getPrice(onionSoup) <= budget) {
            cart.push({ product: reducedCream, quantity: 1, savings: 0 });
            cart.push({ product: onionSoup, quantity: 1, savings: 0 });
            currentSpend += getPrice(reducedCream) + getPrice(onionSoup);
        }

        // CHIPPY PROTOCOL
        // Needs ~$2.50
        // Find chips in the 'chips' sub_category
        const chips = products.find(p => p.sub_category === 'chips' && p.brand_tier === 'standard');
        if (chips && currentSpend + getPrice(chips) <= budget) {
            cart.push({ product: chips, quantity: 1, savings: 0 });
            currentSpend += getPrice(chips);
        }

        // BISCUIT PROTOCOL
        // Needs ~$3.00
        const biccies = products.find(p => p.sub_category === 'biscuit' && p.brand_tier === 'standard');
        if (biccies && currentSpend + getPrice(biccies) <= budget) {
            cart.push({ product: biccies, quantity: 1, savings: 0 });
            currentSpend += getPrice(biccies);
        }
    }

    // --- HELPER: CATEGORY FILTER ---
    const getProductsForCategory = (category: 'protein' | 'carb' | 'fat' | 'fruit' | 'veg', subCategory?: string) => {
        return products.filter(p => {
            if (!isSafeForFamily(p)) return false; // Ensure we use the safe logic
            if (p.category !== category) return false;
            if (subCategory && p.sub_category !== subCategory) return false;

            // V2: Cravings Logic
            // If cravings are set (and not empty), prioritize matching items.
            // Filter: If I selected 'Chicken' and 'Asian', I want:
            // 1. All standard items? Or 2. Only items that match?
            // "Multi-select" implies "I want these things".

            if (category === 'protein' && cravings.length > 0) {
                // If we have specific protein cravings (Chicken, Beef, Fish, Veg), 
                // we should probably filter strictly to those types to ensure the user gets what they asked for?
                // But 'Comfort', 'Asian', 'Italian' are effectively "Flavours" that might go with any protein.

                // Strategy:
                // 1. Determine "Protein Type" cravings (Chicken, Beef, Fish, Veg)
                // 2. Determine "Vibe" cravings (Asian, Italian, etc)

                const proteinTypes = ['Chicken', 'Beef', 'Fish', 'Veg'].map(t => t.toLowerCase());
                const activeProteinCravings = cravings.filter(c => proteinTypes.includes(c.toLowerCase()));

                if (activeProteinCravings.length > 0) {
                    // Strict Filter: Must match one of the selected protein types
                    const matchesType = activeProteinCravings.some(c => {
                        const val = c.toLowerCase();
                        return (p.tags && p.tags.includes(val)) ||
                            p.sub_category === val ||
                            p.name.toLowerCase().includes(val);
                    });
                    if (!matchesType) return false;
                }

                // If only "Vibe" cravings are selected (e.g. Asian), we don't strictly filter proteins, 
                // but we rely on the SORT below to bubble up "Asian" proteins (like Chicken).
            }
            return true;
        }).sort((a, b) => {
            // Sort by PRICE (Lowest first)
            const priceA = getPrice(a);
            const priceB = getPrice(b);

            // V2 Sort: Prioritize Health Tags
            const scoreA = (healthGoals?.gutHealth && a.tags?.includes('gut-health') ? 10 : 0) +
                (healthGoals?.lowCholesterol && a.tags?.includes('low-cholesterol') ? 10 : 0);
            const scoreB = (healthGoals?.gutHealth && b.tags?.includes('gut-health') ? 10 : 0) +
                (healthGoals?.lowCholesterol && b.tags?.includes('low-cholesterol') ? 10 : 0);

            if (scoreA !== scoreB) return scoreB - scoreA; // High score first

            return priceA - priceB;
        });
    };

    // --- V2 STRATEGY: ESSENTIALS (Survival vs Standard) ---
    // If Survival Mode, prioritize cheap carbs (Rice, Pasta, Bread, Potatoes)

    // BULK LOGIC: Auto-Upgrade if cheaper per unit and affordable
    const findEssential = (category: 'protein' | 'carb' | 'fat' | 'fruit' | 'veg', sub_category: string, image: string) => {
        // 1. Get Standard Candidates (sorted by price/score)
        const candidates = getProductsForCategory(category, sub_category);
        if (candidates.length === 0) return null; // No options at all

        const bestStandard = candidates[0];

        // 2. Look for a Bulk Option (Specific ID check or Weight check)
        // We look for items in the same sub-category that are "Bulk" sized (> 1.5kg usually)
        const bulkCandidate = products.find(p =>
            p.category === category &&
            p.sub_category === sub_category &&
            p.weight_g >= 2000 && // 2kg+ is definitely bulk
            p.id !== bestStandard.id && // Don't compare to itself
            isSafeForFamily(p)
        );

        // 3. Compare Value
        if (bulkCandidate) {
            const stdUnitCost = getPrice(bestStandard) / bestStandard.weight_g;
            const bulkUnitCost = getPrice(bulkCandidate) / bulkCandidate.weight_g;

            // IF Bulk is cheaper per gram...
            if (bulkUnitCost < stdUnitCost) {
                // ...AND it fits in the budget (considering we usually buy 1)
                if (currentSpend + getPrice(bulkCandidate) <= budget) {
                    return bulkCandidate; // UPGRADE!
                }
            }
        }

        // Fallback to standard
        return bestStandard;
    };

    const carbSource = findEssential('carb', 'rice', '🍚') || findEssential('carb', 'pasta', '🍝'); // Rice OR Pasta
    const bread = findEssential('carb', 'bread', '🍞');
    const milk = findEssential('fat', 'milk', '🥛');

    // Add Essentials based on Duration
    if (carbSource) {
        // Bulk check: If we picked a 5kg bag, quantity is 1 regardless of adults
        let carbQty = 1;
        // If it's small bag and many people, scale up.
        if (carbSource.weight_g < 1000 && (adults > 2 || durationDays > 7)) carbQty = 2;

        const { price, savings } = getPriceDetails(carbSource);

        if (currentSpend + (price * carbQty) <= budget) {
            const existing = cart.find(c => c.product.id === carbSource.id);
            if (!existing) {
                cart.push({ product: carbSource, quantity: carbQty, savings: savings * carbQty });
                currentSpend += (price * carbQty);
            }
        }
    }

    if (bread && !hasPantryStaples) {
        // 1 Loaf lasts ~3 days per 2 adults?
        // Formula: ceil(Days / 3) * (Adults / 2)
        const breadQty = Math.ceil(durationDays / 3) * Math.ceil(adults / 2);
        const { price, savings } = getPriceDetails(bread);

        if (currentSpend + (price * breadQty) <= budget) {
            const existing = cart.find(c => c.product.id === bread.id);
            if (!existing) {
                cart.push({ product: bread, quantity: breadQty, savings: savings * breadQty });
                currentSpend += (price * breadQty);
            }
        }
    }

    if (milk) {
        // 2L Milk per week per 2 adults
        const milkQty = Math.ceil(durationDays / 7) * Math.ceil(adults / 2);
        const { price, savings } = getPriceDetails(milk);

        if (currentSpend + (price * milkQty) <= budget) {
            const existing = cart.find(c => c.product.id === milk.id);
            if (!existing) {
                cart.push({ product: milk, quantity: milkQty, savings: savings * milkQty });
                currentSpend += (price * milkQty);
            }
        }
    }

    // --- FILLER STRATEGY (V2: Guided by Cravings) ---
    // Instead of iterating ONE big list, we iterate our categories in priority order
    // and pull from our smart sorted lists.

    // 1. Get Lists
    const proteins = getProductsForCategory('protein');
    const veg = getProductsForCategory('veg');
    const fruit = getProductsForCategory('fruit');
    const carbs = getProductsForCategory('carb');
    const fats = getProductsForCategory('fat');

    // Remove babies
    // (Already filtered by isSafeForFamily essentially, but let's be sure to exclude 'baby' category items specifically if they snuck in)
    // Actually getProductsForCategory restricts by category string so we represent good.

    // 2. Mix them into a priority queue based on dietary balance?
    // For V2, let's keep the "Value Sort" but respect the Cravings/Health top picks.
    // The lists are already sorted by: HealthScore -> Price.

    // We'll merge them into one master list for the final fill, but maybe Interleave them?
    // For simplicity, let's just merge all remaining valid candidates and sort by Price/Value again logic?
    // No, we want to respect the Cravings.

    // If Craving is Chicken, 'proteins' list has Chicken at top. We should pick from proteins first?
    const allCandidates = [...proteins, ...veg, ...fruit, ...carbs, ...fats];

    // Sort these candidates:
    // 1. Health/Craving Score (Already embedded in the list order? No, list order is per category)
    // We need a global sort.
    const sortedProducts = allCandidates.sort((a, b) => {
        // V2 Sort: Prioritize Health Tags
        // V2 Sort: Prioritize Health Tags & Cravings
        const scoreA = (healthGoals?.gutHealth && a.tags?.includes('gut-health') ? 10 : 0) +
            (healthGoals?.lowCholesterol && a.tags?.includes('low-cholesterol') ? 10 : 0) +
            (cravings.some(c => a.tags?.includes(c.toLowerCase()) || a.sub_category === c.toLowerCase() || a.name.toLowerCase().includes(c.toLowerCase())) ? 50 : 0);

        const scoreB = (healthGoals?.gutHealth && b.tags?.includes('gut-health') ? 10 : 0) +
            (healthGoals?.lowCholesterol && b.tags?.includes('low-cholesterol') ? 10 : 0) +
            (cravings.some(c => b.tags?.includes(c.toLowerCase()) || b.sub_category === c.toLowerCase() || b.name.toLowerCase().includes(c.toLowerCase())) ? 50 : 0);

        if (scoreA !== scoreB) return scoreB - scoreA;

        // Then Protein Value
        const valA = a.protein_g / getPrice(a);
        const valB = b.protein_g / getPrice(b);
        return valB - valA;
    });

    for (const item of sortedProducts) {
        if (item.category === 'baby') continue;
        const { price, savings } = getPriceDetails(item);

        // Don't duplicate essentials we just added manually
        if (cart.some(c => c.product.id === item.id)) continue;

        if (currentSpend + price <= budget) {
            // How many?
            cart.push({ product: item, quantity: 1, savings: (savings || 0) });
            currentSpend += price;
        }
    }

    // --- V2: SCALE UP QUANTITIES ---
    if (currentSpend < budget) {

        // --- NEW: COMFORT FOOD / TREATS (The "Partner Tax") ---
        if (budget - currentSpend > 8) {
            const treats = products.filter(p => p.id.startsWith('treat-') && isSafeForFamily(p));
            if (treats.length > 0) {
                const chocy = treats.find(t => t.name.includes('Whittakers'));
                if (chocy && currentSpend + getPrice(chocy) <= budget) {
                    cart.push({ product: chocy, quantity: 1 });
                    currentSpend += getPrice(chocy);
                } else {
                    const biccy = treats.find(t => t.name.includes('Arnotts'));
                    if (biccy && currentSpend + getPrice(biccy) <= budget) {
                        cart.push({ product: biccy, quantity: 1 });
                        currentSpend += getPrice(biccy);
                    }
                }
            }

            // --- THE DIP PROTOCOL (Kiwi Classic) ---
            // If we have chips (Bluebird or Value), we need Dip.
            const hasChips = cart.some(c => c.product.name.toLowerCase().includes('chips'));

            if (hasChips && budget - currentSpend > 5) {
                // Kiwi Classic: Reduced Cream + Onion Soup
                const cream = products.find(p => p.id === 'snack-dip-reduced-cream');
                const soup = products.find(p => p.id === 'snack-dip-onion-soup');

                if (cream && soup && isSafeForFamily(cream) && isSafeForFamily(soup) && currentSpend + getPrice(cream) + getPrice(soup) <= budget) {
                    cart.push({ product: cream, quantity: 1 });
                    cart.push({ product: soup, quantity: 1 });
                    currentSpend += (getPrice(cream) + getPrice(soup));
                } else {
                    // Or Hummus
                    const hummus = products.find(p => p.id.includes('hummus'));
                    if (hummus && isSafeForFamily(hummus) && currentSpend + getPrice(hummus) <= budget) {
                        cart.push({ product: hummus, quantity: 1 });
                        currentSpend += getPrice(hummus);
                    }
                }
            }

            // --- THE VITAMIN C PROTOCOL (Juice) ---
            // Only if budget is healthy
            if (budget - currentSpend > 6 && adults > 1) {
                const juice = products.find(p => p.id === 'drink-juice-orange');
                if (juice && isSafeForFamily(juice)) {
                    cart.push({ product: juice, quantity: 1 });
                    currentSpend += getPrice(juice);
                }
            }
        }

        // Sort cart by "Nutrition Value" to prioritize what to double up
        const priorityOrder = ['protein', 'veg', 'fruit', 'carb', 'fat'];

        let madeChange = true;
        while (madeChange && currentSpend < budget) {
            madeChange = false;

            for (const cat of priorityOrder) {
                const candidates = cart.filter(c => c.product.category === cat && c.product.category !== 'baby');

                for (const item of candidates) {
                    const { price, savings } = getPriceDetails(item.product);
                    // Don't scale treats, 1 block is enough
                    if (item.product.id.startsWith('treat-') || item.product.id.startsWith('snack-') || item.product.id.startsWith('drink-')) continue;

                    if (currentSpend + price <= budget) {
                        // Reasonable Cap: e.g. 2 per adult per week?
                        // Let's say limit is 6 for now.
                        if (item.quantity < 6) {
                            item.quantity++;
                            currentSpend += price;
                            if (savings > 0) {
                                item.savings = (item.savings || 0) + savings;
                            }
                            madeChange = true;
                            if (currentSpend >= budget) break;
                        }
                    }
                }
                if (currentSpend >= budget) break;
            }
        }
    }

    // --- METRICS CALCULATION (REFINED V2) ---
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

    // V2 Days Covered Logic
    const dinnersRequired = adults * durationDays;

    const coverageRatio = dinnersRequired > 0 ? proteinPortions / dinnersRequired : 0;
    let daysCovered = Math.min(durationDays, Math.floor(durationDays * coverageRatio));

    return {
        items: cart,
        total: currentSpend,
        remainingBudget: budget - currentSpend,
        totalMeals: Math.floor(proteinPortions),
        daysCovered: daysCovered,
        infantCount: infants,
        durationDays: durationDays,
        mealsRequired: totalServingsRequired,
        isSurvivalMode: isSurvivalMode
    };
};
