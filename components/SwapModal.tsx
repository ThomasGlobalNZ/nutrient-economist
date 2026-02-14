import React from 'react';
import { Product } from '../data/mockData';
import { X, RefreshCw } from 'lucide-react';

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalProduct: Product | null;
    alternatives: Product[];
    onSelect: (newProduct: Product) => void;
}

export default function SwapModal({ isOpen, onClose, originalProduct, alternatives, onSelect }: SwapModalProps) {
    if (!isOpen || !originalProduct) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="bg-indigo-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <span className="text-2xl">{originalProduct.image}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Swap Item</h2>
                            <p className="text-indigo-200 text-xs">Don't fancy {originalProduct.name}?</p>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Alternatives ({alternatives.length})</p>

                    {alternatives.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            No logic swaps found for this item. You're stuck with it! 😅
                        </div>
                    ) : (
                        alternatives.map(product => (
                            <button
                                key={product.id}
                                onClick={() => onSelect(product)}
                                className="w-full text-left flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{product.image}</span>
                                    <div>
                                        <div className="font-bold text-slate-700 text-sm group-hover:text-indigo-700">{product.name}</div>
                                        <div className="text-[10px] text-slate-400">{product.weight_g}g • {product.brand_tier}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900 group-hover:text-indigo-700">${product.price.toFixed(2)}</div>
                                    <div className={`text-[10px] font-bold ${product.price > originalProduct.price ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {product.price > originalProduct.price ? '+' : ''}
                                        ${(product.price - originalProduct.price).toFixed(2)}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* FOOTER */}
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="text-slate-500 text-xs font-bold hover:text-slate-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
