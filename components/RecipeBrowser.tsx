import React, { useState } from 'react';
import { Recipe } from '../data/recipeTypes';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeBrowserProps {
    recipes: Recipe[];
    selectedMealIds: string[];
    onSelectMeal: (recipeId: string) => void;
    onViewRecipe: (recipe: Recipe) => void;
}

export default function RecipeBrowser({ recipes, selectedMealIds, onSelectMeal, onViewRecipe }: RecipeBrowserProps) {
    const [filter, setFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter recipes
    const filteredRecipes = recipes.filter(recipe => {
        const matchesFilter = filter === 'all' || recipe.mealType.includes(filter);
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getDifficultyColor = (difficulty: string) => {
        if (difficulty === 'easy') return 'bg-green-100 text-green-700';
        if (difficulty === 'medium') return 'bg-amber-100 text-amber-700';
        return 'bg-rose-100 text-rose-700';
    };

    const getTotalTime = (recipe: Recipe) => {
        const prep = recipe.prepTime || 0;
        return prep + recipe.cookTime;
    };

    return (
        <div className="space-y-4">
            {/* Search and Filter */}
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', 'breakfast', 'lunch', 'dinner'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${filter === f
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredRecipes.map(recipe => {
                    const isSelected = selectedMealIds.includes(recipe.id);
                    const totalTime = getTotalTime(recipe);

                    return (
                        <div
                            key={recipe.id}
                            className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${isSelected
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md'
                                }`}
                            onClick={() => onViewRecipe(recipe)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="text-4xl">{recipe.emoji}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{recipe.name}</h3>

                                        {/* Stats */}
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>{recipe.servings} servings</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{totalTime} mins</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ChefHat className="w-3 h-3" />
                                                <span className={`px-2 py-0.5 rounded-full font-bold ${getDifficultyColor(recipe.difficulty)}`}>
                                                    {recipe.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1">
                                            {recipe.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Select Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectMeal(recipe.id);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${isSelected
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {isSelected ? '✓ Added' : '+ Add'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredRecipes.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    <p className="text-lg font-medium">No recipes found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter</p>
                </div>
            )}
        </div>
    );
}
