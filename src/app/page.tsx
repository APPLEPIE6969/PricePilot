"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { PageTransition } from "@/components/PageTransition";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, ShieldCheck, Zap, Bell, Activity, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartData, setChartData] = useState<{ value: number }[]>([]);
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    setChartData(Array.from({ length: 20 }, (_, i) => ({
      value: 50 + Math.random() * 50 + Math.sin(i * 0.5) * 20,
    })));
  }, []);

  const onAnalyzeClick = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      router.push(`/product/${data.id}`);
    } catch (error) {
      console.error("Analysis failed", error);
      setIsAnalyzing(false);
    }
  };

  const features = [
    { title: "Real Price History", description: "See the true price history across 30+ major retailers.", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Fake Discount Detector", description: "AI analyzes 'original' prices to expose fake sales.", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "AI Buy Score", description: "Instant recommendation: Buy Now, Wait, or Avoid.", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Smart Alerts", description: "Get notified the second a price drops to your target.", icon: Bell, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Crypto Tracking", description: "Monitor crypto assets alongside your wish list.", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  const demoChartData = [
    { value: 120 }, { value: 132 }, { value: 101 }, { value: 134 }, { value: 90 }, { value: 230 }, { value: 210 }
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <Navbar />

      <PageTransition>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col justify-center items-center text-center">

          {/* Floating Background Graph */}
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden flex items-center justify-center">
            {chartData.length > 0 && (
              <motion.div
                style={{ y: y1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2 }}
                className="w-full h-full scale-150 blur-3xl"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#colorValue)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-8 relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Never <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 animate-gradient">Overpay</span> Again.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              PricePilot uses AI to track prices, detect fake discounts, and tell you exactly when to buy.
            </p>

            <GlassCard className="max-w-xl mx-auto p-2 flex flex-col md:flex-row gap-2 items-center bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-blue-500/10">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Paste product URL..."
                  className="border-0 bg-transparent shadow-none focus:shadow-none focus:bg-transparent h-12 text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onAnalyzeClick()}
                />
              </div>
              <GlowButton
                onClick={onAnalyzeClick}
                isLoading={isAnalyzing}
                className="w-full md:w-auto h-12 px-8 text-lg"
              >
                Analyze
              </GlowButton>
            </GlassCard>

            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-gray-500 pt-8 font-medium">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Real-time Tracking
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" /> 99.9% Accuracy
              </span>
            </div>
          </motion.div>
        </section>

        {/* Live Preview Section */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
             <div className="text-center mb-12">
               <span className="text-blue-400 font-bold tracking-wider text-sm uppercase">Live Preview</span>
               <h2 className="text-3xl font-bold mt-2">See What You Get</h2>
             </div>
             <GlassCard className="p-6 md:p-8 relative overflow-hidden border-blue-500/20">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                   <div className="flex-1 space-y-4 w-full">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">BUY NOW</span>
                         <span className="text-gray-500 text-sm">Score: 92/100</span>
                      </div>
                      <h3 className="text-2xl font-bold">Sony WH-1000XM5 Headphones</h3>
                      <div className="flex items-baseline gap-2">
                         <span className="text-4xl font-bold">$298.00</span>
                         <span className="text-gray-500 line-through">$349.99</span>
                      </div>
                      <div className="h-48 w-full bg-white/5 rounded-xl overflow-hidden relative">
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={demoChartData}>
                             <defs>
                               <linearGradient id="demoColor" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fill="url(#demoColor)" />
                           </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                   <div className="w-full md:w-64 bg-white/5 rounded-xl p-6 border border-white/5">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> AI Insight</h4>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Price is at a 6-month low. Stock levels are high, but a 15% price increase is predicted within 7 days.
                      </p>
                      <button className="w-full py-2 rounded-lg bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                        View Deal
                      </button>
                   </div>
                </div>
             </GlassCard>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 h-full flex flex-col gap-4 group hover:bg-white/10 transition-colors duration-500" hoverEffect={true}>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", feature.bg)}>
                      <feature.icon className={cn("w-7 h-7", feature.color)} />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />
          <div className="container mx-auto max-w-4xl text-center space-y-16 relative z-10">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold">How It Works</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Paste URL", desc: "Copy any product link from Amazon, BestBuy, or Walmart." },
                { step: "02", title: "AI Analysis", desc: "Our engine checks historical prices and stock levels." },
                { step: "03", title: "Get Alerts", desc: "Buy at the perfect price with instant notifications." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative group"
                >
                  <div className="text-[8rem] font-bold text-white/[0.02] absolute -top-20 left-1/2 -translate-x-1/2 select-none group-hover:text-white/[0.05] transition-colors duration-500">{item.step}</div>
                  <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 group-hover:border-blue-500/30 transition-colors duration-500">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
