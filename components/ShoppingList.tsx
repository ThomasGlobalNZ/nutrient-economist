
import React, { useState } from 'react';
import { GeneratedCart } from '../data/utils';
import { Recipe, generateMockRecipes } from '../data/recipes';
import RecipeModal from './RecipeModal';
import PriceReportModal from './PriceReportModal';
import { Product } from '../data/mockData';

interface ShoppingListProps {
    cart: GeneratedCart;
}

export default function ShoppingList({ cart }: ShoppingListProps) {
    // STATE FOR AI CHEF
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);

    // STATE FOR PRICE REPORTING
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportProduct, setReportProduct] = useState<Product | null>(null);

    const handleGenerateRecipes = () => {
        // Pass infant context for baby-friendly logic
        const recipes = generateMockRecipes(cart.items, cart.infantCount);
        setGeneratedRecipes(recipes);
        setIsRecipeModalOpen(true);
    };

    const handleReportClick = (product: Product) => {
        setReportProduct(product);
        setIsReportModalOpen(true);
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden font-sans">
            {/* AI CHEF MODAL */}
            <RecipeModal
                isOpen={isRecipeModalOpen}
                onClose={() => setIsRecipeModalOpen(false)}
                recipes={generatedRecipes}
            />

            {/* PRICE REPORT MODAL */}
            <PriceReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                product={reportProduct}
            />

            <div className="bg-emerald-500 p-6 text-white text-center">
                <h2 className="text-2xl font-bold mb-1">The Haul</h2>
                <p className="text-emerald-100 text-sm mt-1">More bang for your buck.</p>
            </div>

            <div className="p-4">
                {cart.items.map((cartItem) => (
                    <div key={cartItem.product.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{cartItem.product.image}</span>
                            <div>
                                <h4 className="font-semibold text-slate-800 text-sm">
                                    {cartItem.product.name}
                                </h4>

                                <div className="flex gap-2 mt-1">
                                    {/* Store Badge */}
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${cartItem.product.store === 'PaknSave'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : cartItem.product.store === 'Woolworths'
                                                ? 'bg-green-100 text-green-700'
                                                : cartItem.product.store === 'NewWorld'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {cartItem.product.store === 'PaknSave' ? "Pak'nSave" :
                                            cartItem.product.store === 'NewWorld' ? "New World" :
                                                cartItem.product.store}
                                    </span>

                                    {/* QUANTITY DISPLAY */}
                                    <span className="text-[10px] text-slate-400 font-medium pt-0.5">
                                        {cartItem.quantity}x {cartItem.product.unit}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="font-bold text-slate-700 text-right">
                                <div>${(cartItem.product.price * cartItem.quantity).toFixed(2)}</div>
                                <div className="text-[10px] text-slate-400 font-normal">
                                    ${cartItem.product.price.toFixed(2)}/ea
                                </div>
                            </div>

                            {/* REPORT BUTTON (Visible on Hover or Touch) */}
                            <button
                                onClick={() => handleReportClick(cartItem.product)}
                                className="text-slate-300 hover:text-amber-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Report Incorrect Price"
                            >
                                🚩
                            </button>
                        </div>
                    </div>
                ))}

                {cart.items.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        Yeah nah. Not enough gold in the coffers. Slide that budget up!
                    </div>
                )}
            </div>

            {/* AI CHEF BUTTON SECTION */}
            {cart.items.length > 0 && (
                <div className="px-6 pb-6 animate-fade-in">
                    <button
                        onClick={handleGenerateRecipes}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <span>🪄</span>
                        <span>What's for tea? (AI Chef)</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-2">
                        Get the AI to sort your dinner plans. Easy as.
                    </p>
                </div>
            )}

            <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
                <span className="text-slate-500 font-medium">Total Dosh</span>
                <span className="text-3xl font-black text-slate-900">${cart.total.toFixed(2)}</span>
            </div>
        </div>
    );
}
