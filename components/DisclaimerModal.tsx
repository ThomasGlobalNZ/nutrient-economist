import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already accepted
        const accepted = localStorage.getItem('smartkete_legal_accepted');
        if (!accepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('smartkete_legal_accepted', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4 z-[9999] animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="font-bold text-slate-800 text-lg">Heads Up, Legend!</h2>
                </div>

                <div className="p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                    <p>
                        <strong>SmartKete is a tool, not a professional.</strong>
                    </p>
                    <p>
                        The prices, nutritional info, and "Smart Choices" shown here are <strong>estimates only</strong>. We do our best to be accurate, but supermarket prices change faster than the weather in Wellington.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-500 text-xs bg-slate-50 p-3 rounded-xl">
                        <li>We are <strong>not</strong> financial advisors.</li>
                        <li>We are <strong>not</strong> medical professionals or dietitians.</li>
                        <li>Always check labels for allergens if you have severe sensitivities, even if you used our filters.</li>
                    </ul>
                    <p>
                        By using this app, you agree that we (the developers) aren't liable if your shop costs $5 more than expected or if you burn your toast. 🍞
                    </p>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={handleAccept}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all transform hover:scale-[1.02]"
                    >
                        Sweet as, I understand
                    </button>
                </div>
            </div>
        </div>
    );
}
