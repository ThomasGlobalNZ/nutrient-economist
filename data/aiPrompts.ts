
import { GeneratedCart } from './utils';

export const generateChefPrompt = (
    cart: GeneratedCart,
    cravings: string[],
    dietary: { isVegetarian: boolean, isGlutenFree: boolean },
    dining: { adults: number, durationDays: number }
): string => {
    // 1. Extract Ingredients
    const ingredients = cart.items
        .map(i => `- ${i.product.name} (${i.product.weight_g}g x ${i.quantity})`)
        .join('\n');

    // 2. Build Context
    const vibe = cravings.length > 0 ? cravings.join(', ') : 'General Balanced';
    const diet = [];
    if (dietary.isVegetarian) diet.push('Vegetarian');
    if (dietary.isGlutenFree) diet.push('Gluten Free');
    const dietString = diet.length > 0 ? `Dietary Requirements: ${diet.join(', ')}` : '';

    // 3. Construct the Prompt
    return `
You are a thrifty, creative Kiwi chef designed to help families save money and eat well. 🥝👨‍🍳

CTX:
- Feeding: ${dining.adults} Adults for ${dining.durationDays} Days.
- Vibe/Cravings: ${vibe}
- ${dietString}

Here is my SHOPPING HAUL for the week:
${ingredients}

TASK:
1. Create a Meal Plan for ${dining.durationDays} Days using ONLY these ingredients (and basic pantry staples like oil, salt, pepper).
2. Recipes should be simple, family-friendly, and match the '${vibe}' vibe where possible.
3. If I have leftovers (e.g. 5kg Rice), suggest how to use them next week or store them.
4. Be cheeky and encouraging!

FORMAT:
- Day 1: [Dinner Name] - [Brief Instructions]
- Day 2: ...
...
- Leftover Tips:
    `.trim();
};
