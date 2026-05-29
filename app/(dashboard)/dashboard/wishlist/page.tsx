"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Trash2, ArrowRight, PackageOpen, LayoutGrid, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const syncWishlist = () => {
      try {
        const saved = localStorage.getItem("kalvex_saved");
        if (saved) {
          const items = JSON.parse(saved);
          if (Array.isArray(items)) {
            setWishlist(items);
          }
        } else {
          setWishlist([]);
        }
      } catch (err) {}
    };

    syncWishlist();
    window.addEventListener("kalvex-wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("kalvex-wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter(i => i.id !== productId);
    localStorage.setItem("kalvex_saved", JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event("kalvex-wishlist-updated"));
  };

  const moveToCart = (product: any) => {
    try {
      // 1. Add to cart
      const cartStr = localStorage.getItem("kalvex_cart");
      let cartItems = cartStr ? JSON.parse(cartStr) : [];
      if (!Array.isArray(cartItems)) cartItems = [];

      const existingCart = cartItems.find((i: any) => i.id === product.id);
      if (existingCart) {
        existingCart.qty = (existingCart.qty || 1) + 1;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          mrp: product.mrp,
          category: product.category,
          qty: 1,
          image: product.image,
        });
      }
      localStorage.setItem("kalvex_cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("kalvex-cart-updated"));

      // 2. Remove from wishlist
      removeFromWishlist(product.id);

      // Success feedback
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
      toast.innerHTML = `<span class="text-emerald-500">✓</span> Moved to Cart`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);

    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
            <Heart className="w-6 h-6 fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
              {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
            </p>
          </div>
        </div>
        
        {wishlist.length > 0 && (
          <Link href="/cart">
            <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-6 h-12 font-bold shadow-lg transition-all duration-300 text-xs flex items-center gap-2 uppercase tracking-widest">
              View Cart <ShoppingCart className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Content Section */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-8 border-2 border-dashed border-slate-200">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Your wishlist is empty</h2>
          <p className="text-slate-500 font-bold max-w-sm mb-10">
            Save items you like to your wishlist by clicking the heart icon on any product or project.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/electronics">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-bold transition-all duration-300 text-xs uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> Browse Store
              </Button>
            </Link>
            <Link href="/projects">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold transition-all duration-300 text-xs uppercase tracking-widest flex items-center gap-2">
                <PackageOpen className="w-4 h-4" /> Browse Projects
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative aspect-square rounded-2xl bg-slate-50 mb-5 overflow-hidden border border-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded border border-slate-200">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.sku}</p>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 line-clamp-2">{item.name}</h3>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 line-through">₹{(item.mrp || 0).toLocaleString()}</span>
                      <span className="text-xl font-black text-slate-900 leading-none">₹{(item.price || 0).toLocaleString()}</span>
                    </div>
                    
                    <Button 
                      onClick={() => moveToCart(item)}
                      className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl h-12 px-6 font-bold transition-all duration-300 text-[11px] uppercase tracking-widest shadow-lg flex items-center gap-2 group/btn"
                    >
                      Move to Cart
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
