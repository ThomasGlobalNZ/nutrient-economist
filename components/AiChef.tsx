
import React, { useState } from 'react';
import { Copy, ExternalLink, ChefHat } from 'lucide-react';
import { GeneratedCart } from '../data/utils';
import { generateChefPrompt } from '../data/aiPrompts';

interface AIChefProps {
    cart: GeneratedCart;
    cravings: string[];
    isVegetarian: boolean;
    isGlutenFree: boolean;
    adults: number;
    durationDays: number;
}

export default function AIChef({
    cart, cravings, isVegetarian, isGlutenFree, adults, durationDays
}: AIChefProps) {

    const [copied, setCopied] = useState(false);
    const [prompt, setPrompt] = useState<string>('');

    // Generate prompt on mount or change
    React.useEffect(() => {
        if (cart) {
            const p = generateChefPrompt(
                cart,
                cravings,
                { isVegetarian, isGlutenFree },
                { adults, durationDays }
            );
            setPrompt(p);
        }
    }, [cart, cravings, isVegetarian, isGlutenFree, adults, durationDays]);


    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openAI = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 shadow-sm animate-fade-in relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-10 -translate-y-10"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <ChefHat size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">AI Chef 🤖</h2>
                    <p className="text-xs text-slate-500 font-medium">Turn this haul into a meal plan instantly.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner mb-6 relative group">
                <div className="h-32 overflow-y-auto custom-scrollbar pr-2">
                    <p className="text-[10px] text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
                        {prompt}
                    </p>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-white via-white to-transparent pt-4 pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-400">Scroll for more...</span>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <button
                    onClick={handleCopy}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${copied
                            ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg'
                            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
                        }`}
                >
                    {copied ? <><span className="animate-bounce">✅</span> Copied!</> : <><Copy size={16} /> Copy Prompt to Clipboard</>}
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => openAI('https://chatgpt.com')}
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all hover:shadow-md"
                    >
                        <ExternalLink size={14} /> Open ChatGPT
                    </button>
                    <button
                        onClick={() => openAI('https://claude.ai')}
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all hover:shadow-md"
                    >
                        <ExternalLink size={14} /> Open Claude
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-[10px] text-slate-400 italic">
                    Paste this prompt into your favourite AI to get a perfectly tailored meal plan based on exactly what you're buying. 🧠
                </p>
            </div>
        </div>
    );
}
