import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Bell, 
  Plus, 
  Shield, 
  Search,
  CheckCircle2,
  Clock,
  Navigation,
  X,
  Camera,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MissingPerson } from "../services/personService";
import { UserProfile } from "../services/userService";
import MapView from "./MapView";
import { calculateDistance } from "../services/geoService";

interface DashboardProps {
  activeCases: MissingPerson[];
  profile: UserProfile | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeCases, profile }) => {
  const [selectedCase, setSelectedCase] = useState<MissingPerson | null>(null);

  const stats = [
    { label: "Active Cases", value: activeCases.length, icon: AlertCircle, color: "text-red-400" },
    { label: "Volunteers Nearby", value: "1,204", icon: Users, color: "text-blue-400" },
    { label: "Last 24h Reports", value: "12", icon: Bell, color: "text-amber-400" },
    { label: "Recovery Rate", value: "92%", icon: TrendingUp, color: "text-emerald-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time emergency monitoring station</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">Live System Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-slate-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[500px] relative">
            <MapView 
              cases={activeCases} 
              userLocation={profile?.lastKnownLocation}
              onMarkerClick={(c) => setSelectedCase(c)}
            />
            {/* Map Overlay Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
              <button className="bg-slate-950/80 backdrop-blur border border-slate-800 p-2 rounded-lg hover:bg-slate-900 transition-colors">
                <Navigation className="w-5 h-5 text-blue-400" />
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Recent Alerts (10km Radius)</h3>
              <button className="text-xs text-blue-400 font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {activeCases.map((c) => (
                <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-slate-800">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500/20 shrink-0">
                    <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold truncate">{c.name}, {c.age}</p>
                      <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">CRITICAL</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{c.lastSeenLocation.address}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono text-slate-400">1.2 KM</p>
                    <p className="text-[10px] text-slate-600">2 min ago</p>
                  </div>
                </div>
              ))}
              {activeCases.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm italic">No active alerts in your area</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-xl shadow-blue-900/20">
            <h3 className="text-lg font-bold text-white mb-2">Smart Alert System</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Our AI is currently monitoring CCTV feeds and social media for matches. You will be notified instantly of any sightings.
            </p>
            <div className="space-y-3">
              <button className="w-full bg-white text-blue-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                <Plus className="w-5 h-5" />
                Register New Case
              </button>
              <button className="w-full bg-blue-700/50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border border-blue-400/30">
                <Shield className="w-5 h-5" />
                Emergency Contact
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Volunteer Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Search Efficiency</span>
                  <span className="text-emerald-400">85%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-xl font-bold">24</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Hours Online</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-xl font-bold">8</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Reports Sent</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Module Status */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Face Engine V2.4</h4>
                  <p className="text-[10px] text-slate-500">Processing 240 frames/sec</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Uptime
                  </span>
                  <span className="font-mono text-blue-400">99.98%</span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Users className="w-3 h-3" /> Active Tasks
                  </span>
                  <span className="font-mono text-blue-400">142</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Selected Case Modal Placeholder */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="h-64 relative">
                <img src={selectedCase.photoUrl} alt={selectedCase.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent" />
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white">{selectedCase.name}, {selectedCase.age}</h2>
                  <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">Case #{selectedCase.caseNumber}</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Known Location</p>
                  <div className="flex items-start gap-2 text-slate-200">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm leading-relaxed">{selectedCase.lastSeenLocation.address}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Physical Description</p>
                  <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-4">
                    "{selectedCase.physicalDescription}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Camera className="w-5 h-5" />
                    Report Sighting
                  </button>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Share2 className="w-5 h-5" />
                    Broadcast Alert
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AlertCircle = (props: any) => <AlertCircleIcon {...props} />;
import { AlertCircle as AlertCircleIcon } from "lucide-react";
