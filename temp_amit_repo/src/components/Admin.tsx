import { useState, useEffect, type FormEvent } from "react";
import { Lock, LogOut, Monitor, Smartphone } from "lucide-react";
import { Navigate } from "react-router-dom";
import { type GameDeal } from "../types";

interface AdminProps {
  deals: GameDeal[];
}

export function Admin({ deals }: AdminProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [platformStats, setPlatformStats] = useState<Record<string, number>>({ windows: 0, mac: 0, linux: 0, mobile: 0, other: 0 });
  const [countryStats, setCountryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isLoggedIn) {
      const fetchAdminStats = async () => {
        try {
          const res = await fetch("/api/admin/stats");
          if (res.ok) {
            const data = await res.json();
            setActiveUsers(data.activeUsers);
            if (data.totalVisits !== undefined) {
              setTotalVisits(data.totalVisits);
            }
            setPlatformStats(data.platformStats);
            if (data.countryStats !== undefined) {
              setCountryStats(data.countryStats);
            }
          }
        } catch (err) {
          // Silent catch for network errors
        }
      };
      
      fetchAdminStats();
      const interval = setInterval(fetchAdminStats, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        setIsLoggedIn(true);
        setError("");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-[#101014] border border-white/10 p-8 rounded-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                placeholder="Admin Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                placeholder="Admin Password"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#101014] border border-white/10 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-bold"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#101014] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Total Deals</h3>
          <p className="text-3xl font-bold text-white">{deals.length}</p>
        </div>
        <div className="bg-[#101014] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-white text-green-500">{activeUsers}</p>
        </div>
        <div className="bg-[#101014] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Total Visits</h3>
          <p className="text-3xl font-bold text-white text-blue-500">{totalVisits}</p>
        </div>
        <div className="bg-[#101014] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">API Status</h3>
          <div className="flex items-center gap-2 text-green-500 text-lg font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse glow-green"></span>
            Operational
          </div>
        </div>
      </div>

      <div className="bg-[#101014] border border-white/10 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">User Device Platforms</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-black border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-white/50" /><span className="text-sm text-white/70">Win</span></div>
            <span className="font-bold text-white">{platformStats.windows || 0}</span>
          </div>
          <div className="bg-black border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-white/50" /><span className="text-sm text-white/70">Mac</span></div>
            <span className="font-bold text-white">{platformStats.mac || 0}</span>
          </div>
          <div className="bg-black border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-white/50" /><span className="text-sm text-white/70">Linux</span></div>
            <span className="font-bold text-white">{platformStats.linux || 0}</span>
          </div>
          <div className="bg-black border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-white/50" /><span className="text-sm text-white/70">Mobile</span></div>
            <span className="font-bold text-white">{platformStats.mobile || 0}</span>
          </div>
          <div className="bg-black border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm text-white/70">Other</span>
            <span className="font-bold text-white">{platformStats.other || 0}</span>
          </div>
        </div>
      </div>
      
      {/* Vercel Premium Insights */}
      <div className="bg-gradient-to-r from-[#101014] to-[#1A1A24] border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            Vercel Premium
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          Advanced Edge Analytics
        </h2>
        <p className="text-white/60 mb-6 text-sm">Powered by Vercel Edge compute. Track real-time visitor geography.</p>
        
        {Object.keys(countryStats).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(countryStats).map(([country, count]) => (
              <div key={country} className="bg-black/50 border border-indigo-500/20 p-4 rounded-xl flex flex-col justify-between items-center text-center">
                <span className="text-sm text-white/70 mb-2 truncate w-full">{country}</span>
                <span className="text-2xl font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-black/30 border border-white/5 rounded-xl border-dashed">
            <p className="text-white/50">Awaiting edge analytics data...</p>
          </div>
        )}
      </div>

      <div className="bg-[#101014] border border-white/10 p-6 rounded-2xl min-h-[150px]">
        <h2 className="text-xl font-bold text-white mb-4">Manage Deals</h2>
        <p className="text-white/60">Administrator controls for managing deals will appear here.</p>
      </div>
    </div>
  );
}
