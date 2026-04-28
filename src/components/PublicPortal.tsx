import React from "react";
import { 
  Shield, 
  MapPin, 
  Search, 
  Users, 
  Zap, 
  ArrowRight,
  Bell,
  Heart
} from "lucide-react";
import { motion } from "motion/react";
import { MissingPerson } from "../services/personService";

interface PublicPortalProps {
  activeCases: MissingPerson[];
  onLogin: () => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({ activeCases, onLogin }) => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20"
          >
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">AI-Powered Emergency Response</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-none"
          >
            Finding Missing People, <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Together.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 leading-relaxed max-w-lg"
          >
            AuraAlert uses advanced AI facial recognition and geo-fenced smart alerts to coordinate search efforts within minutes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={onLogin}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40 flex items-center gap-2 group"
            >
              Join the Search
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 px-8 py-4 rounded-2xl font-bold transition-all">
              How it works
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6 pt-4"
          >
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
             </div>
             <p className="text-slate-500 text-sm font-medium">Joined by <span className="text-white">50k+</span> volunteers worldwide</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-3xl">
             <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video border border-slate-800 flex items-center justify-center">
                {/* Mock UI Element */}
                <div className="text-center space-y-4 p-8">
                   <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
                      <Search className="w-10 h-10 text-blue-500" />
                   </div>
                   <h3 className="font-bold text-lg">Scanning Active Feeds...</h3>
                   <div className="flex gap-2 justify-center">
                      {[1,2,3,4,5].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [8, 24, 8] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                          className="w-1 bg-blue-500 rounded-full" 
                        />
                      ))}
                   </div>
                </div>
             </div>
             <div className="mt-4 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Incident</span>
                  </div>
                  <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">1.2km Away</span>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="w-12 h-12 rounded-xl bg-slate-800" />
                   <div className="flex-1 space-y-2">
                      <div className="h-2 bg-slate-800 rounded-full w-3/4" />
                      <div className="h-2 bg-slate-800/50 rounded-full w-1/2" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Grid Features */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Bell}
          title="Smart Alerts"
          desc="Hyper-local notifications to users within a 10KM radius of a sighting."
          color="blue"
        />
        <FeatureCard 
          icon={MapPin}
          title="Real-time Tracking"
          desc="Visualize search paths and volunteer hotspots on interactive maps."
          color="emerald"
        />
        <FeatureCard 
          icon={Heart}
          title="Volunteer Network"
          desc="Instantly coordinate with thousands of local searchers and authorities."
          color="red"
        />
      </section>

      {/* Active Alerts Showcase */}
      <section className="bg-slate-900/30 py-24 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Active Search Operations</h2>
            <p className="text-slate-400 max-w-xl mx-auto">These are ongoing search cases that require your attention. Even a small piece of information can save a life.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCases.map((c) => (
              <motion.div 
                key={c.id}
                whileHover={{ y: -5 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group"
              >
                <div className="h-64 relative">
                  <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">ACTIVE CASE</span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{c.name}, {c.age}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{c.lastSeenLocation.address}</span>
                    </div>
                  </div>
                  <button onClick={onLogin} className="w-full bg-slate-800 hover:bg-slate-700 text-sm font-bold py-3 rounded-xl transition-colors">
                    I Have Information
                  </button>
                </div>
              </motion.div>
            ))}
            {activeCases.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No active searches currently. That's a good thing!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors space-y-6">
      <div className={`p-3 rounded-2xl w-fit ${colors[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};
