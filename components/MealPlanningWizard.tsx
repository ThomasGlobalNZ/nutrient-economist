import React, { useState } from 'react';
import { Recipe, MealPlan } from '../data/recipeTypes';
import { getAllRecipes, getRecipesByMealType } from '../data/recipeLoader';
import { Calendar, ChefHat, Clock, X } from 'lucide-react';

interface MealPlanningWizardProps {
    adults: number;
    children: number;
    infants: number;
    durationDays: number;
    mealPlan: MealPlan;
    onUpdate: (mealPlan: MealPlan) => void;
}

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanningWizard({
    adults, children, infants, durationDays, mealPlan, onUpdate
}: MealPlanningWizardProps) {

    const [showRecipePicker, setShowRecipePicker] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, meal: 'breakfast' | 'lunch' | 'dinner' } | null>(null);

    const allRecipes = getAllRecipes();
    const visibleDays = DAYS.slice(0, durationDays);

    const handleSelectRecipe = (recipe: Recipe) => {
        if (!selectedSlot) return;

        const newPlan = { ...mealPlan };
        if (!newPlan[selectedSlot.day]) {
            newPlan[selectedSlot.day] = {};
        }
        newPlan[selectedSlot.day][selectedSlot.meal] = recipe.id;

        // Auto-populate leftovers
        if (recipe.hasLeftovers) {
            const dayIndex = DAYS.indexOf(selectedSlot.day);
            const nextDay = DAYS[dayIndex + 1];
            if (nextDay && dayIndex < durationDays - 1) {
                if (!newPlan[nextDay]) {
                    newPlan[nextDay] = {};
                }
                // Set lunch as leftover
                newPlan[nextDay].lunch = 'leftover:' + recipe.id;
            }
        }

        onUpdate(newPlan);
        setShowRecipePicker(false);
        setSelectedSlot(null);
    };

    const handleQuickPlan = () => {
        // Auto-fill Mon/Wed/Fri with dinner recipes
        const dinnerRecipes = getRecipesByMealType('dinner');
        const breakfastRecipes = getRecipesByMealType('breakfast');

        const newPlan: MealPlan = {};
        let recipeIndex = 0;

        visibleDays.forEach((day, i) => {
            newPlan[day] = {};

            // Breakfast every day
            if (breakfastRecipes.length > 0) {
                newPlan[day].breakfast = breakfastRecipes[0].id;
            }

            // Cook Mon/Wed/Fri
            if (i % 2 === 0 && dinnerRecipes[recipeIndex]) {
                newPlan[day].dinner = dinnerRecipes[recipeIndex].id;

                // Leftovers next day
                const nextDay = DAYS[i + 1];
                if (nextDay && dinnerRecipes[recipeIndex].hasLeftovers) {
                    if (!newPlan[nextDay]) newPlan[nextDay] = {};
                    newPlan[nextDay].lunch = 'leftover:' + dinnerRecipes[recipeIndex].id;
                }

                recipeIndex++;
            }
        });

        onUpdate(newPlan);
    };

    const getMealDisplay = (day: string, meal: 'breakfast' | 'lunch' | 'dinner') => {
        const mealId = mealPlan[day]?.[meal];
        if (!mealId) return null;

        if (mealId.startsWith('leftover:')) {
            const recipeId = mealId.replace('leftover:', '');
            const recipe = allRecipes.find(r => r.id === recipeId);
            return (
                <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    ♻️ {recipe?.name || 'Leftovers'}
                </div>
            );
        }

        const recipe = allRecipes.find(r => r.id === mealId);
        if (!recipe) return null;

        return (
            <div className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200 flex items-center gap-1">
                <span>{recipe.emoji}</span>
                <span className="truncate">{recipe.name}</span>
            </div>
        );
    };

    const handleClearSlot = (day: string, meal: 'breakfast' | 'lunch' | 'dinner') => {
        const newPlan = { ...mealPlan };
        if (newPlan[day]) {
            delete newPlan[day][meal];
        }
        onUpdate(newPlan);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-2">Plan Your Week 📅</h2>
                <p className="text-sm text-slate-500">Pick meals for {durationDays} days. We'll sort the shopping list.</p>
            </div>

            {/* Quick Plan Button */}
            <button
                onClick={handleQuickPlan}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
                <Calendar size={18} />
                Quick Plan (Mon/Wed/Fri Cook Days)
            </button>

            {/* Week Grid */}
            <div className="space-y-3">
                {visibleDays.map((day, i) => (
                    <div key={day} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="font-bold text-slate-700 mb-3 text-sm">{DAY_NAMES[i]}</div>

                        <div className="grid grid-cols-3 gap-2">
                            {/* Breakfast */}
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold mb-1">🍳 Breakfast</div>
                                {getMealDisplay(day, 'breakfast') || (
                                    <button
                                        onClick={() => {
                                            setSelectedSlot({ day, meal: 'breakfast' });
                                            setShowRecipePicker(true);
                                        }}
                                        className="w-full py-2 text-[10px] border-2 border-dashed border-slate-200 rounded text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>

                            {/* Lunch */}
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold mb-1">🥗 Lunch</div>
                                {getMealDisplay(day, 'lunch') || (
                                    <button
                                        onClick={() => {
                                            setSelectedSlot({ day, meal: 'lunch' });
                                            setShowRecipePicker(true);
                                        }}
                                        className="w-full py-2 text-[10px] border-2 border-dashed border-slate-200 rounded text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>

                            {/* Dinner */}
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold mb-1">🍽️ Dinner</div>
                                {getMealDisplay(day, 'dinner') || (
                                    <button
                                        onClick={() => {
                                            setSelectedSlot({ day, meal: 'dinner' });
                                            setShowRecipePicker(true);
                                        }}
                                        className="w-full py-2 text-[10px] border-2 border-dashed border-slate-200 rounded text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recipe Picker Modal */}
            {showRecipePicker && selectedSlot && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold">Pick a Recipe</h3>
                                <p className="text-indigo-200 text-xs">{DAY_NAMES[DAYS.indexOf(selectedSlot.day)]} - {selectedSlot.meal}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowRecipePicker(false);
                                    setSelectedSlot(null);
                                }}
                                className="text-white/70 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Recipe List */}
                        <div className="p-6 overflow-y-auto space-y-3">
                            {allRecipes
                                .filter(r => r.mealType.includes(selectedSlot.meal))
                                .map(recipe => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => handleSelectRecipe(recipe)}
                                        className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-3xl">{recipe.emoji}</span>
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-800 group-hover:text-indigo-700">{recipe.name}</div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} /> {recipe.cookTime}min
                                                    </span>
                                                    <span>•</span>
                                                    <span>{recipe.difficulty}</span>
                                                    {recipe.hasLeftovers && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-amber-600 font-bold">♻️ Leftovers</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
