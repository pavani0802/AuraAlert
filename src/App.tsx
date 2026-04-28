import React, { useState, useEffect } from "react";
import { 
  AlertCircle, 
  MapPin, 
  Search, 
  Users, 
  Bell, 
  Shield, 
  Menu, 
  X, 
  Plus, 
  Camera,
  Share2,
  FileText,
  TrendingUp,
  Map as MapIcon,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from "firebase/auth";
import { syncUserProfile, UserProfile } from "./services/userService";
import { subscribeToActiveCases, MissingPerson } from "./services/personService";
import { Dashboard } from "./components/Dashboard";
import { RegisterCase } from "./components/RegisterCase";
import { PublicPortal } from "./components/PublicPortal";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeCases, setActiveCases] = useState<MissingPerson[]>([]);
  const [view, setView] = useState<"dashboard" | "register" | "public">("public");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userProfile = await syncUserProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        });
        setProfile(userProfile);
        setView("dashboard");
      } else {
        setProfile(null);
        setView("public");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubCases = subscribeToActiveCases((cases) => {
      if (cases.length === 0) {
        // Demo cases for visual preview
        setActiveCases([
          {
            id: "demo-1",
            name: "Emily Watson",
            age: 8,
            gender: "Female",
            physicalDescription: "Wearing a yellow floral dress, white sneakers. Last seen playing with a blue balloon.",
            photoUrl: "https://images.unsplash.com/photo-1517677129300-07b130802f46?w=400&h=400&fit=crop",
            lastSeenLocation: { lat: 13.7563, lng: 100.5018, address: "Siam Paragon Shopping Mall, Bangkok" },
            status: "Active",
            reporterId: "demo",
            reporterContact: "+66 812 345 678",
            caseNumber: "CASE-EMILY82",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "demo-2",
            name: "John Thornton",
            age: 72,
            gender: "Male",
            physicalDescription: "Gray hair, wearing a navy cardigan and khakis. May seem confused or disoriented.",
            photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
            lastSeenLocation: { lat: 13.7263, lng: 100.5318, address: "Lumpini Park, South Gate" },
            status: "Active",
            reporterId: "demo",
            reporterContact: "+66 898 765 432",
            caseNumber: "CASE-JOHN72",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } else {
        setActiveCases(cases);
      }
    });
    return () => unsubCases();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Shield className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(user ? "dashboard" : "public")}>
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AuraAlert
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {user && (
              <>
                <button 
                  onClick={() => setView("dashboard")}
                  className={cn("text-sm font-medium transition-colors", view === "dashboard" ? "text-blue-400" : "text-slate-400 hover:text-white")}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setView("register")}
                  className={cn("text-sm font-medium transition-colors", view === "register" ? "text-blue-400" : "text-slate-400 hover:text-white")}
                >
                  Report Missing
                </button>
              </>
            )}
            {!user && (
              <button 
                onClick={() => setView("public")}
                className="text-sm font-medium text-slate-400 hover:text-white"
              >
                Public Portal
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-white">{profile?.displayName}</p>
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider">{profile?.role}</p>
                </div>
                <button 
                  onClick={() => auth.signOut()}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <User className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-900/40"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 transition-all duration-500">
        <AnimatePresence mode="wait">
          {view === "public" && (
            <motion.div
              key="public"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PublicPortal activeCases={activeCases} onLogin={login} />
            </motion.div>
          )}

          {view === "dashboard" && user && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Dashboard activeCases={activeCases} profile={profile} />
            </motion.div>
          )}

          {view === "register" && user && (
            <motion.div
              key="register"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <RegisterCase onComplete={() => setView("dashboard")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Notifications Simulation Root */}
      <div id="notifications-portal" className="fixed bottom-4 right-4 z-[100]" />
    </div>
  );
}

// Helper for classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
