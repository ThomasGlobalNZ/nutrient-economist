import React, { useState } from 'react';
import { X, Send, ThumbsUp, ThumbsDown, DollarSign } from 'lucide-react';

interface CrowdsourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    estimatedTotal: number;
    itemCount: number;
    store: string;
}

export default function CrowdsourceModal({ isOpen, onClose, estimatedTotal, itemCount, store }: CrowdsourceModalProps) {
    const [realSpend, setRealSpend] = useState<string>('');
    const [usedClubcard, setUsedClubcard] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0); // 1-5
    const [feedback, setFeedback] = useState('');

    if (!isOpen) return null;

    const handleSend = () => {
        // Construct the mailto link
        const subject = encodeURIComponent(`SmartKete Data: Shop Report - $${estimatedTotal}`);

        const bodyContent = `
--- SMARTKETE DATA SUBMISSION ---
Store: ${store}
Items: ${itemCount}
Estimated Total: $${estimatedTotal.toFixed(2)}

--- USER REPORT ---
Actual Spend: $${realSpend}
Clubcard Used: ${usedClubcard ? 'YES' : 'NO'}
Rating: ${rating}/5
Feedback: ${feedback}

---------------------------------
(Attach photo of receipt if you like!)
`;
        const body = encodeURIComponent(bodyContent);

        // Open Email Client
        window.open(`mailto:tom@thomasglobal.co.nz?subject=${subject}&body=${body}`, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        📊 Verify & Improved
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    <p className="text-sm text-slate-600">
                        Help us make SmartKete smarter! Tell us what you <b>actually paid</b> so we can refine our database.
                    </p>

                    {/* 1. Real Spend */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">
                            How much was the actual receipt?
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={realSpend}
                                onChange={(e) => setRealSpend(e.target.value)}
                                placeholder={estimatedTotal.toFixed(2)}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-mono"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="clubcard"
                                checked={usedClubcard}
                                onChange={(e) => setUsedClubcard(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <label htmlFor="clubcard" className="text-sm text-slate-600">
                                I used a Clubcard / Loyalty Card
                            </label>
                        </div>
                    </div>

                    {/* 2. Rating */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">
                            Rate this Shop (Quality/Availability)
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all border ${rating >= star
                                            ? 'bg-amber-400 border-amber-400 text-white scale-110 shadow-sm'
                                            : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-amber-200'
                                        }`}
                                >
                                    {star === 5 ? '🤩' : star === 1 ? '😡' : '★'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Feedback */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">
                            Missing Items / Suggestions
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="e.g. 'You missed Tim Tams!' or 'The price of milk is wrong'"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send Report
                    </button>
                </div>
            </div>
        </div>
    );
}
