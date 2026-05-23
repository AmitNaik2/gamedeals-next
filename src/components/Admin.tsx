"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, LogOut, LayoutDashboard, Gamepad2, Tag, FileText, 
  BarChart3, Users, Bell, Sparkles, Activity, Settings, 
  Search, Sun, Command, Menu, X, ChevronRight, Zap,
  TrendingUp, Globe, Clock, ShieldAlert, Plus, RefreshCw, Server
} from "lucide-react";
import { type GameDeal } from "../types";
import { cn } from "../lib/utils";

// --- DUMMY DATA FOR DEMO PURPOSES ---
const recentActivity = [
  { id: 1, type: 'user', message: 'New user signup from Germany', time: '2m ago' },
  { id: 2, type: 'deal', message: 'Epic Games added "Cyberpunk 2077" discount', time: '15m ago' },
  { id: 3, type: 'alert', message: 'High API latency detected on Steam endpoint', time: '1h ago' },
  { id: 4, type: 'deal', message: 'Steam Deal "Hollow Knight" expired', time: '2h ago' },
];

const performanceMetrics = [
  { label: 'Page Load', value: '0.8s', status: 'optimal' },
  { label: 'API Response', value: '142ms', status: 'optimal' },
  { label: 'Cache Hit Rate', value: '94.2%', status: 'optimal' },
  { label: 'DB Latency', value: '24ms', status: 'optimal' },
];

interface AdminProps {
  deals: GameDeal[];
}

export function Admin({ deals }: AdminProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("admin@gamesdealshub.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Global Keyboard Shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (email === "admin@gamesdealshub.com" && password === "admin123") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials. Try admin@gamesdealshub.com / admin123");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-[#3b82f6] selection:text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#18181b] border border-[#3f3f46] p-8 rounded-2xl w-full max-w-sm shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-lg">
               <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 tracking-tight">Admin Portal</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1 uppercase tracking-wider">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#09090b] border border-[#3f3f46] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#09090b] border border-[#3f3f46] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
            
            {error && <div className="text-[#ef4444] text-sm font-medium">{error}</div>}
            
            <button
              type="submit"
              className="w-full bg-[#fafafa] hover:bg-white text-[#09090b] font-bold py-2.5 px-4 rounded-lg transition-colors mt-4 shadow-md"
            >
              Continue &rarr;
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardOverview deals={deals} />;
      case "deals": return <DealTracker deals={deals} />;
      case "performance": return <PerformanceMonitor />;
      case "cms": return <CMSPanel />;
      case "ai": return <AIAssistant />;
      default: return <div className="text-[#a1a1aa] p-8 text-center">Panel under construction.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-[#fafafa] font-sans overflow-hidden selection:bg-[#3b82f6] selection:text-white">
      
      {/* Command Palette Overlay */}
      <AnimatePresence>
        {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="shrink-0 border-r border-[#3f3f46] bg-[#09090b] z-20 flex flex-col transition-all duration-300"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#3f3f46]">
           <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shrink-0">
                 <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              {sidebarOpen && <span className="font-bold tracking-tight">System Admin</span>}
           </div>
           {sidebarOpen && (
             <button onClick={() => setSidebarOpen(false)} className="text-[#a1a1aa] hover:text-white transition-colors">
               <ChevronRight className="w-4 h-4 rotate-180" />
             </button>
           )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 flex flex-col gap-1">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} open={sidebarOpen} />
          <NavItem icon={Gamepad2} label="Games" active={activeTab === 'games'} onClick={() => setActiveTab('games')} open={sidebarOpen} />
          <NavItem icon={Tag} label="Deal Tracker" active={activeTab === 'deals'} onClick={() => setActiveTab('deals')} open={sidebarOpen} />
          <NavItem icon={FileText} label="Content CMS" active={activeTab === 'cms'} onClick={() => setActiveTab('cms')} open={sidebarOpen} />
          <NavItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} open={sidebarOpen} />
          <NavItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} open={sidebarOpen} />
          
          <div className="my-3 border-t border-[#3f3f46]"></div>
          
          <NavItem icon={Sparkles} label="AI Assistant" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} open={sidebarOpen} />
          <NavItem icon={Activity} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} open={sidebarOpen} />
          <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} open={sidebarOpen} />
        </div>

        <div className="p-3 border-t border-[#3f3f46]">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-3 w-full p-2 rounded-lg text-[#a1a1aa] hover:bg-[#ef4444]/10 hover:text-[#ef4444] transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 shrink-0 border-b border-[#3f3f46] bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
             {!sidebarOpen && (
               <button onClick={() => setSidebarOpen(true)} className="text-[#a1a1aa] hover:text-white transition-colors">
                 <Menu className="w-5 h-5" />
               </button>
             )}
             
             {/* Global Search Button */}
             <button 
               onClick={() => setCmdOpen(true)}
               className="flex items-center gap-3 bg-[#18181b] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-sm text-[#a1a1aa] hover:border-[#3b82f6] transition-colors w-64"
             >
                <Search className="w-4 h-4" />
                <span className="flex-1 text-left">Search...</span>
                <div className="flex items-center gap-1 opacity-60">
                   <Command className="w-3 h-3" />
                   <span className="text-xs font-semibold">K</span>
                </div>
             </button>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full text-[#22c55e] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                ALL SYSTEMS OPERATIONAL
             </div>
             <button className="text-[#a1a1aa] hover:text-white transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#3b82f6]"></span>
             </button>
             <button className="text-[#a1a1aa] hover:text-white transition-colors">
               <Sun className="w-5 h-5" />
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3f3f46] to-[#a1a1aa] border-2 border-[#18181b] overflow-hidden"></div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#09090b]">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="max-w-[1400px] mx-auto w-full"
             >
               {renderContent()}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon: Icon, label, active, onClick, open }: { icon: any, label: string, active: boolean, onClick: () => void, open: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors overflow-hidden group",
        active ? "bg-[#3b82f6]/10 text-[#3b82f6]" : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0 transition-colors", active ? "text-[#3b82f6]" : "group-hover:text-white")} />
      {open && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </button>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#18181b] border border-[#3f3f46] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center px-4 py-3 border-b border-[#3f3f46]">
          <Search className="w-5 h-5 text-[#a1a1aa] mr-3" />
          <input 
            autoFocus 
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent border-none outline-none text-[#fafafa] placeholder:text-[#a1a1aa] text-lg"
          />
          <div className="text-xs text-[#a1a1aa] bg-[#27272a] px-2 py-1 rounded">ESC</div>
        </div>
        <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-[#a1a1aa] px-3 py-2 uppercase tracking-wider">Suggestions</div>
          <div className="flex flex-col gap-1">
             <CommandItem icon={Plus} label="Create new Article" />
             <CommandItem icon={Search} label="Search Deals" />
             <CommandItem icon={Settings} label="Go to Settings" />
             <CommandItem icon={Sparkles} label="Ask AI Assistant" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CommandItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] hover:bg-[#27272a] hover:text-[#fafafa] transition-colors">
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// --- VIEWS ---

function DashboardOverview({ deals }: { deals: GameDeal[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 text-sm bg-[#18181b] border border-[#3f3f46] rounded-lg hover:border-[#3b82f6] transition-colors flex items-center gap-2">
             <Clock className="w-4 h-4" /> Last 24h
           </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard title="Active Deals" value={String(deals.length)} trend="+12%" icon={Tag} />
         <StatCard title="Active Users" value="1,482" trend="+5.4%" icon={Users} />
         <StatCard title="Revenue (AdSense)" value="$241.50" trend="-2.1%" icon={TrendingUp} negative />
         <StatCard title="Total Traffic" value="24.5k" trend="+18%" icon={Globe} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
         {/* Fake Chart Area */}
         <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl p-6 flex flex-col min-h-[400px]">
            <h3 className="font-bold mb-6">Traffic & Engagement</h3>
            <div className="flex-1 border border-dashed border-[#3f3f46] rounded-lg flex items-center justify-center text-[#a1a1aa]">
               Interactive Chart Placeholder
            </div>
         </div>

         {/* Live Activity Feed */}
         <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Live Activity</h3>
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-ping"></span>
            </div>
            <div className="space-y-4">
               {recentActivity.map(act => (
                 <div key={act.id} className="flex gap-3">
                    <div className="mt-0.5">
                      {act.type === 'alert' ? <ShieldAlert className="w-4 h-4 text-[#ef4444]" /> :
                       act.type === 'deal' ? <Tag className="w-4 h-4 text-[#3b82f6]" /> :
                       <Users className="w-4 h-4 text-[#22c55e]" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#fafafa] leading-snug">{act.message}</p>
                      <span className="text-xs text-[#a1a1aa]">{act.time}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, negative = false }: any) {
  return (
    <div className="bg-[#18181b] border border-[#3f3f46] p-5 rounded-xl hover:border-[#3b82f6] transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#a1a1aa]">{title}</h3>
        <Icon className="w-5 h-5 text-[#3f3f46] group-hover:text-[#3b82f6] transition-colors" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        <span className={cn("text-xs font-bold px-2 py-1 rounded-md", negative ? "bg-[#ef4444]/10 text-[#ef4444]" : "bg-[#22c55e]/10 text-[#22c55e]")}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function DealTracker({ deals }: { deals: GameDeal[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Deal Tracker</h1>
        <button className="bg-[#fafafa] text-[#09090b] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors">
          <RefreshCw className="w-4 h-4" /> Sync Now
        </button>
      </div>

      <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#09090b] text-[#a1a1aa]">
              <tr>
                <th className="px-6 py-3 font-semibold border-b border-[#3f3f46]">Game Title</th>
                <th className="px-6 py-3 font-semibold border-b border-[#3f3f46]">Platform</th>
                <th className="px-6 py-3 font-semibold border-b border-[#3f3f46]">Type</th>
                <th className="px-6 py-3 font-semibold border-b border-[#3f3f46]">Price</th>
                <th className="px-6 py-3 font-semibold border-b border-[#3f3f46] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3f3f46]">
              {deals.slice(0, 10).map((deal, i) => (
                <tr key={i} className="hover:bg-[#27272a]/50 transition-colors">
                  <td className="px-6 py-4 font-medium max-w-[200px] truncate">{deal.title}</td>
                  <td className="px-6 py-4 text-[#a1a1aa]">{deal.platforms}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#27272a] rounded text-xs font-semibold text-[#fafafa]">{deal.type || 'Discount'}</span>
                  </td>
                  <td className="px-6 py-4 font-bold">{deal.salePrice === "0.00" ? "FREE" : `$${deal.salePrice || deal.worth}`}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded text-xs font-bold uppercase">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PerformanceMonitor() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">System Performance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((m, i) => (
          <div key={i} className="bg-[#18181b] border border-[#3f3f46] p-5 rounded-xl">
             <div className="text-sm font-semibold text-[#a1a1aa] mb-2">{m.label}</div>
             <div className="text-3xl font-bold mb-1">{m.value}</div>
             <div className="text-xs text-[#22c55e] uppercase font-bold tracking-wider">{m.status}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl p-6 min-h-[300px] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4 text-[#a1a1aa]">
            <Server className="w-12 h-12 opacity-50" />
            <p>Vercel Edge Network Analytics Visualizations</p>
         </div>
      </div>
    </div>
  );
}

function CMSPanel() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Content Manager</h1>
        <button className="bg-[#fafafa] text-[#09090b] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>
      <div className="flex-1 bg-[#18181b] border border-[#3f3f46] rounded-xl flex items-center justify-center overflow-hidden relative">
         {/* Fake Markdown Editor UI */}
         <div className="absolute inset-0 flex">
           <div className="flex-1 p-8 border-r border-[#3f3f46] overflow-y-auto custom-scrollbar">
              <input type="text" placeholder="Article Title..." className="w-full bg-transparent text-3xl font-bold outline-none mb-6 text-[#fafafa] placeholder:text-[#a1a1aa]" />
              <textarea placeholder="Start writing..." className="w-full h-full bg-transparent resize-none outline-none text-[#a1a1aa] leading-relaxed"></textarea>
           </div>
           <div className="w-80 bg-[#09090b] p-6 shrink-0 flex flex-col gap-6 overflow-y-auto">
              <div className="bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border border-[#8b5cf6]/20 p-4 rounded-xl">
                 <h4 className="flex items-center gap-2 font-bold text-sm mb-2 text-[#8b5cf6]"><Sparkles className="w-4 h-4" /> AI SEO Assistant</h4>
                 <p className="text-xs text-[#a1a1aa] leading-relaxed mb-3">AI recommends adding keywords: "Steam discount", "PC gaming".</p>
                 <button className="w-full py-1.5 bg-[#8b5cf6]/20 text-[#8b5cf6] font-bold text-xs rounded hover:bg-[#8b5cf6]/30 transition-colors">Apply Suggestions</button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#a1a1aa] mb-2 uppercase tracking-wider">Publish Date</label>
                <div className="bg-[#18181b] border border-[#3f3f46] p-2 rounded text-sm text-[#fafafa]">Immediately</div>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}

function AIAssistant() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8">
      <div className="flex flex-col items-center text-center mb-12">
         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-lg mb-6">
           <Sparkles className="w-8 h-8 text-white" />
         </div>
         <h1 className="text-3xl font-bold tracking-tight mb-4">DeepMind AI Assistant</h1>
         <p className="text-[#a1a1aa] max-w-lg">Generate SEO-optimized game descriptions, article drafts, and intelligent tagging automatically.</p>
      </div>

      <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl overflow-hidden flex flex-col">
         <div className="p-4 border-b border-[#3f3f46] flex gap-2 overflow-x-auto">
            <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] rounded-md text-xs font-bold whitespace-nowrap cursor-pointer">Write Article</span>
            <span className="px-3 py-1 text-[#a1a1aa] hover:bg-[#27272a] rounded-md text-xs font-bold whitespace-nowrap cursor-pointer">Generate SEO</span>
            <span className="px-3 py-1 text-[#a1a1aa] hover:bg-[#27272a] rounded-md text-xs font-bold whitespace-nowrap cursor-pointer">Auto-Tag Games</span>
         </div>
         <div className="p-6 min-h-[300px] flex flex-col">
            <div className="flex-1 flex flex-col gap-4">
               {/* Chat bubbles */}
               <div className="self-end bg-[#27272a] p-3 rounded-lg rounded-tr-none text-sm max-w-[80%]">Write a short SEO description for Cyberpunk 2077 deal.</div>
               <div className="self-start bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border border-[#8b5cf6]/20 p-3 rounded-lg rounded-tl-none text-sm max-w-[80%] text-[#a1a1aa]">
                 <span className="text-[#fafafa] font-medium">Suggestion:</span> "Grab Cyberpunk 2077 at 50% off on Steam today! Experience Night City with optimal performance using our low-end PC tweaks. Deal ends soon."
               </div>
            </div>
            <div className="mt-6 relative">
              <input type="text" placeholder="Ask AI..." className="w-full bg-[#09090b] border border-[#3f3f46] rounded-lg py-3 px-4 pr-12 text-sm outline-none focus:border-[#8b5cf6] transition-colors" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#8b5cf6] rounded-md text-white hover:bg-[#7c3aed] transition-colors">
                 <Zap className="w-4 h-4" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
