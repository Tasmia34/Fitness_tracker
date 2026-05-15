import { MOCK_USER_DATA } from '../utils/mockData';
import { useState } from 'react';

const CycleTrackerCard = () => {
  // 1. Move the start date into state so we can update it live
  const [lastStart, setLastStart] = useState(MOCK_USER_DATA.lastPeriodStart);
  const { gender, avgCycleLength } = MOCK_USER_DATA;

  // 2. Logic to calculate real-time data based on the state variable
  const calculateCycleData = (startStr: string, length: number) => {
    const today = new Date();
    const start = new Date(startStr);
    
    const nextPeriod = new Date(start);
    nextPeriod.setDate(start.getDate() + length);

    const diffTime = nextPeriod.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const diffFromStart = today.getTime() - start.getTime();
    const currentDay = Math.floor(diffFromStart / (1000 * 60 * 60 * 24)) + 1;

    const progressPercent = Math.min(Math.max(((currentDay - 1) / length) * 100, 0), 100);

    return { daysRemaining, progressPercent, currentDay };
  };

  const { daysRemaining, progressPercent, currentDay } = calculateCycleData(lastStart, avgCycleLength);

  // 3. Reset Handler: When button is clicked, set today as the new start date
  const handlePeriodEnded = () => {
    const todayStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    setLastStart(todayStr);
  };

  const getPhaseName = (day: number) => {
    if (day >= 1 && day <= 5) return "Menstrual Phase";
    if (day >= 6 && day <= 13) return "Follicular Phase";
    if (day === 14) return "Ovulation Day";
    if (day >= 15 && day <= 28) {
      return day >= 26 ? "Pre-Menstrual" : "Luteal Phase";
    }
    return "Cycle Restarting";
  };

  if (gender !== 'female') return null;

  return (
    <div className="w-full"> 
      <div className="bg-[#FFF9F3] dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-orange-50 dark:border-slate-800 flex flex-col items-center">
        
        <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-1 rounded-full text-[11px] font-bold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          {getPhaseName(currentDay)}
        </div>

        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96" cy="96" r="80"
              className="stroke-rose-100 dark:stroke-slate-800 fill-none"
              strokeWidth="12"
            />
            <circle
              cx="96" cy="96" r="80"
              className="stroke-rose-500/50 fill-none transition-all duration-1000 ease-out"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={502.4} 
              strokeDashoffset={502.4 - (progressPercent / 100) * 502.4}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Next period in</p>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white my-1">
              {daysRemaining > 0 ? daysRemaining : 0} Days
            </h2>
            <p className="text-rose-400 text-[10px] font-bold mb-2">Day {currentDay} of {avgCycleLength}</p>
            
            {/* Added onClick event to trigger the reset logic */}
            <button 
              onClick={handlePeriodEnded}
              className="bg-[#357ae7] hover:bg-blue-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors shadow-sm active:scale-95 cursor-pointer"
            >
              Period ended?
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          {['M','T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className={`w-8 h-12 rounded-full border flex flex-col items-center justify-center gap-1 ${i === 4 ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-black' : 'bg-white dark:bg-slate-800 border-rose-50 dark:border-slate-700 text-rose-300'}`}>
              <span className="text-[10px] font-bold">{day}</span>
              <div className={`w-1 h-1 rounded-full ${i === 4 ? 'bg-white dark:bg-black' : 'bg-rose-200'}`} />
            </div>
          ))}

        </div>
        {/**Date for testing */}
<div className="mt-4">
  <input 
    type="date" 
    className="text-[10px] p-1 border rounded bg-white"
    onChange={(e) => setLastStart(e.target.value)} 
  />
  <p className="text-[13px] text-slate-400 mt-1">Testing</p>
</div>


      </div>
    </div>
  );
};

export default CycleTrackerCard;