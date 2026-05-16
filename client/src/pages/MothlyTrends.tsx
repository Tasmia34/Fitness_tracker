import { useMemo } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid 
} from 'recharts';

interface HealthEntry {
  id: number;
  date: string;
  weight: string;
  sugar: string;
  bpSystolic: string;
  bpDiastolic: string;
}

interface MonthlyTrendsProps {
  entries: HealthEntry[];
  selectedMonth: number;
  activeMetric: 'weight' | 'sugar' | 'bp';
}

const COLORS = { weight: '#10b981', sugar: '#f87171', bp: '#3b82f6' };

const MonthlyTrends = ({ entries, selectedMonth, activeMetric }: MonthlyTrendsProps) => {
  const trendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    return entries
      .filter(e => {
        const parts = e.date.split('/');
        if (parts.length !== 3) return false;
        
        // Adjust indices if your locale is Day/Month/Year
        const month = parseInt(parts[0]) - 1; 
        const year = parseInt(parts[2]);
        return month === selectedMonth && year === currentYear;
      })
      .sort((a, b) => {
        const d1 = a.date.split('/');
        const d2 = b.date.split('/');
        return new Date(parseInt(d1[2]), parseInt(d1[0])-1, parseInt(d1[1])).getTime() - 
               new Date(parseInt(d2[2]), parseInt(d2[0])-1, parseInt(d2[1])).getTime();
      })
      .map(e => ({
        day: parseInt(e.date.split('/')[1]),
        weight: parseFloat(e.weight) || 0,
        sugar: parseFloat(e.sugar) || 0,
        systolic: parseFloat(e.bpSystolic) || 0,
        diastolic: parseFloat(e.bpDiastolic) || 0,
      }));
  }, [entries, selectedMonth]);

  if (trendData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 text-sm italic">
        No logs found for this month in {new Date().getFullYear()}.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData} margin={{ left: -20, right: 10 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" opacity={0.5} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip 
            labelFormatter={(day) => `Day ${day}`}
            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
          />
          {activeMetric === 'bp' ? (
            <>
              <Line type="monotone" dataKey="systolic" stroke={COLORS.bp} strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="diastolic" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" />
            </>
          ) : (
            <Line type="monotone" dataKey={activeMetric} stroke={COLORS[activeMetric]} strokeWidth={3} dot={{ r: 5 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrends;