
import React, { useEffect } from 'react';

interface BudgetInputProps {
    onCalculate: (budget: number, adults: number, infants: number) => void;
    // Optional props for loading saved state
    initialBudget?: number;
    initialAdults?: number;
    initialInfants?: number;
}

export default function BudgetInput({
    onCalculate,
    initialBudget,
    initialAdults,
    initialInfants
}: BudgetInputProps) {
    const [budget, setBudget] = React.useState(120);
    const [adults, setAdults] = React.useState(2);
    const [infants, setInfants] = React.useState(0);

    // Sync from props if they change (e.g. loaded from LocalStorage)
    useEffect(() => {
        if (initialBudget !== undefined && initialBudget > 0) setBudget(initialBudget);
        if (initialAdults !== undefined && initialAdults > 0) setAdults(initialAdults);
        if (initialInfants !== undefined && initialInfants >= 0) setInfants(initialInfants);
    }, [initialBudget, initialAdults, initialInfants]);

    // Trigger calculation whenever local state changes
    useEffect(() => {
        onCalculate(budget, adults, infants);
    }, [budget, adults, infants, onCalculate]);

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
                        onChange={(e) => setBudget(Number(e.target.value))}
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
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-xl font-bold text-slate-800 w-4 text-center">{adults}</span>
                        <button
                            onClick={() => setAdults(adults + 1)}
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
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-xl font-bold text-slate-800 w-4 text-center">{infants}</span>
                        <button
                            onClick={() => setInfants(infants + 1)}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
