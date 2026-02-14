import React from 'react';

interface BudgetInputProps {
    budget: number;
    adults: number;
    infants: number;
    onBudgetChange: (val: number) => void;
    onAdultsChange: (val: number) => void;
    onInfantsChange: (val: number) => void;
    // New Flags managed by Parent
    isPreservativeFree: boolean;
    onPreservativeFreeChange: (val: boolean) => void;
    excludeInfantAllergens: boolean;
    onExcludeInfantAllergensChange: (val: boolean) => void;
}

export default function BudgetInput({
    budget,
    adults,
    infants,
    onBudgetChange,
    onAdultsChange,
    onInfantsChange,
    isPreservativeFree,
    onPreservativeFreeChange,
    excludeInfantAllergens,
    onExcludeInfantAllergensChange
}: BudgetInputProps) {

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 font-sans">
            {/* Budget Slider */}
            <div className="flex flex-col gap-2 mb-8">
                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    What's the damage? (Weekly Budget)
                </label>
                <div className="flex items-center justify-between">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                        ${budget}
                    </span>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            Sweet as
                        </span>
                    </div>
                </div>

                <div className="mt-2">
                    <input
                        type="range"
                        min="20"
                        max="400"
                        step="5"
                        value={budget}
                        onChange={(e) => onBudgetChange(Number(e.target.value))}
                        className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                        <span>Tight</span>
                        <span>Baller</span>
                    </div>
                </div>
            </div>

            {/* Family Composition */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div>
                    <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">
                        The Whānau (Adults/Kids)
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-xl font-bold text-slate-800 w-4 text-center">{adults}</span>
                        <button
                            onClick={() => onAdultsChange(adults + 1)}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">
                        Wee Ones (Formula)
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onInfantsChange(Math.max(0, infants - 1))}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-xl font-bold text-slate-800 w-4 text-center">{infants}</span>
                        <button
                            onClick={() => onInfantsChange(infants + 1)}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                            +
                        </button>
                    </div>

                    {/* INFANT SENSITIVITY TOGGLE - MOVED HERE */}
                    {infants > 0 && (
                        <div className="col-span-2 pt-2 border-t border-slate-50 mt-2 animate-fade-in">
                            <label className="flex items-center gap-2 cursor-pointer group hover:bg-pink-50 p-2 -ml-2 rounded-lg transition-colors w-fit">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${excludeInfantAllergens ? 'bg-pink-400 border-pink-400' : 'border-slate-300'}`}>
                                    {excludeInfantAllergens && <span className="text-white text-[8px] font-bold">✓</span>}
                                </div>
                                <input type="checkbox" className="hidden" checked={excludeInfantAllergens} onChange={(e) => onExcludeInfantAllergensChange(e.target.checked)} />
                                <span className="text-xs text-slate-600 font-semibold">Exclude Infant Allergens</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* PRESERVATIVE FREE TOGGLE (Global) */}
                <div className="col-span-2 pt-2 border-t border-slate-50 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 p-2 -ml-2 rounded-lg transition-colors w-fit">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isPreservativeFree ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                            {isPreservativeFree && <span className="text-white text-[8px] font-bold">✓</span>}
                        </div>
                        <input type="checkbox" className="hidden" checked={isPreservativeFree} onChange={(e) => onPreservativeFreeChange(e.target.checked)} />
                        <span className="text-xs text-slate-600 font-semibold">Preservative Free</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
