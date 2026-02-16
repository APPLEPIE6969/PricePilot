"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PageTransition } from "@/components/PageTransition";
import { ArrowLeft, Bell, Share2, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
  image: string;
  score: number;
  status: "BUY" | "WAIT" | "HIGH" | "NEW";
  analysis: string;
}

interface PriceHistory {
  date: string;
  price: number;
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertSet, setAlertSet] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network delay for polish
        await new Promise(r => setTimeout(r, 800));

        const productRes = await fetch(`/api/product/${id}`);
        if (!productRes.ok) throw new Error("Failed to fetch product");
        const productData = await productRes.json();

        const historyRes = await fetch(`/api/history/${id}?current=${productData.price}`);
        if (!historyRes.ok) throw new Error("Failed to fetch history");
        const historyData = await historyRes.json();

        setProduct(productData);
        setHistory(historyData);
      } catch (err) {
        setError("Could not load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSetAlert = () => {
    setAlertSet(true);
    setTimeout(() => {
      setAlertSet(false);
    }, 2000);
  };

  if (error) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Product</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <GlowButton onClick={() => router.push("/")} variant="secondary">Go Back</GlowButton>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      <PageTransition>
        <div className="container mx-auto px-6 pt-32 max-w-7xl">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </button>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2 space-y-8">
                 <div className="h-[100px] bg-white/5 rounded-2xl w-3/4" />
                 <div className="h-[400px] bg-white/5 rounded-2xl" />
                 <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="h-64 bg-white/5 rounded-2xl" />
                 <div className="h-40 bg-white/5 rounded-2xl" />
              </div>
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Chart & Stats */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-8 relative overflow-hidden">

                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 mb-8">
                    {/* Product Image */}
                    <div className="w-full md:w-1/3 aspect-square relative rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0 group">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start gap-4">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white leading-tight">{product.title}</h1>
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group shrink-0">
                          <Share2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-6">
                        <span className="text-5xl font-bold text-white tracking-tight flex items-center">
                          $<AnimatedCounter value={product.price} />
                        </span>
                        {product.originalPrice > product.price && (
                           <div className="flex flex-col">
                             <span className="text-gray-500 line-through text-lg">${product.originalPrice}</span>
                             <span className="text-emerald-400 text-sm font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                               Save ${(product.originalPrice - product.price).toFixed(2)}
                             </span>
                           </div>
                        )}
                        <StatusBadge status={product.status} />
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-[350px] w-full relative z-10 mt-8 pt-8 border-t border-white/5">
                    <PriceChart data={history} status={product.status} />
                  </div>

                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                </GlassCard>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <GlassCard className="p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">30-Day Low</span>
                    <span className="text-xl font-bold text-emerald-400">
                      ${Math.min(...history.map(h => h.price)).toFixed(2)}
                    </span>
                  </GlassCard>
                  <GlassCard className="p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">30-Day High</span>
                    <span className="text-xl font-bold text-red-400">
                      ${Math.max(...history.map(h => h.price)).toFixed(2)}
                    </span>
                  </GlassCard>
                  <GlassCard className="p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">Volatility</span>
                    <span className="text-xl font-bold text-blue-400">Low</span>
                  </GlassCard>
                  <GlassCard className="p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">Confidence</span>
                    <span className="text-xl font-bold text-purple-400">98%</span>
                  </GlassCard>
                </div>
              </div>

              {/* Right Column: AI Analysis & Actions */}
              <div className="space-y-6">
                {/* AI Score Card */}
                <GlassCard className="p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                  <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-white/10 transition-colors duration-500">
                    <Zap className="w-32 h-32" />
                  </div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> AI Buy Score
                  </h3>

                  <div className="flex items-center gap-8 mb-8 relative z-10">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                        <motion.circle
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 * (1 - product.score / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          cx="48" cy="48" r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={251.2}
                          strokeLinecap="round"
                          className={cn(
                            product.score > 70 ? "text-emerald-500" : product.score > 40 ? "text-amber-500" : "text-red-500"
                          )}
                        />
                      </svg>
                      <span className="absolute text-2xl font-bold">{product.score}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Recommendation</p>
                      <p className={cn(
                        "text-xl font-bold tracking-tight",
                        product.status === "BUY" ? "text-emerald-400" : product.status === "WAIT" ? "text-amber-400" : "text-red-400"
                      )}>
                        {product.status === "BUY" ? "Strong Buy" : product.status === "WAIT" ? "Wait for Drop" : "Do Not Buy"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300 leading-relaxed relative z-10">
                    {product.analysis}
                  </div>
                </GlassCard>

                {/* Price Alert */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-400" /> Set Price Alert
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Notify me when price drops below:
                  </p>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        defaultValue={Math.floor(product.price * 0.9)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <GlowButton
                    className="w-full justify-center"
                    onClick={handleSetAlert}
                    disabled={alertSet}
                  >
                    {alertSet ? (
                      <span className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="w-5 h-5" /> Alert Active
                      </span>
                    ) : "Create Alert"}
                  </GlowButton>
                </GlassCard>

                {/* Retailer Comparison (Mock) */}
                <GlassCard className="p-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Other Retailers</h3>
                  <div className="space-y-1">
                    {[
                      { name: "Amazon", price: product.price, diff: 0 },
                      { name: "BestBuy", price: product.price + 12.50, diff: 12.50 },
                      { name: "Walmart", price: product.price - 2.00, diff: -2.00 },
                    ].map((retailer, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <span className="text-sm font-medium group-hover:text-white transition-colors">{retailer.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-gray-300 group-hover:text-white">${retailer.price.toFixed(2)}</span>
                          <span className={cn("text-xs font-medium w-12 text-right", retailer.diff > 0 ? "text-red-400" : retailer.diff < 0 ? "text-emerald-400" : "text-gray-600")}>
                            {retailer.diff > 0 ? `+$${retailer.diff.toFixed(0)}` : retailer.diff < 0 ? `-$${Math.abs(retailer.diff).toFixed(0)}` : "-"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          ) : null}
        </div>
      </PageTransition>
      <Footer />
    </main>
  );
}
