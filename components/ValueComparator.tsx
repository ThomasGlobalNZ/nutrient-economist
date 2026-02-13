
import React from 'react';
import { Product, calculateValueScore } from '../data/mockData';
import NutrientScore from './NutrientScore';

interface ValueComparatorProps {
    productA: Product;
    productB: Product;
}

export default function ValueComparator({ productA, productB }: ValueComparatorProps) {
    const scoreA = Number(calculateValueScore(productA));
    const scoreB = Number(calculateValueScore(productB));

    const isBetterA = scoreA > scoreB;

    return (
        <div className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 text-center">
                Value Scan
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Product A */}
                <div className={`flex flex-col items-center p-3 rounded-lg border ${isBetterA ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
                    <div className="text-3xl mb-2">{productA.image}</div>
                    <h4 className="text-sm font-semibold text-slate-800 text-center leading-tight mb-1 h-10 flex items-center justify-center">
                        {productA.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                        ${productA.price.toFixed(2)} / {productA.unit}
                    </p>
                    <NutrientScore score={scoreA} />
                    {isBetterA && (
                        <div className="mt-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Best Value
                        </div>
                    )}
                </div>

                {/* Product B */}
                <div className={`flex flex-col items-center p-3 rounded-lg border ${!isBetterA ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
                    <div className="text-3xl mb-2">{productB.image}</div>
                    <h4 className="text-sm font-semibold text-slate-800 text-center leading-tight mb-1 h-10 flex items-center justify-center">
                        {productB.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                        ${productB.price.toFixed(2)} / {productB.unit}
                    </p>
                    <NutrientScore score={scoreB} />
                    {!isBetterA && (
                        <div className="mt-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Best Value
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
