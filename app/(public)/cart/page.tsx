"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL_CART = [
  { id: "c1", name: "Raspberry Pi 5 4GB RAM", sku: "KVX-SBC-005", price: 6500, qty: 2, category: "Development Boards" },
  { id: "c2", name: "HC-SR04 Ultrasonic Sensor × Pack of 5", sku: "KVX-SEN-004", price: 399, qty: 1, category: "Sensors" },
  { id: "c3", name: "0.96\" OLED Display I2C Module", sku: "KVX-DIS-096", price: 250, qty: 3, category: "Displays" },
];

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setCart((c) => c.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id: string) => setCart((c) => c.filter((item) => item.id !== id));

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        <h1 className="font-heading font-bold text-3xl text-text-primary mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="font-heading font-semibold text-xl mb-2">Your cart is empty</h2>
            <p className="text-text-secondary text-sm mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/electronics"><Button className="bg-accent-primary text-white rounded-xl shadow-glow">Browse Store</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
                  {/* Placeholder image */}
                  <div className="w-20 h-20 rounded-xl bg-bg-surface border border-border flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-8 h-8 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-text-muted mb-1">{item.sku}</p>
                    <h3 className="font-medium text-text-primary text-sm mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-[10px] text-text-muted bg-bg-surface border border-border rounded-full px-2 py-0.5 inline-block">{item.category}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 flex-shrink-0">
                    <p className="font-mono font-bold text-accent-primary">₹{(item.price * item.qty).toLocaleString()}</p>
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-bg-surface transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-border">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-bg-surface transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-accent-danger transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Shield, text: "Secure Checkout via Razorpay" },
                  { icon: Truck, text: "Free Shipping above ₹5,000" },
                  { icon: Tag, text: "Use KALVEX10 for 10% off" },
                ].map((b) => (
                  <div key={b.text} className="bg-bg-card border border-border rounded-xl p-3 text-center flex flex-col items-center gap-2">
                    <b.icon className="w-5 h-5 text-accent-primary" />
                    <p className="text-[10px] text-text-secondary leading-tight">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-bg-card border border-border rounded-2xl p-6 sticky top-24 space-y-5">
                <h2 className="font-heading font-semibold text-lg">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal ({cart.reduce((a, i) => a + i.qty, 0)} items)</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent-success">
                      <span>Coupon Discount (10%)</span>
                      <span>- ₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Shipping</span>
                    <span className={shipping === 0 ? "text-accent-success font-medium" : "font-medium"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-accent-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="flex-1 bg-bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-primary font-mono"
                    disabled={couponApplied}
                  />
                  <Button
                    onClick={() => { if (coupon === "KALVEX10") setCouponApplied(true); }}
                    variant="outline"
                    size="sm"
                    disabled={couponApplied}
                    className="border-accent-primary text-accent-primary hover:bg-accent-primary/10 rounded-lg px-4"
                  >
                    {couponApplied ? "✓" : "Apply"}
                  </Button>
                </div>
                {couponApplied && <p className="text-xs text-accent-success -mt-2">✓ Coupon applied — 10% off!</p>}

                <Link href="/checkout">
                  <Button className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow h-12 rounded-xl font-semibold gap-2">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <p className="text-[10px] text-text-muted text-center">
                  By placing an order, you agree to our <Link href="/terms" className="underline hover:text-accent-primary">Terms</Link> and <Link href="/privacy" className="underline hover:text-accent-primary">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
