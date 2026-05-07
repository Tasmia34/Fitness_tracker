import { useState, useEffect } from 'react';
import CustomCalendar from './CustomCalendar';
import { Activity, Scale, Droplets } from 'lucide-react';
import { HealthReportChart} from './HealthCharts';

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
  const [lastEntry, setLastEntry] = useState<HealthEntry | null>(null);
  const [calculatedBmi, setCalculatedBmi] = useState<string>('--.-');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<'bar' | 'line'>('bar');
  const [chartData, setChartData] = useState<any[]>([]);
  // Static height for now
  const userHeightCm = 146;

  useEffect(() => {
    const savedEntries = localStorage.getItem('health_logs');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      if (parsed.length > 0) {
        const latest = parsed[0];
        setLastEntry(latest);


        // Prepare data for Recharts (limit to last 7 entries for cleanliness)
      const formatted = parsed.slice(0, 7).map((entry: HealthEntry) => ({
        date: entry.date.split('/')[0] + '/' + entry.date.split('/')[1], // Short date
        weight: parseFloat(entry.weight),
        sugar: parseFloat(entry.sugar),
        systolic: parseFloat(entry.bpSystolic),
      })).reverse(); // Oldest to newest for the graph
      
      setChartData(formatted);
        // --- BMI CALCULATION LOGIC ---
        const weight = parseFloat(latest.weight);
        if (weight > 0 && userHeightCm > 0) {
          const heightInMeters = userHeightCm / 100;
          const bmiValue = weight / (heightInMeters * heightInMeters);
          setCalculatedBmi(bmiValue.toFixed(1)); // Rounds to 1 decimal place
        }
      }
    }
  }, []);


  const getBmiStatus = (bmi: string) => {
  const val = parseFloat(bmi);
  if (isNaN(val)) return { label: 'No Data', color: 'text-slate-400' };

  if (val < 18.5) {
    return { label: 'Underweight', color: 'text-amber-500/50' };
  } else if (val >= 18.5 && val <= 24.9) {
    return { label: 'Healthy Weight', color: 'text-emerald-500/50' };
  } else if (val >= 25 && val <= 29.9) {
    return { label: 'Overweight', color: 'text-orange-500/50' };
  } else {
    return { label: 'Obese', color: 'text-red-500/50' };
  }
};

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
                <h3 className="font-semibold dark:text-slate-200">Last Weight</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-600 mb-1">
                {lastEntry?.weight ? `${lastEntry.weight} kg` : '--'}
              </p>
              <p className="text-sm text-slate-500">Updated: {lastEntry?.date || 'No data'}</p>
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
    
    {/* Toggle Button */}
    <button 
      onClick={() => setViewType(viewType === 'bar' ? 'line' : 'bar')}
      className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 hover:text-blue-400 transition-all"
    >
      Show {viewType === 'bar' ? 'Line' : 'Bar'} View
    </button>
  </div>

  <HealthReportChart data={chartData} chartType={viewType} />
</div>

        </div>


        {/* --- RIGHT SIDE: CALENDAR --- */}
        <div className="w-full md:w-87.5">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Calendar</h2>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <CustomCalendar value={selectedDate} onChange={setSelectedDate} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;