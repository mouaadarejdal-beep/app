
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Workbench from './components/Workbench';
import ChartPreview from './components/ChartPreview';
import ExportHub from './components/ExportHub';
import { AppStep, TableData, ScanEntry } from './types';
import { digitizeLabTable } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<TableData>({ headers: [], rows: [] });
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('labdigitizer_history_v3');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("History corruption detected.");
      }
    }
  }, []);

  const saveToHistory = (entry: ScanEntry) => {
    const newHistory = [entry, ...history.slice(0, 19)];
    setHistory(newHistory);
    localStorage.setItem('labdigitizer_history_v3', JSON.stringify(newHistory));
  };

  const handleCapture = async (base64: string) => {
    setRawImage(base64);
    setIsProcessing(true);
    setError(null);

    try {
      const result = await digitizeLabTable(base64);
      setData(result.table);
      
      const newEntry: ScanEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        data: result.table,
        image: base64,
        tag: 'Physics TP 4' // Default tag for now
      };
      saveToHistory(newEntry);
      setStep('workbench');
    } catch (err: any) {
      setError(err.message || 'Signal interruption: Acquisition Failed.');
      setStep('dashboard');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSelectHistory = (entry: ScanEntry) => {
    setData(entry.data);
    setRawImage(entry.image);
    setStep('workbench');
  };

  const reset = () => {
    setStep('dashboard');
    setData({ headers: [], rows: [] });
    setRawImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#121417] text-white selection:bg-[#00d4ff] selection:text-[#121417]">
      
      {/* Sidebar - Desktop Interface */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-[#121417] sticky top-0 h-screen p-10 z-[70]">
        <div className="flex items-center space-x-3 mb-20 cursor-pointer group" onClick={reset}>
          <div className="bg-[#00d4ff] p-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.3)] group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-[#121417]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase tracking-widest">LabDigitizer</span>
        </div>

        <nav className="flex-1 space-y-4">
          {[
            { id: 'dashboard', label: 'Home Node', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'workbench', label: 'Workbench', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
            { id: 'plot', label: 'Graph View', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'export', label: 'Export Hub', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                if (item.id === 'workbench' || item.id === 'export' || item.id === 'plot') {
                   if (rawImage) setStep(item.id as AppStep);
                } else {
                  setStep(item.id as AppStep);
                }
              }}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all border
                ${step === item.id ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/20' : 'text-slate-500 hover:text-white border-transparent'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={item.icon} /></svg>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content & Mobile Viewport */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Unified Mobile/Desktop Header (Responsive) */}
        <header className={`sticky top-0 z-[60] bg-[#121417]/95 border-b border-white/5 transition-all duration-500 ${step === 'scanner' ? 'opacity-0 -translate-y-full' : 'opacity-100'}`}>
          <div className="flex items-center justify-between px-6 py-4">
             <button className="p-2 text-slate-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
             </button>
             <h1 className="font-black italic uppercase tracking-tighter text-lg md:hidden">LabDigitizer</h1>
             <h1 className="hidden md:block font-black italic uppercase tracking-tighter text-lg">{step.toUpperCase()} NODE</h1>
             <div className="w-10"></div> {/* Spacer */}
          </div>
          
          {/* Status Bar with Haptic Animation */}
          <div className="flex items-center justify-center space-x-3 py-1.5 bg-white/[0.02] border-t border-white/5">
             <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4ff]"></span>
             </div>
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00d4ff]">
                {isProcessing ? 'Acquiring Matrix Data...' : 'Precision Core Ready - TP Mode Active'}
             </span>
          </div>
        </header>

        {/* Content Body */}
        <main className={`flex-1 p-6 md:p-12 overflow-auto ${step === 'scanner' ? 'p-0' : ''}`}>
          
          {error && (
            <div className="mb-10 p-6 bg-red-500/10 text-red-500 rounded-[2.5rem] border border-red-500/20 flex items-center space-x-6 animate-in fade-in slide-in-from-top-4">
                <div className="bg-red-500/20 p-3 rounded-2xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Core Alert</p>
                   <p className="font-bold text-sm">{error}</p>
                </div>
            </div>
          )}

          {step === 'dashboard' && (
            <Dashboard 
              history={history} 
              onNewScan={() => setStep('scanner')} 
              onSelectScan={onSelectHistory}
            />
          )}

          {step === 'scanner' && (
            <Scanner 
              onCapture={handleCapture} 
              isProcessing={isProcessing} 
              onCancel={() => setStep('dashboard')} 
            />
          )}

          {step === 'workbench' && rawImage && (
            <Workbench 
              image={rawImage} 
              data={data} 
              onChange={setData} 
              onProceed={() => setStep('plot')}
            />
          )}

          {step === 'plot' && rawImage && (
             <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="bg-[#1a1c1e] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                   <ChartPreview data={data} />
                </div>
                <button 
                  onClick={() => setStep('export')}
                  className="w-full py-5 bg-[#00d4ff] text-[#121417] rounded-3xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center space-x-3"
                >
                  <span>Validation Complete &rarr; Export</span>
                </button>
             </div>
          )}

          {step === 'export' && (
            <ExportHub data={data} />
          )}
        </main>

        {/* Mobile Navigation Interface */}
        <nav className={`md:hidden fixed bottom-8 left-8 right-8 z-[60] transition-all duration-500 ${step === 'scanner' ? 'opacity-0 translate-y-20' : 'opacity-100'}`}>
            <div className="bg-[#1a1c1e]/90 backdrop-blur-3xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex items-center justify-around">
                {[
                  { id: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                  { id: 'workbench', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'workbench' && !rawImage) return;
                      setStep(item.id as AppStep);
                    }}
                    className={`p-4 transition-all rounded-2xl ${step === item.id ? 'text-[#00d4ff] bg-white/5' : 'text-slate-600'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                  </button>
                ))}

                <button 
                  onClick={() => setStep('scanner')}
                  className="w-16 h-16 -mt-14 bg-[#00d4ff] text-[#121417] rounded-full shadow-[0_15px_40px_rgba(0,212,255,0.4)] flex items-center justify-center active:scale-90 transition-all border-[6px] border-[#121417]"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M12 4v16m8-8H4" /></svg>
                </button>

                {[
                  { id: 'plot', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                  { id: 'export', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      if (!rawImage) return;
                      setStep(item.id as AppStep);
                    }}
                    className={`p-4 transition-all rounded-2xl ${step === item.id ? 'text-[#00d4ff] bg-white/5' : 'text-slate-600'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                  </button>
                ))}
            </div>
        </nav>
      </div>
    </div>
  );
};

export default App;
