
import React from 'react';

interface NutrientScoreProps {
    score: number; // e.g., 22.5 grams per dollar
    label?: string;
}

export default function NutrientScore({ score, label = "Protein Score" }: NutrientScoreProps) {
    // Determine color based on score
    // < 10: Low (Red/Orange)
    // 10-20: Medium (Yellow)
    // > 20: High (Green)

    let colorClass = "bg-slate-100 text-slate-600";
    if (score >= 25) colorClass = "bg-emerald-100 text-emerald-700";
    else if (score >= 15) colorClass = "bg-blue-100 text-blue-700";
    else colorClass = "bg-orange-100 text-orange-700";

    return (
        <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass} font-bold text-xl mb-1`}>
                {score}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {label}
            </span>
            <span className="text-[10px] text-slate-400">
                g/$
            </span>
        </div>
    );
}
