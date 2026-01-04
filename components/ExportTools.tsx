
import React, { useState } from 'react';
import { TableData } from '../types';

interface ExportToolsProps {
  data: TableData;
}

const ExportTools: React.FC<ExportToolsProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const generateCSV = () => {
    const headerRow = data.headers.join(',');
    const rows = data.rows.map(row => 
      data.headers.map(h => `"${row[h] || ""}"`).join(',')
    );
    return [headerRow, ...rows].join('\n');
  };

  const generatePython = () => {
    const columns = data.headers.map(h => `'${h}'`).join(', ');
    const rowList = data.rows.map(row => 
      `[${data.headers.map(h => isNaN(parseFloat(String(row[h]))) ? `'${row[h]}'` : row[h]).join(', ')}]`
    ).join(',\n    ');

    return `import pandas as pd
import matplotlib.pyplot as plt

# Digitized lab data
columns = [${columns}]
data = [
    ${rowList}
]

df = pd.DataFrame(data, columns=columns)
print(df.describe())

# Plotting
df.plot(x=columns[0], y=columns[1:], marker='o')
plt.grid(True)
plt.show()`;
  };

  const downloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const copyPython = () => {
    navigator.clipboard.writeText(generatePython());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Spreadsheet Ready</span>
            </h3>
            <p className="text-sm text-slate-500">Perfect for Excel, Google Sheets, or Regressi (Standard CSV format).</p>
            <button 
                onClick={downloadCSV}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
            >
                Download CSV
            </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    <span>Python Snippet</span>
                </h3>
                <button 
                    onClick={copyPython}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                <pre className="text-[11px] text-blue-300 mono leading-relaxed">
                    {generatePython()}
                </pre>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExportTools;
