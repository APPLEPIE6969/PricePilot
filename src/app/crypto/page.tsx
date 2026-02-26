"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { PageTransition } from "@/components/PageTransition";
import { Search, TrendingUp, TrendingDown, Activity, DollarSign, BarChart2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "@/lib/utils";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export default function CryptoPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true"
        );

        if (!response.ok) {
          if (response.status === 429) throw new Error("Rate limit exceeded. Please wait.");
          throw new Error("Failed to fetch crypto data");
        }

        const data = await response.json();
        setCoins(data);
        setError("");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not load crypto data");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    // Refresh every 60 seconds
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      <PageTransition>
        <div className="container mx-auto px-6 pt-32 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Activity className="w-8 h-8 text-cyan-400" />
                Crypto Tracker
              </h1>
              <p className="text-gray-400">Live market data and AI-powered trend analysis.</p>
            </div>
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                placeholder="Search coins..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {error && (
             <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8 flex items-center gap-2">
               <Activity className="w-4 h-4" /> {error}
             </div>
          )}

          {loading && !coins.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 bg-white/5 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredCoins.map((coin, index) => (
                  <motion.div
                    key={coin.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-cyan-500/30 transition-colors group">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                            <div>
                              <h3 className="font-bold text-lg">{coin.name}</h3>
                              <span className="text-xs text-gray-400 uppercase">{coin.symbol}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1",
                            coin.price_change_percentage_24h >= 0
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          )}>
                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="text-3xl font-bold tracking-tight">
                            ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                             <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                             <p className="text-sm font-mono text-gray-300">
                               ${(coin.market_cap / 1e9).toFixed(2)}B
                             </p>
                          </div>
                          <div>
                             <p className="text-xs text-gray-500 mb-1">Volume (24h)</p>
                             <p className="text-sm font-mono text-gray-300">
                               ${(coin.total_volume / 1e6).toFixed(0)}M
                             </p>
                          </div>
                        </div>
                      </div>

                      {/* Mini Chart */}
                      <div className="h-24 w-full -mx-2 opacity-50 group-hover:opacity-100 transition-opacity">
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={coin.sparkline_in_7d.price.map((p, i) => ({ i, p }))}>
                             <defs>
                               <linearGradient id={`gradient-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor={coin.price_change_percentage_24h >= 0 ? "#10B981" : "#EF4444"} stopOpacity={0.3}/>
                                 <stop offset="100%" stopColor={coin.price_change_percentage_24h >= 0 ? "#10B981" : "#EF4444"} stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <Area
                               type="monotone"
                               dataKey="p"
                               stroke={coin.price_change_percentage_24h >= 0 ? "#10B981" : "#EF4444"}
                               strokeWidth={2}
                               fill={`url(#gradient-${coin.id})`}
                             />
                           </AreaChart>
                         </ResponsiveContainer>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </PageTransition>
      <Footer />
    </main>
  );
}
