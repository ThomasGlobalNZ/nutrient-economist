import React, { useMemo } from 'react';
import { GeneratedCart, CartItem } from '../data/utils';

interface AiChefProps {
    cart: GeneratedCart;
}

interface MealSuggestion {
    type: 'Breakfast' | 'Lunch' | 'Dinner';
    title: string;
    ingredients: string[];
    risk?: string; // e.g. "Contains Dairy"
}

export default function AiChef({ cart }: AiChefProps) {
    const suggestions = useMemo(() => {
        const meals: MealSuggestion[] = [];
        const items = cart.items.map(i => i.product);
        const itemNames = items.map(p => p.name.toLowerCase());

        const has = (query: string) => itemNames.some(n => n.includes(query.toLowerCase()));

        // --- BREAKFAST ---
        if (has('Oats') && has('Milk')) {
            meals.push({ type: 'Breakfast', title: 'Creamy Porridge with Milk', ingredients: ['Oats', 'Milk'] });
        } else if (has('Eggs') && has('Bread') || has('Toast')) {
            meals.push({ type: 'Breakfast', title: 'Scrambled Eggs on Toast', ingredients: ['Eggs', 'Bread'] });
        } else if (has('Bananas') || has('Apples')) {
            meals.push({ type: 'Breakfast', title: 'Fresh Fruit Salad', ingredients: ['Fruit'] });
        } else {
            meals.push({ type: 'Breakfast', title: 'Simple Cereal / Toast', ingredients: ['Pantry Staples'] });
        }

        // --- LUNCH ---
        if (has('Bread') && (has('Cheese') || has('Ham') || has('Chicken'))) {
            meals.push({ type: 'Lunch', title: 'Classic Sandwiches', ingredients: ['Bread', 'Protein', 'Cheese'] });
        } else if (has('Pasta') && has('Tuna')) {
            meals.push({ type: 'Lunch', title: 'Tuna Pasta Salad', ingredients: ['Pasta', 'Tuna'] });
        } else if (has('Rice') && has('Veg')) {
            meals.push({ type: 'Lunch', title: 'Fried Rice (Leftovers)', ingredients: ['Rice', 'Veg'] });
        } else {
            meals.push({ type: 'Lunch', title: 'Leftovers / Sarnies', ingredients: ['Bread'] });
        }

        // --- DINNER ---
        if (has('Mince') && has('Pasta') && has('Tomato')) {
            meals.push({ type: 'Dinner', title: 'Budget Bolognese', ingredients: ['Mince', 'Pasta', 'Tomatoes'] });
        } else if (has('Mince') && has('Rice') && has('Veg')) {
            meals.push({ type: 'Dinner', title: 'Savoury Mince & Rice', ingredients: ['Mince', 'Rice', 'Veg'] });
        } else if (has('Chicken') && has('Veg') && has('Rice')) {
            meals.push({ type: 'Dinner', title: 'Chicken Stir-fry', ingredients: ['Chicken', 'Veg', 'Rice'] });
        } else if (has('Sausages') && has('Potatoes')) {
            meals.push({ type: 'Dinner', title: 'Bangers & Mash', ingredients: ['Sausages', 'Potatoes'] });
        } else {
            meals.push({ type: 'Dinner', title: 'Chef\'s Surprise (Pantry Raid)', ingredients: ['Staples'] });
        }

        return meals;
    }, [cart]);

    return (
        <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 text-white p-2 rounded-lg text-xl shadow-md">
                    👨‍🍳
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900 leading-tight">AI Meal Chef</h3>
                    <p className="text-xs text-indigo-600">Generated from your cart</p>
                </div>
            </div>

            <div className="space-y-3">
                {suggestions.map((meal, idx) => (
                    <div key={idx} className="bg-white/80 p-3 rounded-xl border border-indigo-50 shadow-sm flex items-start gap-3">
                        <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${meal.type === 'Breakfast' ? 'bg-orange-100 text-orange-700' :
                                meal.type === 'Lunch' ? 'bg-green-100 text-green-700' :
                                    'bg-blue-100 text-blue-700'
                            }`}>
                            {meal.type}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">{meal.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Uses: {meal.ingredients.join(', ')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {cart.infantCount > 0 && (
                <div className="mt-4 bg-pink-50 border border-pink-100 p-3 rounded-xl flex gap-3 items-start">
                    <span className="text-pink-600 text-lg">👶</span>
                    <div>
                        <p className="text-xs font-bold text-pink-800 uppercase">Baby Safe Advice</p>
                        <p className="text-xs text-pink-700 mt-1">
                            Check allergens on all labels. Avoid honey for under 1s.
                            Watch out for high sodium in processed meats (Sausages/Ham).
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
