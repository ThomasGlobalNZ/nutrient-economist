import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export interface SetupWizardProps {
    adults: number;
    children: number;
    infants: number;
    onUpdate: (field: string, value: any) => void;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isPreservativeFree: boolean;
    excludedAllergens: string[];
    preferredStore: string;
    hasPantryStaples: boolean;
    // Legacy props (not used but kept for compatibility)
    budget?: number;
    durationDays?: number;
    mealsPerDay?: number;
    safetyBuffer?: number;
    includeSnacks?: boolean;
    mealPlan?: any;
}

export default function SetupWizard({
    adults, children, infants,
    onUpdate,
    isVegetarian, isGlutenFree, isPreservativeFree, excludedAllergens,
    hasPantryStaples, preferredStore
}: SetupWizardProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100">
                {[
                    { id: 'profile', label: '1. Who', icon: '👥' },
                    { id: 'preferences', label: '2. Preferences', icon: '⚙️' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === tab.id
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Who's eating?</h3>

                            {/* Adults */}
                            <div className="mb-4">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Adults</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => onUpdate('adults', num)}
                                            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${adults === num
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Children */}
                            <div className="mb-4">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Children (5-12 yrs)</label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => onUpdate('children', num)}
                                            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${children === num
                                                ? 'bg-cyan-500 border-cyan-500 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-cyan-200'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Infants */}
                            <div>
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Infants (0-4 yrs)</label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => onUpdate('infants', num)}
                                            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${infants === num
                                                ? 'bg-purple-500 border-purple-500 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-purple-200'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PREFERENCES TAB */}
                {activeTab === 'preferences' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Store Selection */}
                        <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Preferred Supermarket</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Any', 'Countdown', 'New World', 'PAK\'nSAVE', 'FreshChoice', 'TheKaiCo'].map(store => (
                                    <button
                                        key={store}
                                        onClick={() => onUpdate('preferredStore', store)}
                                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${preferredStore === store
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {store}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Preferences */}
                        <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 block">Dietary Preferences</label>
                            <div className="space-y-2">
                                {[
                                    { key: 'isVegetarian', label: 'Vegetarian', value: isVegetarian },
                                    { key: 'isGlutenFree', label: 'Gluten Free', value: isGlutenFree },
                                    { key: 'isPreservativeFree', label: 'Preservative Free', value: isPreservativeFree }
                                ].map(pref => (
                                    <label key={pref.key} className="flex items-center gap-3 cursor-pointer group bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${pref.value ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                            {pref.value && <span className="text-white text-xs font-bold">✓</span>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={pref.value}
                                            onChange={(e) => onUpdate(pref.key, e.target.checked)}
                                        />
                                        <span className="text-sm font-bold text-slate-900">{pref.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Allergen Exclusions */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 block">Exclude Allergens</label>
                            <div className="flex flex-wrap gap-2">
                                {['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Egg', 'Shellfish', 'Fish'].map(alg => {
                                    const isSelected = excludedAllergens.includes(alg);
                                    return (
                                        <button
                                            key={alg}
                                            onClick={() => {
                                                const newArr = isSelected
                                                    ? excludedAllergens.filter(a => a !== alg)
                                                    : [...excludedAllergens, alg];
                                                onUpdate('excludedAllergens', newArr);
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isSelected
                                                ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-500'
                                                }`}
                                        >
                                            {isSelected ? '✕ ' : ''}{alg}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">
                                Tapping these will REMOVE items containing them from your cart.
                            </p>
                        </div>

                        {/* Pantry Staples */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${hasPantryStaples ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                    {hasPantryStaples && <span className="text-white text-xs font-bold">✓</span>}
                                </div>
                                <input type="checkbox" className="hidden" checked={hasPantryStaples} onChange={(e) => onUpdate('hasPantryStaples', e.target.checked)} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900 block">I have Staples</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Skip Rice, Pasta, Oil, Butter</span>
                                </div>
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-100">
                {activeTab !== 'profile' ? (
                    <button onClick={() => setActiveTab('profile')} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                        ← Back
                    </button>
                ) : <div></div>}

                {activeTab !== 'preferences' ? (
                    <button onClick={() => setActiveTab('preferences')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all">
                        Next →
                    </button>
                ) : (
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Setup Complete ✓</span>
                )}
            </div>
        </div>
    );
}
