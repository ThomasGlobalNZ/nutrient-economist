import React, { useState } from 'react';
import { Recipe } from '../data/recipeTypes';
import { Product, products } from '../data/mockData';
import { X, Clock, Users, ChefHat, DollarSign } from 'lucide-react';

interface RecipeDetailModalProps {
    recipe: Recipe | null;
    isOpen: boolean;
    onClose: () => void;
    onToggleSelect: (recipeId: string) => void;
    isSelected: boolean;
    familySize: { adults: number; children: number; infants: number };
    preferredStore: string;
}

export default function RecipeDetailModal({
    recipe,
    isOpen,
    onClose,
    onToggleSelect,
    isSelected,
    familySize,
    preferredStore
}: RecipeDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'info'>('ingredients');

    if (!isOpen || !recipe) return null;

    // Calculate scaling factor based on family size
    const totalPeople = familySize.adults + (familySize.children * 0.75) + (familySize.infants * 0.25);
    const scaleFactor = totalPeople / recipe.servings;

    // Scale ingredients
    const scaledIngredients = recipe.ingredients.map(ing => {
        const product = products.find(p => p.id === ing.productId);
        const scaledAmount = Math.ceil(ing.amount * scaleFactor);

        return {
            ...ing,
            scaledAmount,
            product
        };
    });

    // Calculate total cost
    const totalCost = scaledIngredients.reduce((sum, ing) => {
        if (!ing.product) return sum;
        // Simple price calculation - would need more sophisticated logic for real pricing
        const unitsNeeded = ing.scaledAmount / ing.product.weight_g;
        return sum + (ing.product.price * unitsNeeded);
    }, 0);

    const totalTime = (recipe.prepTime || 0) + recipe.cookTime;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                            <span className="text-5xl">{recipe.emoji}</span>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{recipe.name}</h2>
                                <div className="flex flex-wrap gap-3 text-sm text-emerald-100">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{recipe.servings} servings (scaled for {Math.round(totalPeople)})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{totalTime} mins total</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ChefHat className="w-4 h-4" />
                                        <span className="capitalize">{recipe.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50">
                    {[
                        { id: 'ingredients', label: '🥘 Ingredients' },
                        { id: 'steps', label: '👨‍🍳 Steps' },
                        { id: 'info', label: 'ℹ️ Info' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white text-emerald-600 border-b-2 border-emerald-500'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Ingredients Tab */}
                    {activeTab === 'ingredients' && (
                        <div className="space-y-4">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-emerald-900">Estimated Cost</span>
                                    <span className="text-2xl font-black text-emerald-700">${totalCost.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-emerald-600 mt-1">Based on {preferredStore || 'general'} pricing</p>
                            </div>

                            <div className="space-y-3">
                                {scaledIngredients.map((ing, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{ing.product?.image || '📦'}</span>
                                            <div>
                                                <div className="font-semibold text-slate-900">{ing.name}</div>
                                                <div className="text-xs text-slate-500">
                                                    {ing.scaledAmount}{ing.unit}
                                                    {scaleFactor !== 1 && (
                                                        <span className="ml-2 text-emerald-600">
                                                            (scaled from {ing.amount}{ing.unit})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {ing.product && (
                                            <div className="text-right">
                                                <div className="font-bold text-slate-700">${ing.product.price.toFixed(2)}</div>
                                                <div className="text-xs text-slate-400">{ing.product.unit}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Steps Tab */}
                    {activeTab === 'steps' && (
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                                <div className="flex gap-4 text-sm">
                                    <div>
                                        <span className="font-bold text-amber-900">Prep:</span>
                                        <span className="ml-2 text-amber-700">{recipe.prepTime || 0} mins</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-amber-900">Cook:</span>
                                        <span className="ml-2 text-amber-700">{recipe.cookTime} mins</span>
                                    </div>
                                </div>
                            </div>

                            {recipe.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
                                        {idx + 1}
                                    </div>
                                    <p className="flex-1 text-slate-700 leading-relaxed pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info Tab */}
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {recipe.notes && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Chef's Notes</h3>
                                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg italic">{recipe.notes}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Meal Type:</span>
                                        <span className="font-medium text-slate-900 capitalize">{recipe.mealType.join(', ')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Leftovers:</span>
                                        <span className="font-medium text-slate-900">{recipe.hasLeftovers ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Difficulty:</span>
                                        <span className="font-medium text-slate-900 capitalize">{recipe.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onToggleSelect(recipe.id);
                            onClose();
                        }}
                        className={`flex-1 py-3 rounded-xl font-bold shadow-lg transition-all ${isSelected
                            ? 'bg-rose-500 text-white hover:bg-rose-600'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                    >
                        {isSelected ? 'Remove from Meals' : 'Add to Meals'}
                    </button>
                </div>
            </div>
        </div>
    );
}
