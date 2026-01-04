
import React, { useState } from 'react';
import { TableData } from '../types';

interface ExportHubProps {
  data: TableData;
}

const ExportHub: React.FC<ExportHubProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const generateCSV = () => {
    const headerRow = data.headers.join(',');
    const rows = data.rows.map(row => 
      data.headers.map(h => `"${row[h] || ""}"`).join(',')
    );
    return [headerRow, ...rows].join('\n');
  };

  const generatePython = () => {
    const columns = data.headers.map(h => h.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase());
    let snippet = `# Digitized Lab Telemetry - NumPy Ready\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n`;
    
    data.headers.forEach((h, i) => {
      const varName = columns[i];
      const values = data.rows.map(row => {
        const val = parseFloat(String(row[h]));
        return isNaN(val) ? 'np.nan' : val;
      });
      snippet += `${varName} = np.array([${values.join(', ')}])\n`;
    });

    if (columns.length >= 2) {
      snippet += `\n# Signal Plotting\nplt.figure(figsize=(10, 6))\nplt.plot(${columns[0]}, ${columns[1]}, 'o-', label='${data.headers[1]}')\nplt.grid(True)\nplt.legend()\nplt.show()`;
    }
    return snippet;
  };

  const downloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry_export_${Date.now()}.csv`;
    a.click();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatePython());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">Output Stage</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Select Protocol for Data Transmission</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button 
          onClick={downloadCSV}
          className="p-8 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xl flex flex-col items-center justify-center space-y-4 hover:bg-emerald-700 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.2)] active:scale-95 group"
        >
          <div className="p-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </div>
          <span>Download .CSV</span>
        </button>

        <button 
          onClick={copyCode}
          className={`p-8 rounded-[2.5rem] font-black text-xl flex flex-col items-center justify-center space-y-4 transition-all shadow-2xl active:scale-95 group
            ${copied ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-white text-[#121417] hover:bg-slate-100'}`}
        >
          <div className="p-4 bg-black/5 rounded-full group-hover:scale-110 transition-transform">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          </div>
          <span>{copied ? 'Copied!' : 'Copy Python'}</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Code Preview (NumPy)</h3>
          <span className="text-[8px] text-[#00d4ff] font-bold uppercase">Python 3.x Optimized</span>
        </div>
        <div className="bg-black/60 rounded-[3rem] p-8 border border-white/5 shadow-inner overflow-hidden">
          <pre className="text-[11px] text-[#00d4ff] mono leading-relaxed font-bold whitespace-pre-wrap">
            {generatePython()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExportHub;
