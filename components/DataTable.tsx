
import React, { useState } from 'react';
import { TableData, DataRow } from '../types';

interface DataTableProps {
  data: TableData;
  onChange: (newData: TableData) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onChange }) => {
  const [modifiedCells, setModifiedCells] = useState<Set<string>>(new Set());

  const updateCell = (rowIndex: number, header: string, value: string) => {
    const newRows = [...data.rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [header]: value };
    
    const cellId = `${rowIndex}-${header}`;
    setModifiedCells(prev => new Set(prev).add(cellId));
    
    onChange({ ...data, rows: newRows });
  };

  const updateHeader = (index: number, value: string) => {
    const oldHeader = data.headers[index];
    const newHeaders = [...data.headers];
    newHeaders[index] = value;
    
    const newRows = data.rows.map(row => {
      const newRow = { ...row };
      newRow[value] = newRow[oldHeader];
      delete newRow[oldHeader];
      return newRow;
    });

    onChange({ headers: newHeaders, rows: newRows });
  };

  const addRow = () => {
    const newRow: DataRow = {};
    data.headers.forEach(h => newRow[h] = "");
    onChange({ ...data, rows: [...data.rows, newRow] });
  };

  const removeRow = (index: number) => {
    const newRows = data.rows.filter((_, i) => i !== index);
    onChange({ ...data, rows: newRows });
  };

  const removeColumn = (index: number) => {
    const headerToRemove = data.headers[index];
    const newHeaders = data.headers.filter((_, i) => i !== index);
    const newRows = data.rows.map(row => {
      const newRow = { ...row };
      delete newRow[headerToRemove];
      return newRow;
    });
    onChange({ headers: newHeaders, rows: newRows });
  };

  return (
    <div className="bg-[#1a1c1e] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto h-full max-h-[500px]">
        <table className="w-full text-left border-collapse min-w-full mono relative">
          <thead className="sticky top-0 z-20 bg-[#1a1c1e] shadow-md">
            <tr className="border-b border-white/10">
              <th className="p-4 w-12 bg-[#1a1c1e]"></th>
              {data.headers.map((header, i) => (
                <th key={i} className="p-4 min-w-[140px] group relative border-l border-white/5 first:border-l-0 bg-[#1a1c1e]">
                  <div className="flex flex-col">
                    <input
                      className="bg-transparent font-black text-[#00d4ff] outline-none focus:text-white w-full text-sm uppercase tracking-wider"
                      value={header}
                      onChange={(e) => updateHeader(i, e.target.value)}
                    />
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-1">Variable</span>
                  </div>
                  <button 
                    onClick={() => removeColumn(i)}
                    className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group hover:bg-white/[0.01] transition-colors">
                <td className="p-4 text-center">
                  <button 
                    onClick={() => removeRow(rowIndex)}
                    className="text-slate-700 hover:text-[#ff6b00] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
                {data.headers.map((header, colIndex) => {
                  const isModified = modifiedCells.has(`${rowIndex}-${header}`);
                  return (
                    <td key={colIndex} className="p-1 border-l border-white/5 first:border-l-0">
                      <input
                        className={`w-full px-4 py-3 bg-transparent outline-none transition-all text-white font-medium text-sm text-center border-b-2 border-transparent focus:border-[#00d4ff]/40
                          ${isModified ? 'bg-[#00d4ff]/5 shadow-[inset_0_0_10px_rgba(0,212,255,0.1)] text-[#00d4ff]' : ''}`}
                        value={row[header] ?? ""}
                        onChange={(e) => updateCell(rowIndex, header, e.target.value)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        onClick={addRow}
        className="w-full p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-[#00d4ff] border-t border-white/5 flex items-center justify-center space-x-3 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
        <span>Append Sample Row</span>
      </button>
    </div>
  );
};

export default DataTable;
