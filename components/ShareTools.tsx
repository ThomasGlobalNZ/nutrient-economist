import React, { useState } from 'react';
import { Recipe } from '../data/recipeTypes';
import { MessageCircle, Send, Mail, Check, Share2, X } from 'lucide-react';

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
    const [showShoppingModal, setShowShoppingModal] = useState(false);
    const [showRecipesModal, setShowRecipesModal] = useState(false);

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
        setShowShoppingModal(false);
        setShowRecipesModal(false);
    };

    // Share via Messenger
    const shareViaMessenger = (content: 'shopping' | 'recipes') => {
        const text = content === 'shopping' ? generateShoppingListText() : generateRecipesText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        window.open('https://www.messenger.com/', '_blank');
        setShowShoppingModal(false);
        setShowRecipesModal(false);
    };

    // Share via Email
    const shareViaEmail = (content: 'shopping' | 'recipes') => {
        const text = content === 'shopping' ? generateShoppingListText() : generateRecipesText();
        const subject = content === 'shopping' ? 'Shopping List from SmartKete' : 'Recipes from SmartKete';
        const encoded = encodeURIComponent(text);
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encoded}`;
        setShowShoppingModal(false);
        setShowRecipesModal(false);
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
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        setShowShoppingModal(false);
        setShowRecipesModal(false);
    };

    return (
        <div className="space-y-4">
            {/* Main Share Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setShowShoppingModal(true)}
                    className="flex items-center justify-center gap-3 py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    <Share2 className="w-5 h-5" />
                    Share Shopping List
                </button>
                <button
                    onClick={() => setShowRecipesModal(true)}
                    className="flex items-center justify-center gap-3 py-4 px-6 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    <Share2 className="w-5 h-5" />
                    Share Recipes
                </button>
            </div>

            {/* Shopping List Modal */}
            {showShoppingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-emerald-500 p-6 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Share Shopping List</h3>
                                <button onClick={() => setShowShoppingModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm opacity-90 mt-2">Choose how to share</p>
                        </div>
                        <div className="p-6 space-y-3">
                            <button
                                onClick={() => shareViaWhatsApp('shopping')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp
                            </button>
                            <button
                                onClick={() => shareViaMessenger('shopping')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <Send className="w-5 h-5" />
                                Messenger
                            </button>
                            <button
                                onClick={() => shareViaEmail('shopping')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <Mail className="w-5 h-5" />
                                Email
                            </button>
                            <button
                                onClick={() => handleNativeShare('shopping')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <Share2 className="w-5 h-5" />
                                More Options...
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recipes Modal */}
            {showRecipesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-purple-500 p-6 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Share Recipes</h3>
                                <button onClick={() => setShowRecipesModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm opacity-90 mt-2">Choose how to share</p>
                        </div>
                        <div className="p-6 space-y-3">
                            <button
                                onClick={() => shareViaWhatsApp('recipes')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp
                            </button>
                            <button
                                onClick={() => shareViaMessenger('recipes')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <Send className="w-5 h-5" />
                                Messenger
                            </button>
                            <button
                                onClick={() => shareViaEmail('recipes')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <Mail className="w-5 h-5" />
                                Email
                            </button>
                            <button
                                onClick={() => handleNativeShare('recipes')}
                                className="w-full flex items-center gap-3 py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all shadow-sm"
                            >
                                <Share2 className="w-5 h-5" />
                                More Options...
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
