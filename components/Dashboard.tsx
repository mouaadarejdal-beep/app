
import React from 'react';
import { ScanEntry } from '../types';

interface DashboardProps {
  history: ScanEntry[];
  onNewScan: () => void;
  onSelectScan: (entry: ScanEntry) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onNewScan, onSelectScan }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onNewScan}
          className="aspect-square bg-[#1a1c1e] border border-white/5 rounded-[2rem] flex flex-col items-center justify-center space-y-4 hover:border-[#00d4ff]/30 hover:bg-[#1a1c1e]/80 transition-all group shadow-2xl"
        >
          <div className="p-5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-full group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,212,255,0.1)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
          </div>
          <span className="font-black uppercase tracking-widest text-[10px] text-white">Camera Scan</span>
        </button>
        
        <button 
          onClick={onNewScan}
          className="aspect-square bg-[#1a1c1e] border border-white/5 rounded-[2rem] flex flex-col items-center justify-center space-y-4 hover:border-[#ff6b00]/30 hover:bg-[#1a1c1e]/80 transition-all group shadow-2xl"
        >
          <div className="p-5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-full group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,107,0,0.1)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
          </div>
          <span className="font-black uppercase tracking-widest text-[10px] text-white">Upload File</span>
        </button>
      </div>

      {/* Recent Projects List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs">Recent Projects</h3>
          <span className="text-[10px] text-slate-500 font-bold uppercase">{history.length} Saved</span>
        </div>

        {history.length === 0 ? (
          <div className="bg-[#1a1c1e]/30 border-2 border-dashed border-white/5 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className="text-slate-500 text-sm font-medium">No project telemetry archives detected.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((scan) => (
              <div 
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className="bg-[#1a1c1e] p-4 rounded-3xl border border-white/5 shadow-lg hover:border-[#00d4ff]/20 transition-all cursor-pointer flex items-center space-x-4 group relative"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10">
                  <img src={scan.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="Scan" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-black text-white truncate text-sm">
                      {scan.data.headers[0] || 'Unlabeled'} Project
                    </p>
                    <span className="px-2 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff] text-[8px] font-black rounded-md uppercase">
                      {scan.tag || 'Physics TP 4'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                    Acquired: {new Date(scan.timestamp).toLocaleDateString()} • {scan.data.rows.length} Points
                  </p>
                </div>
                <div className="text-slate-700 group-hover:text-[#00d4ff] transition-colors pr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
