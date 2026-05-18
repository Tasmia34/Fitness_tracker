import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/Appcontext';
import { User as UserIcon, Upload, Calendar, Ruler, Save, Play } from 'lucide-react';

interface CycleTrackerCardProps {
  selectedDate?: Date; 
}

const CycleTrackerCard = ({ selectedDate }: CycleTrackerCardProps) => {
  const { user, setUser } = useAppContext();
  const today = selectedDate || new Date(); 

  const gender = user?.gender?.toLowerCase() || '';
  const avgCycleLength = user?.avgCycleLength || 28; 
  const defaultLastStart = user?.lastPeriodStart || new Date().toISOString().split('T')[0];

  const [lastStart, setLastStart] = useState(defaultLastStart);

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

    const nextPeriod = new Date(start);
    nextPeriod.setDate(start.getDate() + length);

    const diffTime = nextPeriod.getTime() - referenceDate.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const diffFromStart = referenceDate.getTime() - start.getTime();
    let currentDay = Math.floor(diffFromStart / (1000 * 60 * 60 * 24)) + 1;

    if (currentDay > length) {
      currentDay = ((currentDay - 1) % length) + 1;
    } else if (currentDay <= 0) {
      currentDay = length + (currentDay % length);
    }

    const progressPercent = Math.min(Math.max(((currentDay - 1) / length) * 100, 0), 100);
    return { daysRemaining, progressPercent, currentDay };
  };

  const { daysRemaining, progressPercent, currentDay } = calculateCycleData(lastStart, avgCycleLength, today);

  // 🌟 NEW ENGINE: Close out the old cycle, calculate final duration, and begin a new one
  const handlePeriodStarted = () => {
    if (!user) return;

    const todayStr = new Date().toISOString().split('T')[0];
    
    // Calculate precise duration of the cycle that is ending right now
    const previousStart = new Date(lastStart);
    const currentStart = new Date(todayStr);
    const diffTime = currentStart.getTime() - previousStart.getTime();
    const dynamicDuration = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    // Generate history object package
    const newHistoryEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      startDate: lastStart,
      endDate: todayStr,
      durationInDays: dynamicDuration
    };

    const updatedHistory = [...(user.cycleHistory || []), newHistoryEntry];

    const updatedUser = {
      ...user,
      lastPeriodStart: todayStr,
      cycleHistory: updatedHistory
    };

    // Save synchronously to App State Context & LocalStorage Baseline
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    setLastStart(todayStr);
    
    alert(`🎉 New cycle recorded! Previous cycle duration: ${dynamicDuration} days.`);
  };

  const getPhaseName = (day: number) => {
    if (day >= 1 && day <= 5) return "Menstrual Phase";
    if (day >= 6 && day <= 13) return "Follicular Phase";
    if (day === 14) return "Ovulation Day";
    if (day >= 15 && day <= 28) {
      return day >= 26 ? "Pre-Menstrual" : "Luteal Phase";
    }
    return "Cycle Phase Active";
  };

  const generateWeekDays = () => {
    const daysOfWeekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weekStart = new Date(today); 
    weekStart.setDate(today.getDate() - today.getDay());

    return Array.from({ length: 7 }).map((_, i) => {
      const currentCalendarDay = new Date(weekStart);
      currentCalendarDay.setDate(weekStart.getDate() + i);
      const isFocusedDay = currentCalendarDay.toDateString() === today.toDateString();
      const dayMetrics = calculateCycleData(lastStart, avgCycleLength, currentCalendarDay);
      const isBleedingDay = dayMetrics.currentDay >= 1 && dayMetrics.currentDay <= 5;

      return {
        label: daysOfWeekLabels[currentCalendarDay.getDay()],
        dateNumber: currentCalendarDay.getDate(),
        isFocusedDay,
        isBleedingDay
      };
    });
  };
  const syncWeekData = generateWeekDays();

  if (gender !== 'female') return null;

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
            <circle
              cx="96" cy="96" r="80"
              className="transition-all duration-1000 ease-out stroke-rose-400/80 fill-none"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={502.4} 
              strokeDashoffset={502.4 - (progressPercent / 100) * 502.4}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Next period in</p>
            <h2 className="my-1 text-2xl font-black tracking-tight text-slate-800 dark:text-white">
              {daysRemaining > 0 ? `${daysRemaining} Days` : "Period Due"}
            </h2>
            <p className="text-rose-400 text-[10px] font-bold mb-3">Day {currentDay} of {avgCycleLength}</p>
            
            {/* 🌟 UPGRADED BUTTON ACTION */}
            <button 
              type="button"
              onClick={handlePeriodStarted}
              className="bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-400/80 hover:text-white text-white px-1 py-1 rounded-full text-[10px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Play size={10} fill="currentColor" />
              Period Started?
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 mt-8 w-full justify-between">
          {syncWeekData.map((day, i) => {
            let columnStyle = "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500";
            let activeDotStyle = "bg-slate-200 dark:bg-slate-700";

            if (day.isBleedingDay) {
              columnStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40 text-rose-400 dark:text-rose-400";
              activeDotStyle = "bg-rose-400";
            }
            if (day.isFocusedDay) {
              columnStyle = "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100 scale-105 shadow-md shadow-black/10";
              activeDotStyle = "bg-rose-500 dark:bg-rose-500";
            }

            return (
              <div key={i} className={`flex-1 min-w-9 h-14 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${columnStyle}`}>
                <span className="text-[10px] font-bold tracking-tight opacity-70">{day.label}</span>
                <span className="text-xs font-black leading-none">{day.dateNumber}</span>
                <div className={`w-1 h-1 rounded-full ${activeDotStyle}`} />
              </div>
            );
          })}
        </div>

        <div className="w-full pt-4 mt-6 text-center border-t border-slate-100 dark:border-slate-800/60">
          <input 
            type="date" 
            className="text-[10px] p-1.5 border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
            value={lastStart}
            onChange={(e) => setLastStart(e.target.value)} 
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Simulate Base Cycle Start Date</p>
        </div>

      </div>
    </div>
  );
};

export default CycleTrackerCard;