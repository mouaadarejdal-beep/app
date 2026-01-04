
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TableData } from '../types';

interface ChartPreviewProps {
  data: TableData;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ data }) => {
  if (data.headers.length < 2 || data.rows.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-600 bg-black/20 rounded-[2rem] border border-dashed border-white/5 space-y-4">
        <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Numerical Telemetry</p>
      </div>
    );
  }

  const numericHeaders = data.headers.filter(h => {
    return data.rows.some(row => !isNaN(parseFloat(String(row[h]))));
  });

  if (numericHeaders.length < 2) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-[#ff6b00]/60 bg-black/20 rounded-[2rem] border border-dashed border-[#ff6b00]/10 space-y-4">
        <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <p className="text-[10px] font-black uppercase tracking-widest">Insufficient Coordinates for Vector Mapping</p>
      </div>
    );
  }

  const xKey = numericHeaders[0];
  const chartData = data.rows.map(row => {
    const formatted: any = { ...row };
    numericHeaders.forEach(h => {
        formatted[h] = parseFloat(String(row[h]));
    });
    return formatted;
  }).sort((a, b) => a[xKey] - b[xKey]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Signal Graphing</h3>
        <p className="text-[10px] font-bold text-[#00d4ff] mono">X-AXIS: {xKey}</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#ffffff0a" />
            <XAxis 
                dataKey={xKey} 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontWeight: 'bold' }}
            />
            <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#121417', 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(255,255,255,0.05)', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                fontFamily: 'JetBrains Mono'
              }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }} />
            {numericHeaders.slice(1).map((h, i) => (
              <Line 
                key={h} 
                type="monotone" 
                dataKey={h} 
                stroke={['#00d4ff', '#ff6b00', '#10b981', '#ef4444'][i % 4]} 
                strokeWidth={3}
                dot={{ r: 5, fill: '#121417', strokeWidth: 2, stroke: ['#00d4ff', '#ff6b00', '#10b981', '#ef4444'][i % 4] }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartPreview;
