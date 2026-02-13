
'use client';

import React, { useState, useEffect } from 'react';
import BudgetInput from '../components/BudgetInput';
import ShoppingList from '../components/ShoppingList';
import { generateSmartCart, GeneratedCart } from '../data/utils';

export default function Home() {
  const [budget, setBudget] = useState<number>(0);
  const [adults, setAdults] = useState<number>(1);
  const [infants, setInfants] = useState<number>(0);

  // Dietary State
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [isGlutenFree, setIsGlutenFree] = useState<boolean>(false);
  // Pantry State
  const [hasPantryStaples, setHasPantryStaples] = useState<boolean>(false);
  // Store State
  const [preferredStore, setPreferredStore] = useState<'Any' | 'PaknSave' | 'Woolworths' | 'NewWorld'>('Any');

  const [cart, setCart] = useState<GeneratedCart | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- USER ACCOUNTS: LOCAL STORAGE ---

  // 1. LOAD on Mount
  useEffect(() => {
    const saved = localStorage.getItem('smartkete_prefs');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.budget) setBudget(data.budget);
        if (data.adults) setAdults(data.adults);
        setInfants(data.infants || 0);
        setIsVegetarian(data.isVegetarian || false);
        setIsGlutenFree(data.isGlutenFree || false);
        setHasPantryStaples(data.hasPantryStaples || false);
        setPreferredStore(data.preferredStore || 'Any');
      } catch (e) {
        console.error("Failed to load prefs", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. SAVE on Change
  useEffect(() => {
    if (!isLoaded) return; // Don't overwrite with defaults before loading

    const data = {
      budget,
      adults,
      infants,
      isVegetarian,
      isGlutenFree,
      hasPantryStaples,
      preferredStore
    };

    // Only save if we have meaningful data (avoid saving initial 0 budget if user hasn't touched it)
    if (budget > 0) {
      localStorage.setItem('smartkete_prefs', JSON.stringify(data));
    }
  }, [budget, adults, infants, isVegetarian, isGlutenFree, hasPantryStaples, preferredStore, isLoaded]);

  // 3. Calculation
  useEffect(() => {
    if (budget > 0) {
      const result = generateSmartCart(
        budget,
        adults,
        infants,
        isVegetarian,
        isGlutenFree,
        hasPantryStaples,
        preferredStore
      );
      setCart(result);
    } else {
      setCart(null);
    }
  }, [budget, adults, infants, isVegetarian, isGlutenFree, hasPantryStaples, preferredStore]);

  const handleClearData = () => {
    localStorage.removeItem('smartkete_prefs');
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-md mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-block bg-white p-3 rounded-full shadow-md mb-2">
            <span className="text-4xl">🥝</span>
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 tracking-tight">SmartKete</h1>
          <p className="text-emerald-700 font-medium">Sorted. Fresh. A bit cheeky.</p>
        </div>

        {/* INPUT CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100">
          <BudgetInput
            initialBudget={budget}
            initialAdults={adults}
            initialInfants={infants}
            onCalculate={(b, a, i) => {
              setBudget(b);
              setAdults(a);
              setInfants(i);
            }}
          />

          {/* SETTINGS AREA */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-5">

            {/* STORE SELECTOR */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Preferred Store</p>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 rounded-full">Optimize Price</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreferredStore('Any')}
                  className={`text-xs font-bold py-2 px-1 rounded-lg border transition-all col-span-2 ${preferredStore === 'Any'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'
                    }`}
                >
                  Any (Cheapest Mix)
                </button>

                <button
                  onClick={() => setPreferredStore('PaknSave')}
                  className={`text-xs font-bold py-2 px-1 rounded-lg border transition-all ${preferredStore === 'PaknSave'
                    ? 'bg-yellow-400 text-yellow-900 border-yellow-400'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-yellow-200'
                    }`}
                >
                  Pak'nSave
                </button>

                <button
                  onClick={() => setPreferredStore('Woolworths')}
                  className={`text-xs font-bold py-2 px-1 rounded-lg border transition-all ${preferredStore === 'Woolworths'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-green-200'
                    }`}
                >
                  Woolworths
                </button>

                <button
                  onClick={() => setPreferredStore('NewWorld')}
                  className={`text-xs font-bold py-2 px-1 rounded-lg border transition-all col-span-2 ${preferredStore === 'NewWorld'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-red-200'
                    }`}
                >
                  New World (Premium)
                </button>
              </div>
            </div>

            {/* DIETARY & PANTRY GRID */}
            <div className="grid grid-cols-1 gap-4">
              {/* DIETARY */}
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2">Dietary Types</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group hover:bg-emerald-50 p-2 rounded-lg transition-colors -ml-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isVegetarian ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                      {isVegetarian && <span className="text-white text-[8px] font-bold">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isVegetarian} onChange={(e) => setIsVegetarian(e.target.checked)} />
                    <span className="text-xs text-slate-600 font-semibold">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group hover:bg-amber-50 p-2 rounded-lg transition-colors">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isGlutenFree ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}`}>
                      {isGlutenFree && <span className="text-white text-[8px] font-bold">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isGlutenFree} onChange={(e) => setIsGlutenFree(e.target.checked)} />
                    <span className="text-xs text-slate-600 font-semibold">Gluten Free</span>
                  </label>
                </div>
              </div>

              {/* PANTRY */}
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2">Pantry Check</p>
                <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${hasPantryStaples ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                    {hasPantryStaples && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <input type="checkbox" className="hidden" checked={hasPantryStaples} onChange={(e) => setHasPantryStaples(e.target.checked)} />
                  <div>
                    <span className="text-sm font-bold text-slate-700 block">I have Staples</span>
                    <span className="text-[10px] text-slate-400 font-medium">Skip Rice, Pasta, Oil, Butter</span>
                  </div>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* RESULTS CARD */}
        {cart && (
          <div className="animate-fade-in-up">
            <ShoppingList cart={cart} />

            <div className="mt-8 text-center flex flex-col gap-4">
              <p className="text-xs text-slate-400">
                Data Snapshotted Feb 2026. Local Storage Enabled.
              </p>

              <button
                onClick={handleClearData}
                className="text-xs text-emerald-600 hover:text-emerald-800 underline font-medium"
              >
                Reset Saved Preferences
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
