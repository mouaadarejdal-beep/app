
import React from 'react';
import { TableData } from '../types';
import DataTable from './DataTable';

interface WorkbenchProps {
  image: string;
  data: TableData;
  onChange: (newData: TableData) => void;
  onProceed: () => void;
}

const Workbench: React.FC<WorkbenchProps> = ({ image, data, onChange, onProceed }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[600px] animate-in fade-in duration-700">
      {/* Top/Left: Image Reference (Cropped Reference) */}
      <div className="lg:w-1/3 flex flex-col space-y-4">
        <div className="bg-[#1a1c1e] border border-white/5 rounded-[2.5rem] p-6 h-[40vh] lg:h-full flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Source Acquisition</h3>
            <span className="text-[8px] bg-[#ff6b00]/10 text-[#ff6b00] px-2 py-0.5 rounded font-black">TP 4-A</span>
          </div>
          
          <div className="flex-1 overflow-auto rounded-3xl bg-black/40 p-2 border border-white/5 flex items-start justify-center cursor-zoom-in">
            <img 
              src={image} 
              className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity" 
              alt="Lab Sheet Reference" 
            />
          </div>
          
          <p className="mt-4 text-[9px] text-slate-600 font-bold uppercase text-center tracking-widest">
            Cross-check Handwritten Inputs
          </p>
        </div>
      </div>

      {/* Bottom/Right: Spreadsheet Grid */}
      <div className="lg:w-2/3 flex flex-col space-y-6 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <DataTable data={data} onChange={onChange} />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="hidden sm:flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buffer Validated</span>
          </div>
          <button 
            onClick={onProceed}
            className="w-full sm:w-auto px-12 py-5 bg-[#00d4ff] text-[#121417] rounded-3xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(0,212,255,0.2)] flex items-center justify-center space-x-3 group"
          >
            <span>Finalize Sequence</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workbench;
