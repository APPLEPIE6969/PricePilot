"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

interface PriceHistory {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PriceHistory[];
  status: "BUY" | "WAIT" | "HIGH" | "NEW";
}

export function PriceChart({ data, status }: PriceChartProps) {
  const color = status === "BUY" ? "#10B981" : status === "HIGH" ? "#EF4444" : "#F59E0B";

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#ffffff50"
            tick={{ fill: '#ffffff50', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis
            stroke="#ffffff50"
            tick={{ fill: '#ffffff50', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0D0F14', borderColor: '#ffffff20', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number | undefined) => [`$${value?.toFixed(2) ?? "0.00"}`, "Price"]}
            labelStyle={{ color: '#ffffff80' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
