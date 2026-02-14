import React, { useState } from 'react';
import { GeneratedCart } from '../data/utils';
import { Product, products } from '../data/mockData'; // Import all products for visual lookup
import PriceReportModal from './PriceReportModal';
import SwapModal from './SwapModal';
import CrowdsourceModal from './CrowdsourceModal';
import AddCustomItemModal from './AddCustomItemModal';
import { RefreshCw, Flag, ShoppingCart, CheckCircle, Circle } from 'lucide-react';

interface ShoppingListProps {
    cart: GeneratedCart;
    onUpdate: (items: Set<string>) => void;
    onAddCustomItem: (product: Product, quantity: number) => void;
    safetyBuffer: number;
}

export default function ShoppingList({ cart, onUpdate, onAddCustomItem, safetyBuffer }: ShoppingListProps) {
    // STATE FOR SHOPPING MODE
    const [isShoppingMode, setIsShoppingMode] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    // STATE FOR SWAPS
    // Map of OriginalProductID -> NewProductID
    const [swaps, setSwaps] = useState<Record<string, string>>({});

    // STATE FOR SWAP MODAL
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    // Track BOTH the display product (for calculating alts) and the original product (for the swap key)
    const [swapTarget, setSwapTarget] = useState<{ originalKey: Product, displayed: Product, alternatives: Product[] } | null>(null);
    const [isCrowdsourceModalOpen, setIsCrowdsourceModalOpen] = useState(false);
    const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);

    // STATE FOR PRICE REPORTING
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportProduct, setReportProduct] = useState<Product | null>(null);

    // --- HANDLERS ---

    const toggleItemCheck = (id: string) => {
        const newSet = new Set(checkedItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setCheckedItems(newSet);
    };

    const handleSwapClick = (displayProduct: Product, originalProduct: Product) => {
        // Find alternatives based on the DISPLAYED product 
        // V2.5: Use sub_category for smarter swaps
        const alts = products.filter(p => {
            if (p.id === displayProduct.id) return false;

            // If sub_category exists, match it EXACTLY
            if (displayProduct.sub_category && p.sub_category) {
                return p.sub_category === displayProduct.sub_category;
            }

            // Fallback: Same category
            return p.category === displayProduct.category;
        }).sort((a, b) => a.price - b.price);

        setSwapTarget({ originalKey: originalProduct, displayed: displayProduct, alternatives: alts });
        setIsSwapModalOpen(true);
    };

    const handleSwapConfirm = (newProduct: Product) => {
        if (swapTarget) {
            setSwaps(prev => ({
                ...prev,
                [swapTarget.originalKey.id]: newProduct.id // Use the ORIGINAL ID as the key
            }));

            // Uncheck the item if it was checked (since it's a "new" item to find)
            if (checkedItems.has(swapTarget.originalKey.id)) {
                const newChecked = new Set(checkedItems);
                newChecked.delete(swapTarget.originalKey.id);
                setCheckedItems(newChecked);
            }

            setIsSwapModalOpen(false);
            setSwapTarget(null);
        }
    };

    const handleReportClick = (product: Product) => {
        setReportProduct(product);
        setIsReportModalOpen(true);
    };

    // --- CALCULATION HELPER ---
    // Resolve the display item (Original OR Swapped)
    const resolveItem = (item: { product: Product, quantity: number, savings?: number }) => {
        const swapId = swaps[item.product.id];
        let displayProduct = item.product;
        let isSwapped = false;
        let originalPrice = item.product.price;
        let currentSavings = item.savings || 0;

        if (swapId) {
            const newProd = products.find(p => p.id === swapId);
            if (newProd) {
                displayProduct = newProd;
                isSwapped = true;
                currentSavings = 0; // Lost savings on swap
            }
        }

        return {
            ...item,
            product: displayProduct,
            originalProduct: item.product,
            isSwapped,
            originalPrice,
            savings: currentSavings
        };
    };

    const getLoyaltyName = (store: string) => {
        if (store === 'Woolworths') return 'Everyday Rewards';
        if (store === 'NewWorld') return 'Clubcard';
        if (store === 'PaknSave') return 'Club Deal';
        return 'Member Deal';
    };

    const displayItems = cart.items.map(resolveItem);
    const total = displayItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const totalSavings = displayItems.reduce((acc, item) => acc + (item.savings || 0), 0);

    // Shopping Mode Metrics
    const checkedTotal = displayItems
        .filter(item => checkedItems.has(item.originalProduct.id))
        .reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden font-sans pb-20 relative">

            {/* MODALS */}
            <PriceReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                product={reportProduct}
            />

            <SwapModal
                isOpen={isSwapModalOpen}
                onClose={() => setIsSwapModalOpen(false)}
                originalProduct={swapTarget?.displayed || null}
                alternatives={swapTarget?.alternatives || []}
                onSelect={handleSwapConfirm}
            />

            <div className="bg-emerald-500 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-1">The Haul</h2>
                    <p className="text-emerald-100 text-sm mt-1">More bang for your buck.</p>
                </div>
                <button
                    onClick={() => setIsShoppingMode(!isShoppingMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-md transform hover:scale-105 active:scale-95
                        ${isShoppingMode
                            ? 'bg-slate-800 text-white border-2 border-emerald-400'
                            : 'bg-white text-emerald-600 hover:bg-emerald-50'
                        }`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    {isShoppingMode ? 'Done Shopping' : 'Start Shopping'}
                </button>
            </div>

            {/* SHOPPING MODE HEADER */}
            {isShoppingMode && (
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md animate-fade-in">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">In Basket</span>
                        <span className="text-xl font-bold text-emerald-400">${checkedTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-right flex flex-col">
                        {totalSavings > 0 && (
                            <span className="text-[10px] text-rose-400 font-bold mb-0.5">Saved ${totalSavings.toFixed(2)}</span>
                        )}
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Remaining</span>
                        <span className="text-xl font-bold">${(total - checkedTotal).toFixed(2)}</span>
                    </div>
                </div>
            )}

            <div className="p-4">
                {displayItems.map((cartItem) => {
                    const isChecked = checkedItems.has(cartItem.originalProduct.id);
                    const singleSaving = (cartItem.savings || 0) / cartItem.quantity;
                    const originalUnitPrice = cartItem.product.price + singleSaving;

                    // If we have savings, we show the "Was" price
                    const showSavings = cartItem.savings && cartItem.savings > 0;

                    return (
                        <div
                            key={cartItem.originalProduct.id}
                            onClick={() => isShoppingMode && toggleItemCheck(cartItem.originalProduct.id)}
                            className={`flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group transition-all 
                                ${cartItem.isSwapped ? 'bg-indigo-50/50 -mx-4 px-4 border-indigo-100' : ''}
                                ${isShoppingMode ? 'cursor-pointer hover:bg-slate-50' : ''}
                                ${isChecked ? 'opacity-50 grayscale' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {isShoppingMode && (
                                    <div className={`transition-colors text-emerald-500 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`}>
                                        {isChecked ? <CheckCircle className="w-6 h-6 fill-emerald-100" /> : <Circle className="w-6 h-6" />}
                                    </div>
                                )}

                                <span className="text-2xl">{cartItem.product.image}</span>
                                <div>
                                    <h4 className={`font-semibold text-slate-800 text-sm flex items-center gap-2 ${isChecked ? 'line-through text-slate-500' : ''}`}>
                                        {cartItem.product.name}
                                        {cartItem.isSwapped && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded font-bold">SWAPPED</span>}
                                    </h4>

                                    <div className="flex gap-2 mt-1">
                                        {/* Store Badge */}
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${cartItem.product.store === 'PaknSave'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : cartItem.product.store === 'Woolworths'
                                                ? 'bg-green-100 text-green-700'
                                                : cartItem.product.store === 'NewWorld'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {cartItem.product.store === 'PaknSave' ? "Pak'nSave" :
                                                cartItem.product.store === 'NewWorld' ? "New World" :
                                                    cartItem.product.store}
                                        </span>

                                        {/* QUANTITY DISPLAY */}
                                        <span className="text-[10px] text-slate-400 font-medium pt-0.5">
                                            {cartItem.quantity}x {cartItem.product.unit}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 items-end">
                                {/* VALUE BADGES (Hide in shop mode if checked) */}
                                {!isChecked && cartItem.product.category === 'protein' && (
                                    <div className="flex flex-col items-end gap-1 mb-1">
                                        {(cartItem.product.protein_g / cartItem.product.price) > 40 && (
                                            <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                                                BEST VALUE 💎
                                            </span>
                                        )}
                                        {/* BULK SAVER BADGE */}
                                        {cartItem.product.weight_g >= 2000 && (
                                            <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">
                                                BULK SAVER 📦
                                            </span>
                                        )}
                                        {cartItem.product.protein_g > 20 && (cartItem.product.protein_g / cartItem.product.price) <= 40 && (
                                            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                                HIGH PROTEIN 💪
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="font-bold text-slate-700 text-right">
                                    <div className={`${isChecked ? 'text-slate-400 line-through' : ''}`}>
                                        ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                                    </div>

                                    <div className="flex flex-col items-end">
                                        {showSavings ? (
                                            <>
                                                <div className="text-[10px] text-slate-400 font-normal line-through">
                                                    ${originalUnitPrice.toFixed(2)}/ea
                                                </div>
                                                <div className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                                    ${cartItem.product.price.toFixed(2)}/ea
                                                    <span className="bg-rose-100 px-1 rounded text-[8px] uppercase tracking-wide">
                                                        {getLoyaltyName(cartItem.product.store)}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-[10px] text-slate-400 font-normal">
                                                ${cartItem.product.price.toFixed(2)}/ea
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {/* SWAP BUTTON */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSwapClick(cartItem.product, cartItem.originalProduct); }}
                                        className="text-slate-300 hover:text-indigo-600 p-1 transition-colors"
                                        title="Swap Product"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>

                                    {/* REPORT BUTTON */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleReportClick(cartItem.product); }}
                                        className="text-slate-300 hover:text-amber-500 p-1 transition-colors"
                                        title="Report Incorrect Price"
                                    >
                                        <Flag className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {cart.items.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        Yeah nah. Not enough gold in the coffers. Slide that budget up!
                    </div>
                )}
            </div>

            {/* HEADER */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-indigo-600" />
                        Your Haul
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        {cart.items.length} Items • {cart.totalMeals} Meals Covered
                    </p>
                </div>
                <button
                    onClick={() => setIsAddCustomModalOpen(true)}
                    className="text-indigo-600 text-xs font-bold bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                    <span>➕</span> Add Item
                </button>
            </div>
            {/* FOOTER */}
            <div className="bg-slate-50 p-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-slate-500 font-medium">Total Dosh</span>
                        {totalSavings > 0 && (
                            <span className="text-xs text-rose-500 font-bold">Total Savings: ${totalSavings.toFixed(2)}</span>
                        )}
                    </div>
                    <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
                </div>

                <button
                    onClick={() => setIsCrowdsourceModalOpen(true)}
                    className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                    <span>🧾</span> Verify & Rate Shop
                </button>
            </div>

            {/* CROWDSOURCE MODAL */}
            <CrowdsourceModal
                isOpen={isCrowdsourceModalOpen}
                onClose={() => setIsCrowdsourceModalOpen(false)}
                estimatedTotal={total}
                itemCount={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                store={localStorage.getItem('smartkete_prefs_v4') ? JSON.parse(localStorage.getItem('smartkete_prefs_v4') || '{}').preferredStore : 'General'}
            />

            <AddCustomItemModal
                isOpen={isAddCustomModalOpen}
                onClose={() => setIsAddCustomModalOpen(false)}
                onAdd={onAddCustomItem}
            />

        </div>
    );
}
