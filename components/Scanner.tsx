
import React, { useRef, useState } from 'react';

interface ScannerProps {
  onCapture: (base64: string) => void;
  isProcessing: boolean;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture, isProcessing, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [flash, setFlash] = useState(false);
  const [contrast, setContrast] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#121417] flex flex-col animate-in fade-in zoom-in-95 duration-300">
      {/* Precision UI */}
      <div className="px-6 py-6 flex items-center justify-between text-white z-20">
        <button onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setContrast(!contrast)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contrast ? 'bg-[#ff6b00] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-white/5 text-slate-500'}`}
          >
            Enhance Contrast
          </button>
          <button 
            onClick={() => setFlash(!flash)}
            className={`p-3 rounded-2xl transition-all ${flash ? 'bg-[#00d4ff] text-[#121417]' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </div>
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
        {/* Optical Grid */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20">
             {[...Array(9)].map((_, i) => <div key={i} className="border border-[#00d4ff]/30"></div>)}
          </div>
          {/* Alignment Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="w-10 h-[2px] bg-[#00d4ff]"></div>
            <div className="h-10 w-[2px] bg-[#00d4ff] absolute"></div>
          </div>
        </div>

        {/* Framing Box */}
        <div className="relative w-full h-full max-w-lg max-h-[80vh] border-[3px] border-white/20 rounded-[3rem] z-10 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute top-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black tracking-[0.3em] text-[#00d4ff] uppercase border border-[#00d4ff]/30">
                Align Table Edges
            </div>
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-20 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#00d4ff]/20 blur-xl animate-pulse rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-white font-black uppercase tracking-widest">Digitizing telemetry</p>
                    <p className="text-[10px] text-[#00d4ff] font-bold animate-pulse">Running Gemini Vision Matrix...</p>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Shutter Bar */}
      <div className="px-10 py-16 flex items-center justify-between z-20 bg-gradient-to-t from-[#121417] via-[#121417] to-transparent">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-95 transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className={`w-24 h-24 rounded-full border-[8px] border-white/10 p-1 flex items-center justify-center group active:scale-90 transition-all ${isProcessing ? 'opacity-50' : ''}`}
        >
          <div className="w-full h-full bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
        </button>

        <div className="w-16 h-16"></div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment"
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default Scanner;
