'use client';

import React, { useState, useEffect } from 'react';
import SetupWizard from '../components/SetupWizard';
import RecipeBrowser from '../components/RecipeBrowser';
import RecipeDetailModal from '../components/RecipeDetailModal';
import SelectedMeals from '../components/SelectedMeals';
import ShoppingList from '../components/ShoppingList';
import ExportTools from '../components/ExportTools';
import DisclaimerModal from '../components/DisclaimerModal';
import { Recipe } from '../data/recipeTypes';
import { Product, products } from '../data/mockData';
import { getAllRecipes } from '../data/recipeLoader';

export default function Home() {
  // --- STATE ---
  // 1. Family Composition
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // 2. Preferences
  const [preferredStore, setPreferredStore] = useState('Any');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isPreservativeFree, setIsPreservativeFree] = useState(false);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [hasPantryStaples, setHasPantryStaples] = useState(false);

  // 3. Meal Selection
  const [selectedMealIds, setSelectedMealIds] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // 4. UI State
  const [currentView, setCurrentView] = useState<'setup' | 'meals' | 'shop'>('setup');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // --- EFFECTS ---
  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      const loaded = await getAllRecipes();
      setRecipes(loaded);
    };
    loadRecipes();
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('smartkete_prefs_v5'); // V5 for meal-first
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setAdults(p.adults || 2);
        setChildren(p.children || 0);
        setInfants(p.infants || 0);
        setPreferredStore(p.preferredStore || 'Any');
        setIsVegetarian(p.isVegetarian || false);
        setIsGlutenFree(p.isGlutenFree || false);
        setIsPreservativeFree(p.isPreservativeFree || false);
        setExcludedAllergens(p.excludedAllergens || []);
        setHasPantryStaples(p.hasPantryStaples || false);
        setSelectedMealIds(p.selectedMealIds || []);
      } catch (e) {
        console.error("Failed to load prefs", e);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (!isClient) return;

    const prefs = {
      adults, children, infants,
      preferredStore,
      isVegetarian, isGlutenFree, isPreservativeFree,
      excludedAllergens,
      hasPantryStaples,
      selectedMealIds
    };
    localStorage.setItem('smartkete_prefs_v5', JSON.stringify(prefs));
  }, [
    adults, children, infants,
    preferredStore,
    isVegetarian, isGlutenFree, isPreservativeFree,
    excludedAllergens,
    hasPantryStaples,
    selectedMealIds,
    isClient
  ]);

  // --- HANDLERS ---
  const handleUpdate = (field: string, value: any) => {
    if (field === 'adults') setAdults(value);
    if (field === 'children') setChildren(value);
    if (field === 'infants') setInfants(value);
    if (field === 'preferredStore') setPreferredStore(value);
    if (field === 'isVegetarian') setIsVegetarian(value);
    if (field === 'isGlutenFree') setIsGlutenFree(value);
    if (field === 'isPreservativeFree') setIsPreservativeFree(value);
    if (field === 'excludedAllergens') setExcludedAllergens(value);
    if (field === 'hasPantryStaples') setHasPantryStaples(value);
  };

  const handleSelectMeal = (recipeId: string) => {
    setSelectedMealIds(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  // Generate shopping list from selected meals
  const generateShoppingList = () => {
    const selectedRecipes = recipes.filter(r => selectedMealIds.includes(r.id));

    // Calculate scaling factor
    const totalPeople = adults + (children * 0.75) + (infants * 0.25);

    // Aggregate ingredients
    const ingredientMap = new Map<string, {
      product: Product | undefined;
      totalAmount: number;
      unit: string;
      name: string;
      recipes: string[];
    }>();

    selectedRecipes.forEach(recipe => {
      const scaleFactor = totalPeople / recipe.servings;

      recipe.ingredients.forEach(ing => {
        const key = ing.productId;
        const product = products.find(p => p.id === ing.productId);
        const scaledAmount = Math.ceil(ing.amount * scaleFactor);

        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.totalAmount += scaledAmount;
          existing.recipes.push(recipe.name);
        } else {
          ingredientMap.set(key, {
            product,
            totalAmount: scaledAmount,
            unit: ing.unit,
            name: ing.name,
            recipes: [recipe.name]
          });
        }
      });
    });

    return Array.from(ingredientMap.values());
  };

  const shoppingList = generateShoppingList();
  const totalCost = shoppingList.reduce((sum, item) => {
    if (!item.product) return sum;
    const unitsNeeded = item.totalAmount / item.product.weight_g;
    return sum + (item.product.price * unitsNeeded);
  }, 0);

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <p className="text-slate-400">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <DisclaimerModal />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
            SmartKete
          </h1>
          <p className="text-slate-600 text-sm">Your Family Recipe & Shopping Planner</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
          {[
            { id: 'setup', label: '1. Setup', icon: '👥' },
            { id: 'meals', label: '2. Meals', icon: '🍽️' },
            { id: 'shop', label: '3. Shop', icon: '🛒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${currentView === tab.id
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {currentView === 'setup' && (
            <div className="space-y-6">
              <SetupWizard
                adults={adults}
                children={children}
                infants={infants}
                durationDays={7} // Not used anymore but kept for compatibility
                mealsPerDay={3} // Not used anymore but kept for compatibility
                budget={150} // Not used anymore but kept for compatibility
                preferredStore={preferredStore}
                isVegetarian={isVegetarian}
                isGlutenFree={isGlutenFree}
                isPreservativeFree={isPreservativeFree}
                excludedAllergens={excludedAllergens}
                hasPantryStaples={hasPantryStaples}
                safetyBuffer={5} // Hardcoded
                includeSnacks={false} // Not used
                mealPlan={{}} // Not used
                onUpdate={handleUpdate}
              />
              <button
                onClick={() => setCurrentView('meals')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Next: Choose Meals →
              </button>
            </div>
          )}

          {currentView === 'meals' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Browse Recipes</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Select meals for your family. We'll generate a shopping list from your choices.
                </p>
              </div>

              <SelectedMeals
                recipes={recipes}
                selectedMealIds={selectedMealIds}
                onRemoveMeal={handleSelectMeal}
                onViewRecipe={handleViewRecipe}
              />

              <RecipeBrowser
                recipes={recipes}
                selectedMealIds={selectedMealIds}
                onSelectMeal={handleSelectMeal}
                onViewRecipe={handleViewRecipe}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('setup')}
                  className="flex-1 py-3 text-slate-500 hover:text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentView('shop')}
                  disabled={selectedMealIds.length === 0}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Shopping List →
                </button>
              </div>
            </div>
          )}

          {currentView === 'shop' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Shopping List</h2>
                <p className="text-sm text-slate-500">
                  Based on {selectedMealIds.length} selected meal{selectedMealIds.length !== 1 ? 's' : ''}
                </p>
              </div>

              {shoppingList.length > 0 ? (
                <div className="space-y-4">
                  {/* Total Cost */}
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-900">Estimated Total</span>
                      <span className="text-3xl font-black text-emerald-700">${totalCost.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      For {adults} adult{adults !== 1 ? 's' : ''}{children > 0 && `, ${children} child${children !== 1 ? 'ren' : ''}`}{infants > 0 && `, ${infants} infant${infants !== 1 ? 's' : ''}`}
                    </p>
                  </div>

                  {/* Shopping Items */}
                  <div className="space-y-3">
                    {shoppingList.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{item.product?.image || '📦'}</span>
                          <div>
                            <div className="font-semibold text-slate-900">{item.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {item.totalAmount}{item.unit}
                            </div>
                            <div className="text-xs text-emerald-600 mt-1">
                              For: {item.recipes.join(', ')}
                            </div>
                          </div>
                        </div>
                        {item.product && (
                          <div className="text-right">
                            <div className="font-bold text-slate-700">${item.product.price.toFixed(2)}</div>
                            <div className="text-xs text-slate-400">{item.product.unit}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <ExportTools
                    cart={{
                      items: shoppingList.map(item => ({
                        product: item.product!,
                        quantity: Math.ceil(item.totalAmount / (item.product?.weight_g || 1)),
                        savings: 0
                      })),
                      total: totalCost,
                      remainingBudget: 0,
                      totalMeals: selectedMealIds.length,
                      daysCovered: 7,
                      infantCount: infants,
                      durationDays: 7,
                      mealsRequired: selectedMealIds.length,
                      isSurvivalMode: false
                    }}
                    adults={adults}
                    infants={infants}
                    durationDays={7}
                    mealsPerDay={3}
                    hasPantryStaples={hasPantryStaples}
                  />
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-lg font-medium">No meals selected</p>
                  <p className="text-sm mt-1">Go back and choose some recipes!</p>
                </div>
              )}

              <button
                onClick={() => setCurrentView('meals')}
                className="w-full py-3 text-slate-500 hover:text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
              >
                ← Back to Meals
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleSelect={handleSelectMeal}
        isSelected={selectedRecipe ? selectedMealIds.includes(selectedRecipe.id) : false}
        familySize={{ adults, children, infants }}
        preferredStore={preferredStore}
      />
    </div>
  );
}
