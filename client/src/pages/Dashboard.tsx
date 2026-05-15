import { useState, useEffect, useMemo } from 'react';
import CustomCalendar from './CustomCalendar';
import { Activity, Scale, Droplets } from 'lucide-react';
import { HealthReportChart} from './HealthCharts';
import { useAppContext } from '../context/Appcontext'; 
import MonthlyTrends from './MothlyTrends';

import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend 
} from 'recharts';

interface HealthEntry {
  id: number;
  date: string;
  weight: string;
  sugar: string;
  bpSystolic: string;
  bpDiastolic: string;
  bmi: string; // This is the old string from the log, we will calculate a fresh one
}

const Dashboard = () => {
  const { user } = useAppContext();
  const [lastEntry, setLastEntry] = useState<HealthEntry | null>(null);
  const [calculatedBmi, setCalculatedBmi] = useState<string>('--.-');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<'bar' | 'line'>('bar');
  const [chartData, setChartData] = useState<any[]>([]);
  
  // for calendar
  const [entries, setEntries] = useState<HealthEntry[]>([]);

  const userHeightCm = user?.height || 164;



 useEffect(() => {
  const savedEntries = localStorage.getItem('health_logs');
  if (savedEntries) {
    const parsed: HealthEntry[] = JSON.parse(savedEntries);
    
    // Set the full list so the calendar can see which days have dots
    setEntries(parsed);
    // 1. Format the calendar's selectedDate to match your log format (e.g., "M/D/YYYY")
    const formattedSelectedDate = selectedDate.toLocaleDateString();

    // 2. Find the entry for the selected date
    const dayEntry = parsed.find(entry => entry.date === formattedSelectedDate);

    // 3. Update the "Last Entry" state (which the cards use) to the found entry
    // If no entry exists for that day, we set it to null so the UI shows "--"
    setLastEntry(dayEntry || null);




    // 4. Prepare Chart Data (We keep this showing the last 7 entries for context)
    const formattedChart = parsed.slice(0, 7).map((entry) => ({
      date: entry.date.split('/')[0] + '/' + entry.date.split('/')[1],
      weight: parseFloat(entry.weight),
      sugar: parseFloat(entry.sugar),
      systolic: parseFloat(entry.bpSystolic),
    })).reverse();
    
    setChartData(formattedChart);

    // 5. Update BMI based on the selected day's entry (if it exists)
    if (dayEntry) {
      const weight = parseFloat(dayEntry.weight);
      if (weight > 0 && userHeightCm > 0) {
        const heightInMeters = userHeightCm / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);
        setCalculatedBmi(bmiValue.toFixed(1));
      }
    } else {
      setCalculatedBmi('--.-'); // Reset if no data for selected day
    }
  }
}, [selectedDate, userHeightCm]); // Added selectedDate as a dependency

const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
const [activeMetric, setActiveMetric] = useState<'weight' | 'sugar' | 'bp'>('weight');
const trendData = useMemo(() => {
  const currentYear = new Date().getFullYear();
  
  const data = entries
    .filter(e => {
      // Split the saved string (M/D/YYYY) to ensure accurate parsing
      const parts = e.date.split('/');
      if (parts.length !== 3) return false;
      
      // Note: This logic assumes your locale is M/D/YYYY. 
      // If your locale is D/M/YYYY, swap parts[0] and parts[1]
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
    .map(e => {
      const day = parseInt(e.date.split('/')[1]);
      return {
        day: day,
        weight: parseFloat(e.weight) || 0,
        sugar: parseFloat(e.sugar) || 0,
        systolic: parseFloat(e.bpSystolic) || 0,
        diastolic: parseFloat(e.bpDiastolic) || 0,
      };
    });

  console.log("Chart Data for Month", selectedMonth, ":", data);
  return data;
}, [entries, selectedMonth]);

const COLORS = { weight: '#10b981', sugar: '#f87171', bp: '#3b82f6' };




  const getBmiStatus = (bmi: string) => {
  const val = parseFloat(bmi);
  if (isNaN(val)) return { label: 'No Data', color: 'text-slate-400' };

  if (val < 18.5) {
    return { label: 'Underweight', color: 'text-amber-500/50' };
  } else if (val >= 18.5 && val <= 24.9) {
    return { label: 'Healthy', color: 'text-emerald-500/50' };
  } else if (val >= 25 && val <= 29.9) {
    return { label: 'Overweight', color: 'text-orange-500/50' };
  } else {
    return { label: 'Obese', color: 'text-red-500/50' };
  }
};



  // This filters your logs to only show entries matching the calendar date
const filteredEntries = entries.filter(entry => 
  entry.date === selectedDate.toLocaleDateString()
);

// We also keep track if ANY data exists for this day to show the "No entry found" card
const hasEntryForSelectedDate = filteredEntries.length > 0;


const status = getBmiStatus(calculatedBmi);
  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* --- LEFT SIDE: METRICS OVERVIEW --- */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold dark:text-white mb-8">Health Overview</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           {/* BMI Card */}
<div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
  <div className="flex items-center gap-4 mb-4">
    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
      <Activity size={24} />
    </div>
    <h3 className="font-semibold dark:text-slate-200">Calculated BMI</h3>
  </div>
  
  <div className="flex items-baseline gap-3">
    <p className="text-4xl font-bold text-blue-600 mb-1">
      {calculatedBmi}
    </p>
    {/* BMI Status Label with Dynamic Color */}
    <p className={`text-sm font-bold uppercase tracking-wider ${status.color}`}>
      {status.label}
    </p>
  </div>
  
  <p className="text-sm text-slate-500 mt-2">
    Height: {userHeightCm}cm | Weight: {lastEntry?.weight || '--'}kg
  </p>
</div>

            {/* Weight Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600">
                 <Scale size={24} />
    </div>
    <h3 className="font-semibold dark:text-slate-200">Weight on Selected Day</h3>
  </div>
  <p className="text-4xl font-bold text-emerald-600 mb-1">
    {lastEntry?.weight ? `${lastEntry.weight} kg` : '--'}
  </p>
  <div>
  <p className="text-sm text-slate-500 mt-2">
    {lastEntry ? `Record for ${lastEntry.date}` : `No data for ${selectedDate.toLocaleDateString()}`}
  </p>
  </div>
</div>
            
            {/* Sugar & BP Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 sm:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600/60">
                  <Droplets size={24} />
                </div>
                <h3 className="font-semibold dark:text-slate-200">Blood Glucose & Pressure</h3>
              
              </div>
              
              <div className="flex justify-around py-2">
                 <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sugar</p>
                    <p className="text-2xl font-bold dark:text-white">{lastEntry?.sugar || '--'}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">BP (Sys/Dia)</p>
                    <p className="text-2xl font-bold dark:text-white">
                      {lastEntry ? `${lastEntry.bpSystolic}/${lastEntry.bpDiastolic}` : '--/--'}
                    </p>
                 </div>
              </div>
              
            </div>
          </div>


{/* Main Large Chart in the Sugar/BP section */}
<div className="mt-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold dark:text-slate-200">Weekly Health Report</h3>
    
    {/* Toggle Button and Weekly summary*/}
    <button 
      onClick={() => setViewType(viewType === 'bar' ? 'line' : 'bar')}
      className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 hover:text-blue-400 transition-all"
    >
      Show {viewType === 'bar' ? 'Line' : 'Bar'} View
    </button>
  </div>

  <HealthReportChart data={chartData} chartType={viewType} />
</div>

   {/* --- INTEGRATED MONTHLY TRENDS --- */}
<div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mt-12">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h3 className="text-lg font-bold dark:text-white">Monthly Analytics</h3>
      <p className="text-sm text-slate-500">
        Viewing {activeMetric} for {new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        {(['weight', 'sugar', 'bp'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setActiveMetric(m)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
              activeMetric === m ? 'bg-white dark:bg-slate-700 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <select 
        className="bg-slate-100 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold rounded-xl px-3 py-2 border-none outline-none"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="h-72 w-full">
    {trendData.length > 0 ? (
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
    ) : (
      <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 text-sm italic">
        No logs found for this month in {new Date().getFullYear()}.
      </div>
    )}
  </div>
</div>

    </div>



        {/* --- RIGHT SIDE: CALENDAR --- */}
        <div className="w-full md:w-87.5">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Calendar</h2>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <CustomCalendar value={selectedDate} onChange={setSelectedDate} entries={entries} />
            </div>
             <div className={`mt-4 p-4 rounded-2xl border transition-all duration-300 ${
  hasEntryForSelectedDate 
    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800" 
    : "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
}`}>
  <p className={`text-xs font-bold uppercase tracking-wider ${
    hasEntryForSelectedDate ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-500"
  }`}>
    {hasEntryForSelectedDate ? "Entry Found" : "No Entry Found"}
  </p>
  <p className={`text-lg font-bold ${
    hasEntryForSelectedDate ? "text-blue-800 dark:text-blue-200" : "text-amber-800 dark:text-amber-200"
  }`}>
    {selectedDate.toDateString()}
  </p>
</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;