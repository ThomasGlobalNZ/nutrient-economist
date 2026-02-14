import React, { useState } from 'react';
import { Recipe } from '../data/recipeTypes';
import { MessageCircle, Send, Mail, Check, Share2 } from 'lucide-react';

interface ShareToolsProps {
    recipes: Recipe[];
    shoppingList: Array<{
        product: any;
        totalAmount: number;
        unit: string;
        name: string;
        recipes: string[];
    }>;
    totalCost: number;
    familySize: { adults: number; children: number; infants: number };
}

export default function ShareTools({ recipes, shoppingList, totalCost, familySize }: ShareToolsProps) {
    const [copied, setCopied] = useState(false);

    // Generate shopping list text
    const generateShoppingListText = () => {
        const lines = [`🛒 SmartKete Shopping List`];
        lines.push(`Total: $${totalCost.toFixed(2)}`);
        lines.push(`For: ${familySize.adults} adult${familySize.adults !== 1 ? 's' : ''}${familySize.children > 0 ? `, ${familySize.children} child${familySize.children !== 1 ? 'ren' : ''}` : ''}${familySize.infants > 0 ? `, ${familySize.infants} infant${familySize.infants !== 1 ? 's' : ''}` : ''}`);
        lines.push('');
        lines.push('📋 INGREDIENTS:');
        lines.push('─────────────────');

        shoppingList.forEach(item => {
            lines.push(`☐ ${item.name} - ${item.totalAmount}${item.unit}`);
            lines.push(`  (for: ${item.recipes.join(', ')})`);
        });

        lines.push('');
        lines.push('🍽️ MEALS:');
        lines.push('─────────────────');
        recipes.forEach(recipe => {
            lines.push(`• ${recipe.emoji} ${recipe.name}`);
        });

        return lines.join('\n');
    };

    // Generate recipes text with full details
    const generateRecipesText = () => {
        const lines = [`🍽️ SmartKete Recipes\n`];

        recipes.forEach((recipe, idx) => {
            lines.push(`${idx + 1}. ${recipe.emoji} ${recipe.name.toUpperCase()}`);
            lines.push(`   Servings: ${recipe.servings} | Prep: ${recipe.prepTime}m | Cook: ${recipe.cookTime}m`);
            lines.push('');
            lines.push('   INGREDIENTS:');
            recipe.ingredients.forEach(ing => {
                lines.push(`   • ${ing.amount}${ing.unit} ${ing.name}`);
            });
            lines.push('');
            lines.push('   STEPS:');
            recipe.steps.forEach((step, i) => {
                lines.push(`   ${i + 1}. ${step}`);
            });
            if (recipe.notes) {
                lines.push('');
                lines.push(`   💡 ${recipe.notes}`);
            }
            lines.push('\n─────────────────\n');
        });

        return lines.join('\n');
    };

    // Share via WhatsApp
    const shareViaWhatsApp = (content: 'shopping' | 'recipes') => {
        const text = content === 'shopping' ? generateShoppingListText() : generateRecipesText();
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encoded}`, '_blank');
    };

    // Share via Messenger
    const shareViaMessenger = (content: 'shopping' | 'recipes') => {
        const text = content === 'shopping' ? generateShoppingListText() : generateRecipesText();
        const encoded = encodeURIComponent(text);
        // Messenger doesn't support pre-filled text, so we'll copy to clipboard
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        window.open('https://www.messenger.com/', '_blank');
    };

    // Share via Email
    const shareViaEmail = (content: 'shopping' | 'recipes') => {
        const text = content === 'shopping' ? generateShoppingListText() : generateRecipesText();
        const subject = content === 'shopping' ? 'Shopping List from SmartKete' : 'Recipes from SmartKete';
        const encoded = encodeURIComponent(text);
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encoded}`;
    };

    // Native share (mobile)
    const handleNativeShare = async (content: 'shopping' | 'recipes') => {
        const text = content === 'shopping' ? generateShoppingListText() : generateRecipesText();
        const title = content === 'shopping' ? 'Shopping List' : 'Recipes';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `SmartKete ${title}`,
                    text: text,
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Shopping List Share */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                        <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Share Shopping List</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">Send your shopping list to family or yourself</p>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => shareViaWhatsApp('shopping')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                    </button>
                    <button
                        onClick={() => shareViaMessenger('shopping')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                        Messenger
                    </button>
                    <button
                        onClick={() => shareViaEmail('shopping')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </button>
                    <button
                        onClick={() => handleNativeShare('shopping')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        More...
                    </button>
                </div>
            </div>

            {/* Recipes Share */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500 p-2 rounded-lg">
                        <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Share Recipes</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">Send full recipe details with ingredients and steps</p>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => shareViaWhatsApp('recipes')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                    </button>
                    <button
                        onClick={() => shareViaMessenger('recipes')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                        Messenger
                    </button>
                    <button
                        onClick={() => shareViaEmail('recipes')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </button>
                    <button
                        onClick={() => handleNativeShare('recipes')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all shadow-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        More...
                    </button>
                </div>
            </div>

            {/* Copied notification */}
            {copied && (
                <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
                    <Check className="w-5 h-5" />
                    <span className="font-bold">Copied to clipboard!</span>
                </div>
            )}
        </div>
    );
}
