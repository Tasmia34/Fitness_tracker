import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/Appcontext';
import { User as Play } from 'lucide-react';

interface CycleTrackerCardProps {
  selectedDate?: Date; 
}

const CycleTrackerCard = ({ selectedDate }: CycleTrackerCardProps) => {
  const { user, setUser } = useAppContext();
  const today = selectedDate || new Date(); 

  // Access dynamic values from context
  const shouldShowTracker = user?.useMenstrualTracker === true;
  const avgCycleLength = user?.avgCycleLength || 28; 
  const avgBleedingDays = user?.avgBleedingDays || 5; 
  const contextLastStart = user?.lastPeriodStart || new Date().toISOString().split('T')[0];

  const [lastStart, setLastStart] = useState(contextLastStart);

  // Sync state if context changes
  useEffect(() => {
    if (user?.lastPeriodStart) {
      setLastStart(user.lastPeriodStart);
    }
  }, [user?.lastPeriodStart]);

  const calculateCycleData = (startStr: string, length: number, focusDate: Date) => {
    const start = new Date(startStr);
    start.setHours(0, 0, 0, 0);
    const referenceDate = new Date(focusDate);
    referenceDate.setHours(0, 0, 0, 0);

    const diffFromStart = referenceDate.getTime() - start.getTime();
    let currentDay = Math.floor(diffFromStart / (1000 * 60 * 60 * 24)) + 1;

    // Normalize day within cycle
    if (currentDay > length) {
      currentDay = ((currentDay - 1) % length) + 1;
    } else if (currentDay <= 0) {
      currentDay = length + (currentDay % length);
    }

    const nextPeriod = new Date(start);
    nextPeriod.setDate(start.getDate() + length);
    const daysRemaining = Math.ceil((nextPeriod.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const progressPercent = Math.min(Math.max(((currentDay - 1) / length) * 100, 0), 100);
    return { daysRemaining, progressPercent, currentDay };
  };

  const { daysRemaining, progressPercent, currentDay } = calculateCycleData(lastStart, avgCycleLength, today);

  const handlePeriodStarted = () => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const previousStart = new Date(lastStart);
    const currentStart = new Date(todayStr);
    const diffTime = currentStart.getTime() - previousStart.getTime();
    const dynamicDuration = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    const newHistoryEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      startDate: lastStart,
      endDate: todayStr,
      durationInDays: dynamicDuration
    };

    const updatedUser = {
      ...user,
      lastPeriodStart: todayStr,
      cycleHistory: [...(user.cycleHistory || []), newHistoryEntry]
    };

    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    setLastStart(todayStr);
    alert(`New cycle recorded! Previous cycle: ${dynamicDuration} days.`);
  };

  const getPhaseName = (day: number) => {
    if (day >= 1 && day <= avgBleedingDays) return "Menstrual Phase";
    if (day >= avgBleedingDays + 1 && day <= 13) return "Follicular Phase";
    if (day === 14) return "Ovulation Day";
    if (day >= 15 && day <= 28) return day >= 26 ? "Pre-Menstrual" : "Luteal Phase";
    return "Cycle Phase Active";
  };

  const syncWeekData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    const dayMetrics = calculateCycleData(lastStart, avgCycleLength, d);
    return {
      label: ['S','M','T','W','T','F','S'][d.getDay()],
      dateNumber: d.getDate(),
      isFocusedDay: d.toDateString() === today.toDateString(),
      isBleedingDay: dayMetrics.currentDay >= 1 && dayMetrics.currentDay <= avgBleedingDays
    };
  });

  if (!shouldShowTracker) return null;

  return (
    <div className="w-full"> 
      <div className="bg-[#FFF9F3] dark:bg-slate-900 p-6 md:p-8 rounded-[40px] shadow-sm border border-orange-50 dark:border-slate-800 flex flex-col items-center">
        <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-1 rounded-full text-[11px] font-bold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          {getPhaseName(currentDay)}
        </div>

        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" className="stroke-rose-100 dark:stroke-slate-800 fill-none" strokeWidth="12" />
            <circle cx="96" cy="96" r="80" className="transition-all duration-1000 ease-out stroke-rose-400/80 fill-none" strokeWidth="12" strokeDasharray={502.4} strokeDashoffset={502.4 - (progressPercent / 100) * 502.4} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Next period in</p>
            <h2 className="my-1 text-2xl font-black text-slate-800 dark:text-white">
              {daysRemaining > 0 ? `${daysRemaining} Days` : "Period Due"}
            </h2>
            <p className="text-rose-400 text-[10px] font-bold mb-3">Day {currentDay} of {avgCycleLength}</p>
            <button onClick={handlePeriodStarted} className="bg-rose-200 dark:bg-rose-900/30 text-white px-2 py-1 rounded-full text-[10px] font-semibold hover:bg-rose-400 flex items-center gap-1">
              <Play size={10} fill="currentColor" /> Period Started?
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 mt-8 w-full justify-between">
          {syncWeekData.map((day, i) => (
            <div key={i} className={`flex-1 min-w-9 h-14 rounded-2xl border flex flex-col items-center justify-center ${day.isFocusedDay ? "bg-slate-900 text-white" : day.isBleedingDay ? "bg-rose-50 text-rose-400" : "bg-white text-slate-400"}`}>
              <span className="text-[10px] font-bold opacity-70">{day.label}</span>
              <span className="text-xs font-black">{day.dateNumber}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CycleTrackerCard;