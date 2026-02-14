import React from 'react';
import { Recipe } from '../data/recipeTypes';
import { Clock, Users, X } from 'lucide-react';

interface SelectedMealsProps {
    recipes: Recipe[];
    selectedMealIds: string[];
    onRemoveMeal: (recipeId: string) => void;
    onViewRecipe: (recipe: Recipe) => void;
}

export default function SelectedMeals({ recipes, selectedMealIds, onRemoveMeal, onViewRecipe }: SelectedMealsProps) {
    const selectedRecipes = recipes.filter(r => selectedMealIds.includes(r.id));

    if (selectedRecipes.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-lg font-bold text-slate-400 mb-1">No meals selected yet</p>
                <p className="text-sm text-slate-400">Browse recipes above and add some to your plan!</p>
            </div>
        );
    }

    const getTotalTime = (recipe: Recipe) => {
        const prep = recipe.prepTime || 0;
        return prep + recipe.cookTime;
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-900">Your Meals ({selectedRecipes.length})</h3>
                <button
                    onClick={() => selectedMealIds.forEach(id => onRemoveMeal(id))}
                    className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                >
                    Clear All
                </button>
            </div>

            {selectedRecipes.map(recipe => {
                const totalTime = getTotalTime(recipe);

                return (
                    <div
                        key={recipe.id}
                        className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        onClick={() => onViewRecipe(recipe)}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <span className="text-3xl">{recipe.emoji}</span>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{recipe.name}</h4>
                                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{recipe.servings}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{totalTime}m</span>
                                    </div>
                                    <span className="px-2 py-0.5 bg-slate-100 rounded-full capitalize">
                                        {recipe.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveMeal(recipe.id);
                            }}
                            className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
