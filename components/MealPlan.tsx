import React from 'react';
import { GeneratedCart, CartItem } from '../data/utils';
import AiChef from './AiChef';

interface MealPlanProps {
    cart: GeneratedCart;
}

export default function MealPlan({ cart }: MealPlanProps) {
    // Simple categorization for MVP view
    const breakfastItems = cart.items.filter(i =>
        i.product.name.includes('Oats') ||
        i.product.category === 'fruit' ||
        i.product.name.includes('Milk')
    );

    const mainMealItems = cart.items.filter(i => !breakfastItems.includes(i));

    const renderItemLine = (item: CartItem) => (
        <div key={item.product.id} className="flex flex-col gap-1 py-3 border-b border-slate-100 last:border-0">
            <div className="flex justify-between items-start">
                <span className="text-slate-700 flex items-center gap-2 font-medium text-sm">
                    <span className="text-lg">{item.product.image}</span> {item.product.name}
                </span>
                <span className="text-slate-400 text-xs bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Qty: {item.quantity}
                </span>
            </div>

            {/* TAGS ROW */}
            <div className="flex flex-wrap gap-1 ml-7">
                {/* ALLERGENS */}
                {item.product.allergens && item.product.allergens.length > 0 && (
                    item.product.allergens.map(alg => (
                        <span key={alg} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-200">
                            ⚠️ {alg}
                        </span>
                    ))
                )}
                {/* PRESERVATIVES */}
                {item.product.preservatives && item.product.preservatives.length > 0 && (
                    item.product.preservatives.map(pre => (
                        <span key={pre} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                            🧪 {pre}
                        </span>
                    ))
                )}
                {/* SODIUM */}
                {item.product.sodium_level === 'high' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                        🧂 High Sodium
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <div className="bg-blue-600 p-6 text-white text-center">
                <h2 className="text-2xl font-bold mb-1">Your Meal Plan</h2>
                <p className="text-blue-100 text-sm">Rough ideas for your ingredients</p>
            </div>

            <div className="p-6">
                {/* AI CHEF COMPONENT */}
                <AiChef cart={cart} />

                <div className="space-y-8 mt-8">
                    {/* Breakfast Section */}
                    <div>
                        <h3 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-3 flex items-center gap-2">
                            <span className="text-xl">☀️</span> Breakfast Rotation
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                            {breakfastItems.length > 0 ? (
                                breakfastItems.map(renderItemLine)
                            ) : (
                                <p className="text-slate-400 text-xs italic">No breakfast items found. Try increasing budget.</p>
                            )}
                        </div>
                    </div>

                    {/* Lunch/Dinner Section */}
                    <div>
                        <h3 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-3 flex items-center gap-2">
                            <span className="text-xl">🍲</span> Lunch & Dinner Base
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                            {mainMealItems.length > 0 ? (
                                mainMealItems.map(renderItemLine)
                            ) : (
                                <p className="text-slate-400 text-xs italic">No main meal items found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
