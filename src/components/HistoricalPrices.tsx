import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingDown, Activity, ChevronRight, BarChart2 } from "lucide-react";
import { useState } from "react";

const generateMockData = () => {
  const data = [];
  let price = 59.99;
  for (let i = 12; i >= 0; i--) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    // Random price drops
    if (Math.random() > 0.7) price = price * 0.7;
    if (price < 9.99) price = 9.99; // Floor
    if (i === 4 || i === 8) price = 59.99; // Price reset (e.g. sale ended)
    
    data.push({
      date: month.toLocaleDateString('default', { month: 'short' }),
      price: Number(price.toFixed(2))
    });
  }
  return data;
};

export function HistoricalPrices() {
  const [data] = useState(generateMockData());

  return (
    <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#06B6D4]/30 rounded-3xl p-6 relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.15)]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#06B6D4]/10 blur-[80px] pointer-events-none mix-blend-screen"></div>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center border border-[#06B6D4]/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
             <BarChart2 className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <div>
            <h3 className="text-sm font-orbitron font-bold uppercase tracking-widest text-[#F9FAFB] glow-text">Historical Lowest Prices</h3>
            <p className="text-[10px] font-poppins text-[#9CA3AF] uppercase tracking-widest mt-0.5">Price Volatility & Store Comparison</p>
          </div>
        </div>
        <div className="hidden sm:flex px-3 py-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-bold uppercase tracking-widest items-center gap-1.5">
          <TrendingDown className="w-3 h-3" /> Historical Low Detected
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        {/* Chart */}
        <div className="flex-1 w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="Poppins"
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => '$' + value}
                fontFamily="Orbitron"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#050816', 
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.1)'
                }}
                itemStyle={{ color: '#06B6D4', fontFamily: 'Orbitron', fontWeight: 'bold' }}
                labelStyle={{ color: '#9CA3AF', fontFamily: 'Poppins', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#06B6D4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                activeDot={{ r: 6, fill: "#06B6D4", stroke: "#050816", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Column */}
        <div className="w-full lg:w-64 flex flex-col justify-between shrink-0 gap-4">
           {[
             { label: "All-Time Low", value: "$9.99", date: "Jan 15", store: "Steam" },
             { label: "Current Avg", value: "$39.99", store: "Multiple Stores" },
             { label: "Predicted Drop", value: "-45%", date: "Next 30 Days", store: "Epic Games" }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#06B6D4]/30 transition-colors"
             >
               <div className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-bold mb-1">{stat.label}</div>
               <div className="flex items-end justify-between">
                 <div className="text-xl font-orbitron font-black text-white glow-text">{stat.value}</div>
                 <div className="text-right">
                   {stat.date && <div className="text-[9px] text-[#8B5CF6] uppercase font-bold tracking-widest">{stat.date}</div>}
                   <div className="text-[9px] text-[#9CA3AF]">{stat.store}</div>
                 </div>
               </div>
             </motion.div>
           ))}
           
           <button className="w-full py-2.5 mt-2 bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#06B6D4] hover:text-[#050816] transition-all flex items-center justify-center gap-2">
             Detailed Analysis <ChevronRight className="w-3 h-3" />
           </button>
        </div>
      </div>
    </div>
  );
}
