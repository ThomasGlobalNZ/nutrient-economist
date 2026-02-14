import React, { useState } from 'react';
import { GeneratedCart } from '../data/utils';
import { Copy, MessageSquare, Share2, Check, Send, Smartphone, Sparkles } from 'lucide-react';

interface ExportToolsProps {
    cart: GeneratedCart;
    adults: number;
    infants: number;
    durationDays: number;
    mealsPerDay: number;
    hasPantryStaples: boolean;
}

export default function ExportTools({
    cart, adults, infants, durationDays, mealsPerDay, hasPantryStaples
}: ExportToolsProps) {

    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedList, setCopiedList] = useState(false);

    // 1. GENERATE SHOPPING LIST TEXT
    const generateListText = () => {
        const lines = [`🥝 SmartKete Haul ($${cart.total.toFixed(2)})`];
        lines.push(`For ${adults} Adults, ${infants} Kids | ${durationDays} Days`);
        lines.push('--------------------------------');

        // Group by Category
        const cats = ['protein', 'veg', 'fruit', 'carb', 'fat', 'baby'];
        cats.forEach(cat => {
            const items = cart.items.filter(i => i.product.category === cat);
            if (items.length > 0) {
                lines.push(`\n[ ${cat.toUpperCase()} ]`);
                items.forEach(i => {
                    // Just use the current product name for now
                    lines.push(`[ ] ${i.product.name} (${i.quantity > 1 ? `x${i.quantity}` : i.product.unit})`);
                });
            }
        });

        lines.push('\n--------------------------------');
        lines.push('Generate your meal plan at: https://smartkete.com'); // Placeholder URL
        return lines.join('\n');
    };

    // 2. GENERATE AI PROMPT TEXT
    // Defaults: Standard/Balanced
    const generatePromptText = () => {
        const ingredients = cart.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
        const pantry = hasPantryStaples ? "I have basic pantry staples (Oil, Spices, Flour, Rice, Pasta, Mayo, Soy Sauce)." : "I have NO pantry staples. Only use what is in the list.";

        return `
Act as a cheeky, budget-conscious Kiwi Nutritionist.
I need a ${durationDays}-day meal plan (${mealsPerDay} meals/day) for ${adults} adults and ${infants} infants.

MY SHOPPING HAUL:
${ingredients}

MY PANTRY:
${pantry}

MY PREFERENCES:
- Cooking Style: Flexible / Standard
- Health Goal: Balanced
${infants > 0 ? `- Infant logic: Suggest how to adapt the main meal for a baby, or specify when to use Formula/Pouches.` : ''}

OUTPUT FORMAT:
1. A summary of the "Vibe" of this week.
2. A Day-by-Day Table (Mon-Sun) with columns: Breakfast, Lunch, Dinner, Prep Notes.
3. A "Cheeky Tip" for saving money or time.

IMPORTANT:
- Use ONLY the ingredients provided or assumed in pantry.
- Do not suggest buying more stuff.
- If I run out of food, be creative with leftovers.
`.trim();
    };

    const handleCopy = (text: string, setFn: (v: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setFn(true);
        setTimeout(() => setFn(false), 2000);
    };

    const handleNativeShare = async () => {
        const text = generateListText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My SmartKete Haul',
                    text: text,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopy(text, setCopiedList);
        }
    };

    return (
        <div className="space-y-6">

            {/* OPTION 1: NATIVE SHARE */}
            <button
                onClick={handleNativeShare}
                className="w-full group relative overflow-hidden bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all text-left"
            >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="bg-emerald-50 rounded-full p-2">
                        <Share2 className="w-5 h-5 text-emerald-600" />
                    </div>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-emerald-100/50 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <Smartphone className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Send to Myself/Partner</h3>
                        <p className="text-sm text-slate-500 font-medium">WhatsApp, Messenger, or Copy Text</p>
                    </div>
                </div>
                {copiedList && (
                    <div className="absolute inset-0 bg-emerald-600/90 flex items-center justify-center backdrop-blur-sm animate-fade-in z-20">
                        <span className="text-white font-bold flex items-center gap-2">
                            <Check className="w-5 h-5" /> Copied to Clipboard!
                        </span>
                    </div>
                )}
            </button>

            {/* OPTION 2: AI PROMPT */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">Generate Meal Plan</h3>
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed relative z-10">
                    Want a chef to plan your week? Copy this <strong>magic prompt</strong> and paste it into ChatGPT, Claude, or DeepSeek. It knows exactly what you bought.
                </p>

                <button
                    onClick={() => handleCopy(generatePromptText(), setCopiedPrompt)}
                    className="w-full py-4 bg-white border border-indigo-100 text-indigo-700 font-bold rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex items-center justify-center gap-2 relative z-10"
                >
                    {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedPrompt ? "Copied!" : "Copy Magic Prompt"}
                </button>
            </div>

            {/* DISCLAIMER */}
            <div className="text-center">
                <p className="text-[10px] text-slate-400">
                    SmartKete doesn't send data to external AI. You stay in control.
                </p>
            </div>

        </div>
    );
}
