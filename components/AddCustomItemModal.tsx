import React, { useState, useEffect } from 'react';
import { X, Plus, Search, ChevronRight } from 'lucide-react';
import { Product, products } from '../data/mockData';

interface AddCustomItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (product: Product, quantity: number) => void;
}

export default function AddCustomItemModal({ isOpen, onClose, onAdd }: AddCustomItemModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Search State
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showResults, setShowResults] = useState(false);

    // Selected product reference to use its metadata
    const [selectedTemplate, setSelectedTemplate] = useState<Product | null>(null);

    useEffect(() => {
        if (name.length > 0) {
            // Filter products
            // IMPROVED SEARCH: Case insensitive, checks name, sub-category, and tags
            const query = name.toLowerCase();
            const results = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.sub_category?.toLowerCase().includes(query) ||
                (p.tags && p.tags.some(t => t.includes(query)))
            ).slice(0, 8); // Increased limit to 8

            setSearchResults(results);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [name]);

    if (!isOpen) return null;

    const handleSelectProduct = (product: Product) => {
        setName(product.name);
        setPrice(product.price.toString());
        setSelectedTemplate(product);
        setShowResults(false); // Hide results after selection
    };

    const handleAdd = () => {
        if (!name || !price) return;

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) return;

        // Use template metadata if available, otherwise defaults
        const newProduct: Product = {
            id: selectedTemplate ? `custom-${selectedTemplate.id}-${Date.now()}` : `custom-${Date.now()}`,
            name: name, // Allow user to override name
            price: numericPrice, // Allow user to override price
            unit: selectedTemplate?.unit || 'ea',
            weight_g: selectedTemplate?.weight_g || 0,
            protein_g: selectedTemplate?.protein_g || 0,
            calories: selectedTemplate?.calories || 0,
            category: selectedTemplate?.category || 'fat', // Default to fat/treat as fallback
            sub_category: selectedTemplate?.sub_category || 'treat',
            image: selectedTemplate?.image || '🛒',
            brand_tier: selectedTemplate?.brand_tier || 'standard',
            servings_per_unit: selectedTemplate?.servings_per_unit || 1,
            sodium_level: selectedTemplate?.sodium_level || 'moderate',
            store: selectedTemplate?.store || 'General',
            isVegetarian: selectedTemplate?.isVegetarian ?? true,
            isGlutenFree: selectedTemplate?.isGlutenFree ?? false,
            isPantryStaple: false, // Assume user buys it now
            allergens: selectedTemplate?.allergens || [],
            preservatives: selectedTemplate?.preservatives || [],
            tags: selectedTemplate?.tags || []
        };

        onAdd(newProduct, quantity);
        // Reset and close
        setName('');
        setPrice('');
        setQuantity(1);
        setSelectedTemplate(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col h-[600px] max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white shrink-0">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Add Manual Item
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">

                    {/* SEARCH SECTION */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-bold text-slate-700 block">Search Item</label>
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    // If user types, we clear the template unless they pick one again
                                    // Actually, let's keep it until they pick another, but they might be editing the name
                                }}
                                placeholder="Start typing... (e.g. Butter)"
                                className="w-full pl-9 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                autoFocus
                            />
                        </div>

                        {/* AUTOCOMPLETE RESULTS */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-20 mt-1 max-h-60 overflow-y-auto">
                                <div className="p-2 text-[10px] items-center flex justify-between text-slate-400 bg-slate-50 border-b border-slate-100 font-bold uppercase tracking-wider">
                                    <span>Suggested Items</span>
                                    <span>Avg Price</span>
                                </div>
                                {searchResults.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSelectProduct(p)}
                                        className="w-full text-left p-3 hover:bg-emerald-50 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{p.image}</span>
                                            <div>
                                                <div className="font-bold text-slate-700 text-sm group-hover:text-emerald-700">{p.name}</div>
                                                <div className="text-[10px] text-slate-400">{p.brand_tier} • {p.unit}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-600">${p.price.toFixed(2)}</span>
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {!showResults && name.length > 1 && (
                            <p className="text-[10px] text-slate-400">
                                Can't find it? Type a name and set the price manually.
                            </p>
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        {/* Price & Qty */}
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-bold text-slate-700 block">Price ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-7 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="w-24 space-y-2">
                                <label className="text-sm font-bold text-slate-700 block">Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    min="1"
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
                    <button
                        onClick={handleAdd}
                        disabled={!name || !price}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
