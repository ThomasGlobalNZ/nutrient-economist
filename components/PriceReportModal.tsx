
import React, { useState } from 'react';
import { Product } from '../data/mockData';

interface PriceReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function PriceReportModal({ isOpen, onClose, product }: PriceReportModalProps) {
    const [newPrice, setNewPrice] = useState('');
    const [storeLocation, setStoreLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen || !product) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // SIMULATE API CALL
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Auto close after success
            setTimeout(() => {
                setIsSuccess(false);
                setNewPrice('');
                setStoreLocation('');
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">

                {/* HEADER */}
                <div className="bg-amber-500 p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        🚩 Report Price
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
                </div>

                {isSuccess ? (
                    <div className="p-8 text-center animate-fade-in">
                        <div className="text-4xl mb-2">✅</div>
                        <h4 className="font-bold text-slate-800 mb-1">Legend! Thanks.</h4>
                        <p className="text-sm text-slate-500">We'll have a squiz and fix it up.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                            <span className="text-2xl">{product.image}</span>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Report Issue For</div>
                                <div className="font-semibold text-slate-800">{product.name}</div>
                                <div className="text-xs text-slate-500">Current: ${product.price.toFixed(2)}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                What is the correct price?
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full pl-7 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold text-lg text-slate-800"
                                    placeholder="0.00"
                                    required
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                Which Store? (Optional)
                            </label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                value={storeLocation}
                                onChange={(e) => setStoreLocation(e.target.value)}
                            >
                                <option value="">Same as listed</option>
                                <option value="paknsave">Pak'nSave</option>
                                <option value="woolworths">Woolworths</option>
                                <option value="newworld">New World</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-200 active:scale-95 transition-all flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? 'Sending...' : 'Submit Report'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
