import React, { useState } from "react";
import { 
  Camera, 
  MapPin, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader2,
  AlertCircle,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { registerMissingPerson } from "../services/personService";
import { getFaceDescriptor } from "../services/faceService";
import { auth } from "../lib/firebase";

interface RegisterCaseProps {
  onComplete: () => void;
}

export const RegisterCase: React.FC<RegisterCaseProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    physicalDescription: "",
    reporterContact: "",
  });
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: "" });
  const [photo, setPhoto] = useState<string | null>(null);
  const [extractingFace, setExtractingFace] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      let faceDescriptor: number[] | undefined;
      
      if (photo) {
        setExtractingFace(true);
        const img = new Image();
        img.src = photo;
        await new Promise(r => img.onload = r);
        const descriptor = await getFaceDescriptor(img);
        if (descriptor) faceDescriptor = descriptor;
        setExtractingFace(false);
      }

      await registerMissingPerson({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        physicalDescription: formData.physicalDescription,
        photoUrl: photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
        faceDescriptor,
        lastSeenLocation: location,
        status: "Active",
        reporterId: auth.currentUser.uid,
        reporterContact: formData.reporterContact,
        caseNumber: "CASE-" + Math.random().toString(36).substring(7).toUpperCase(),
      });
      onComplete();
    } catch (error) {
      console.error(error);
      alert("Error registering case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Register Missing Person</h2>
            <p className="text-slate-400 text-sm mt-1">Step {step} of 3</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-8 h-1.5 rounded-full transition-colors ${s <= step ? "bg-blue-500" : "bg-slate-800"}`} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Age</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 24"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Physical Description</label>
                  <textarea 
                    placeholder="Traits, clothes, identifying marks..."
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    value={formData.physicalDescription}
                    onChange={e => setFormData({ ...formData, physicalDescription: e.target.value })}
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.age}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-6"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center block">Upload Recent Clear Photo</label>
                  <div className="relative group mx-auto w-48 h-48">
                    <div className="absolute inset-0 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer group-hover:border-blue-500 transition-colors overflow-hidden">
                      {photo ? (
                        <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-slate-600 mb-2" />
                          <span className="text-xs text-slate-500 font-medium">Click to upload</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider mt-2">Required for AI Facial Recognition</p>
                </div>

                <div className="space-y-2 mt-8">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Seen Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search address or area"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      value={location.address}
                      onChange={e => setLocation({ ...location, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button 
                      onClick={() => setLocation({ ...location, lat: 13.7563, lng: 100.5018, address: "Bangkok, Thailand" })}
                      className="text-[10px] bg-slate-800 px-3 py-1.5 rounded-lg text-slate-400 font-bold uppercase tracking-wider hover:bg-slate-700 transition"
                    >
                      Use Demo Location
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!photo || !location.address}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  Last Step
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold">Final Verification</h4>
                    <p className="text-xs text-slate-500">Confirm all details before broadcasting</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Name</span>
                    <span className="text-white font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Seen</span>
                    <span className="text-white font-medium truncate max-w-[150px]">{location.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Reporter Contact</span>
                    <input 
                      type="text"
                      className="bg-transparent border-b border-slate-800 text-right focus:outline-none focus:border-blue-500"
                      placeholder="Required"
                      value={formData.reporterContact}
                      onChange={e => setFormData({ ...formData, reporterContact: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-500/80 uppercase font-bold tracking-wider leading-relaxed">
                  Upon submission, a smart alert will be sent to all volunteers within 10KM of the last seen location.
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !formData.reporterContact}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {extractingFace ? "Extracting Face AI..." : "Broadcasting..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Broadcast Search
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
