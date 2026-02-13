
import React from 'react';
import { Recipe } from '../data/recipes';

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipes: Recipe[];
}

export default function RecipeModal({ isOpen, onClose, recipes }: RecipeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white text-center relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white"
                    >
                        ✕
                    </button>
                    <div className="text-4xl mb-2">🧑‍🍳</div>
                    <h2 className="text-2xl font-bold">AI Chef</h2>
                    <p className="text-indigo-100 text-sm">
                        Here are 3 meals based on your cart
                    </p>
                </div>

                {/* CONTENT */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {recipes.map((recipe, index) => (
                        <div key={recipe.id} className="border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-slate-50">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800 text-lg">{recipe.title}</h3>
                            </div>

                            {/* TAGS */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {recipe.tags.map((tag, i) => (
                                    <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tag === 'Baby Friendly' ? 'bg-pink-100 text-pink-700' :
                                            tag === 'Quick' ? 'bg-blue-100 text-blue-700' :
                                                tag === 'Healthy' ? 'bg-green-100 text-green-700' :
                                                    tag === 'Batch Cook' ? 'bg-sky-100 text-sky-700' :
                                                        'bg-slate-200 text-slate-600'
                                        }`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* TIME DISPLAY */}
                            <div className="flex gap-2 mb-4">
                                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    🔪 Prep: {recipe.prepTime}
                                </span>
                                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    🔥 Cook: {recipe.cookTime}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Used Ingredients</p>
                                <div className="flex flex-wrap gap-1">
                                    {recipe.ingredients.map((ing, i) => (
                                        <span key={i} className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* BATCH PREP TIP (New) */}
                            {recipe.batchPrepTip && (
                                <div className="mb-3 bg-sky-50 p-2.5 rounded-lg border border-sky-100 flex gap-2 items-start">
                                    <span className="text-lg mt-0.5">📦</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-sky-800 uppercase">Meal Prep Hack</p>
                                        <p className="text-xs text-sky-700 leading-snug">{recipe.batchPrepTip}</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Instructions</p>
                                <ol className="list-decimal list-inside space-y-2">
                                    {recipe.instructions.map((step, i) => (
                                        <li key={i} className={`text-sm text-slate-600 leading-relaxed pl-1 ${step.includes('BABY PREP') ? 'font-bold text-pink-600 bg-pink-50 p-2 rounded -mx-2 mt-2' : ''}`}>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* CHEF TREAT */}
                            {recipe.chefTreat && (
                                <div className="mt-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex gap-2 items-center">
                                    <span className="text-lg">🍷</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-800 uppercase">Chef's Treat</p>
                                        <p className="text-xs text-indigo-600 font-medium italic">{recipe.chefTreat}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {recipes.length === 0 && (
                        <div className="text-center text-slate-400 py-10">
                            Add more ingredients (Protein + Carb) to unlock recipes!
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-slate-100 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
