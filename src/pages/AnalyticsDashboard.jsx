import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Flame, Trophy, BookOpen, Target, ArrowRight, TrendingUp, Calendar, Zap, Award 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/Navbar';
import { cn } from '../lib/utils';

// Mock Data
const activityData = [
  { day: 'Mon', score: 45, modules: 1 },
  { day: 'Tue', score: 60, modules: 2 },
  { day: 'Wed', score: 75, modules: 1 },
  { day: 'Thu', score: 65, modules: 3 },
  { day: 'Fri', score: 85, modules: 2 },
  { day: 'Sat', score: 90, modules: 4 },
  { day: 'Sun', score: 80, modules: 2 },
];

const completionData = [
  { name: 'Summary', value: 100, color: '#3B82F6' },
  { name: 'Concepts', value: 80, color: '#8B5CF6' },
  { name: 'Flashcards', value: 60, color: '#10B981' },
  { name: 'Quiz', value: 40, color: '#F59E0B' },
];

const recentModules = [
  { id: 1, title: "Introduction to React Hooks", status: "In Progress", progress: 75, lastActive: "2 hours ago" },
  { id: 2, title: "Advanced CSS Grid", status: "Completed", progress: 100, lastActive: "Yesterday" },
  { id: 3, title: "JavaScript ES6+", status: "In Progress", progress: 30, lastActive: "3 days ago" },
];

const heatmapData = [
  { module: 'React', scores: [80, 90, 60, 85] },
  { module: 'CSS', scores: [95, 85, 90, 100] },
  { module: 'JS', scores: [60, 50, 70, 65] },
];

export default function AnalyticsDashboard() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Learning Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Tracking your growth across modules</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              JD
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900 dark:text-white">John Doe</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pro Learner</p>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            icon={BookOpen} 
            label="Modules Completed" 
            value="12" 
            trend="+2 this week" 
            color="blue" 
          />
          <KPICard 
            icon={Target} 
            label="Avg Quiz Score" 
            value="86%" 
            trend="+5% vs last week" 
            color="green" 
          />
          <KPICard 
            icon={Zap} 
            label="Flashcards Mastered" 
            value="340" 
            trend="Top 10%" 
            color="purple" 
          />
          <KPICard 
            icon={Flame} 
            label="Current Streak" 
            value="5 Days" 
            trend="Keep it up!" 
            color="orange" 
            animate
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Graph */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-500" />
                  Learning Activity
                </h3>
                <select className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm px-3 py-1 text-slate-600 dark:text-slate-300 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Modules */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Modules</h3>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentModules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group cursor-pointer" onClick={() => navigate(`/module/${module.id}`)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{module.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>{module.lastActive}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span>{module.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{module.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${module.progress}%` }} />
                        </div>
                      </div>
                      <button className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shadow-sm">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            {/* Streak Widget */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Flame size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <Flame size={20} className="animate-pulse" />
                  <span className="font-medium uppercase tracking-wider text-sm">Learning Streak</span>
                </div>
                <div className="text-5xl font-extrabold mb-4">5 Days</div>
                <p className="text-orange-100 text-sm mb-6">You're on fire! Complete a lesson today to keep the streak alive.</p>
                
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs opacity-70">{d}</span>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                        i < 5 ? "bg-white text-orange-600" : "bg-white/20 text-white"
                      )}>
                        {i < 5 ? <CheckIcon /> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Completion Donuts */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Completion Stats</h3>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">75%</span>
                  <span className="text-xs text-slate-500">Overall</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {completionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Heatmap */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Performance Heatmap</h3>
              <div className="space-y-3">
                {heatmapData.map((row) => (
                  <div key={row.module} className="flex items-center gap-3">
                    <span className="w-12 text-xs font-bold text-slate-500 dark:text-slate-400">{row.module}</span>
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      {row.scores.map((score, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-8 rounded-md transition-all hover:scale-105 cursor-help",
                            score >= 90 ? "bg-green-500" :
                            score >= 70 ? "bg-yellow-400" :
                            "bg-red-400"
                          )}
                          title={`Score: ${score}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Review Weak Areas
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Continue Learning Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/learn/1')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <BookOpen size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium opacity-70">Continue Learning</p>
              <p className="font-bold truncate">Introduction to React Hooks</p>
            </div>
          </div>
          <button className="p-2 bg-white/10 dark:bg-slate-900/10 rounded-lg">
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, trend, color, animate }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", colors[color])}>
          <Icon size={24} className={cn(animate && "animate-pulse")} />
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          trend.includes('+') ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
        )}>
          {trend}
        </span>
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
