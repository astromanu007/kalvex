"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle, Loader2 } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/app/actions/orders";
import { createPaymentOrder, verifyPayment } from "@/app/actions/payments";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Step = "address" | "payment" | "confirm";

function CheckoutContent() {
  const [step, setStep] = useState<Step>("address");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [address, setAddress] = useState({
    name: "", phone: "", pincode: "", address: "", city: "", state: "", landmark: "",
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      const res = await getOrders();
      if (res.orders) {
        const found = res.orders.find((o: any) => o.id === orderId);
        if (found) setOrder(found);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const ORDER_TOTAL = order ? order.amount : 14399;

  const handlePayment = async () => {
    if (!order) return;
    setProcessing(true);

    try {
      const paymentOrder = await createPaymentOrder(order.amount, order.id);
      if (!paymentOrder.success) {
        alert("Failed to initiate payment. Please try again.");
        setProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "KALVEX LABS",
        description: `Order ${order.orderNumber} - ${order.serviceType}`,
        image: "/logo.png",
        order_id: paymentOrder.id,
        handler: async function (response: any) {
          const verifyRes = await verifyPayment(response, order.id);
          if (verifyRes.success) {
            await updateOrderStatus(order.id, "RESEARCH_STARTED");
            setDone(true);
          } else {
            alert("Payment verification failed.");
          }
          setProcessing(false);
        },
        theme: {
          color: "#0F52BA",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(response.error.description);
        setProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setProcessing(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-bg-card border border-border rounded-2xl p-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-accent-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-accent-success" />
          </div>
          <h1 className="font-heading font-bold text-2xl">Order Placed!</h1>
          <p className="text-text-secondary text-sm">Your order <span className="font-mono text-accent-primary">#{order ? order.orderNumber : "ORD-007"}</span> has been confirmed. You&apos;ll receive a confirmation email and tracking updates via WhatsApp.</p>
          <div className="flex gap-3 pt-2">
            <Link href={order ? `/dashboard/orders/${order.id}` : "/dashboard/orders"} className="flex-1">
              <Button className="w-full bg-accent-primary text-white rounded-xl shadow-glow">Track Order</Button>
            </Link>
            <Link href={order ? "/dashboard" : "/electronics"} className="flex-1">
              <Button variant="outline" className="w-full border-border rounded-xl">{order ? "Dashboard" : "Continue Shopping"}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-heading font-bold text-3xl mb-8">Checkout</h1>

        {/* Step Tabs */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          {(["address", "payment", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => { if ((s === "payment" || s === "confirm") && step === "address") return; setStep(s); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${step === s ? "bg-accent-primary text-white shadow-glow" : "bg-bg-card border border-border text-text-secondary"}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? "bg-white text-accent-primary" : "bg-bg-surface"}`}>{i + 1}</span>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
              {i < 2 && <span className="text-border">›</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* Step 1: Address */}
            {step === "address" && (
              <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-5">
                <h2 className="font-heading font-semibold text-lg">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma", full: false },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", full: false },
                    { key: "pincode", label: "PIN Code", type: "text", placeholder: "411057", full: false },
                    { key: "city", label: "City", type: "text", placeholder: "Pune", full: false },
                    { key: "state", label: "State", type: "text", placeholder: "Maharashtra", full: false },
                    { key: "landmark", label: "Landmark (Optional)", type: "text", placeholder: "Near XYZ School", full: false },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={address[key as keyof typeof address]}
                        onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Full Address</label>
                    <textarea
                      rows={3}
                      placeholder="Flat / House No., Street, Area"
                      value={address.address}
                      onChange={(e) => setAddress((a) => ({ ...a, address: e.target.value }))}
                      className="w-full bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary resize-none"
                    />
                  </div>
                </div>
                <Button onClick={() => setStep("payment")} className="w-full bg-accent-primary text-white h-12 rounded-xl shadow-glow font-semibold">
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-5">
                <h2 className="font-heading font-semibold text-lg">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: "upi", icon: Smartphone, label: "UPI / QR Code", sub: "GPay, PhonePe, Paytm, BHIM" },
                    { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                    { id: "netbanking", icon: Building2, label: "Net Banking", sub: "All major Indian banks" },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === pm.id ? "border-accent-primary bg-accent-primary/5" : "border-border hover:border-accent-primary/50"}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === pm.id ? "bg-accent-primary/10 text-accent-primary" : "bg-bg-surface text-text-muted"}`}>
                        <pm.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-text-primary">{pm.label}</p>
                        <p className="text-xs text-text-muted">{pm.sub}</p>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod === pm.id ? "border-accent-primary bg-accent-primary" : "border-border"}`} />
                    </button>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div className="bg-bg-surface rounded-xl border border-border p-4">
                    <label className="block text-sm font-medium mb-2">Enter UPI ID</label>
                    <input className="w-full bg-bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary font-mono" placeholder="yourname@upi" />
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-text-muted bg-accent-success/5 border border-accent-success/20 rounded-xl px-4 py-3">
                  <ShieldCheck className="w-4 h-4 text-accent-success flex-shrink-0" />
                  All payments secured by Razorpay PCI-DSS Level 1 encryption
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("address")} className="flex-1 border-border rounded-xl">Back</Button>
                  <Button onClick={() => setStep("confirm")} className="flex-1 bg-accent-primary text-white rounded-xl shadow-glow">Review Order</Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === "confirm" && (
              <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-5">
                <h2 className="font-heading font-semibold text-lg">Review & Confirm</h2>
                <div className="bg-bg-surface rounded-xl border border-border divide-y divide-border">
                  {order ? (
                    <>
                      <div className="flex justify-between px-4 py-3 text-sm">
                        <span className="text-text-secondary capitalize">{order.serviceType?.replace(/_/g, " ").toLowerCase()}</span>
                        <span className="font-medium">₹{order.amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3 text-sm">
                        <span className="text-text-secondary">Platform Fee</span>
                        <span className="font-medium">FREE</span>
                      </div>
                    </>
                  ) : (
                    [
                      { label: "Raspberry Pi 5 4GB × 2", amount: "₹13,000" },
                      { label: "HC-SR04 Sensor Pack × 1", amount: "₹399" },
                      { label: "0.96\" OLED × 3", amount: "₹750" },
                      { label: "Shipping", amount: "FREE" },
                      { label: "Coupon (KALVEX10)", amount: "- ₹1,415" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between px-4 py-3 text-sm">
                        <span className="text-text-secondary">{row.label}</span>
                        <span className={`font-medium ${row.amount.includes("-") ? "text-accent-success" : ""}`}>{row.amount}</span>
                      </div>
                    ))
                  )}
                  <div className="flex justify-between px-4 py-4 text-base font-bold">
                    <span>Total Payable</span>
                    <span className="text-accent-primary font-mono">₹{ORDER_TOTAL.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white h-14 rounded-xl shadow-glow text-base font-semibold"
                >
                  {processing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Payment...</> : `Pay ₹${ORDER_TOTAL.toLocaleString()} Now`}
                </Button>
              </div>
            )}

          </div>

          {/* Mini Order Summary */}
          <div className="hidden lg:block">
            <div className="bg-bg-card border border-border rounded-2xl p-5 sticky top-24 space-y-4">
              <h3 className="font-heading font-semibold text-base">Order Summary</h3>
              <div className="space-y-3 text-sm divide-y divide-border">
                {order ? (
                  <div className="flex justify-between py-2 first:pt-0">
                    <span className="text-text-secondary text-xs capitalize">{order.serviceType?.replace(/_/g, " ").toLowerCase()}</span>
                  </div>
                ) : (
                  ["Raspberry Pi 5 4GB × 2", "HC-SR04 × 1", "OLED × 3"].map((item) => (
                    <div key={item} className="flex justify-between py-2 first:pt-0">
                      <span className="text-text-secondary text-xs">{item}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-3 border-t border-border flex justify-between font-bold">
                <span>Total</span>
                <span className="text-accent-primary font-mono">₹{ORDER_TOTAL.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
