import { useState, useEffect, useMemo } from "react";
import CustomCalendar from "./CustomCalendar";
import { HealthReportChart } from "./HealthCharts";
import { useAppContext } from "../context/Appcontext";
import MonthlyTrends from "./MothlyTrends";
import { MetricCards } from "./MetricCards";
import CycleTrackerCard from "./CycleTrackerCard";
import CycleHistoryChart from "./CycleHistoryChart";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Make sure to have lucide-react or change to basic strings

interface HealthEntry {
  id: number;
  date: string;
  weight: string;
  sugar: string;
  bpSystolic: string;
  bpDiastolic: string;
  bmi: string;
}

const Dashboard = () => {
  const { user } = useAppContext();
  const [lastEntry, setLastEntry] = useState<HealthEntry | null>(null);
  const [calculatedBmi, setCalculatedBmi] = useState<string>("--.-");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<"bar" | "line">("bar");
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  
  // Track which week of the month we are looking at (0 to 4)
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);

  const userHeightCm = user?.height || 164;

  // Sync state with local storage logs
  useEffect(() => {
    const savedEntries = localStorage.getItem("health_logs");
    if (savedEntries) {
      const parsed: HealthEntry[] = JSON.parse(savedEntries);
      setEntries(parsed);

      const formattedSelectedDate = selectedDate.toLocaleDateString();
      const dayEntry = parsed.find((entry) => entry.date === formattedSelectedDate);
      setLastEntry(dayEntry || null);

      if (dayEntry) {
        const weight = parseFloat(dayEntry.weight);
        if (weight > 0 && userHeightCm > 0) {
          const heightInMeters = userHeightCm / 100;
          const bmiValue = weight / (heightInMeters * heightInMeters);
          setCalculatedBmi(bmiValue.toFixed(1));
        }
      } else {
        setCalculatedBmi("--.-");
      }
    }
  }, [selectedDate, userHeightCm]);

  // Set the week view to match whatever day is picked on the calendar
  useEffect(() => {
    const dayOfMonth = selectedDate.getDate();
    const computedWeekIndex = Math.floor((dayOfMonth - 1) / 7);
    setCurrentWeekIndex(Math.min(computedWeekIndex, 4)); // Cap at index 4 (Week 5)
  }, [selectedDate]);

  // Break down the selected month into arrays of 7 days with custom X-axis formatting
  const weeklyChunks = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const weeks: any[][] = [[], [], [], [], []];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let day = 1; day <= daysInMonth; day++) {
      const targetDateObj = new Date(year, month, day);
      const formattedLogKey = targetDateObj.toLocaleDateString(); // Matches "M/D/YYYY"
      
      // Look for data log matching this day
      const loggedDay = entries.find(e => e.date === formattedLogKey);
      const weekdayLabel = weekdays[targetDateObj.getDay()];

      const chartPoint = {
        // X-axis displays day value + weekday string ("12 Mon")
        date: `${day} ${weekdayLabel}`, 
        sugar: loggedDay ? parseFloat(loggedDay.sugar) : 0,
        systolic: loggedDay ? parseFloat(loggedDay.bpSystolic) : 0,
        diastolic: loggedDay ? parseFloat(loggedDay.bpDiastolic) : 0,
        weight: loggedDay ? parseFloat(loggedDay.weight) : 0,
      };

      const weekAssignment = Math.floor((day - 1) / 7);
      if (weekAssignment < 5) {
        weeks[weekAssignment].push(chartPoint);
      } else {
        weeks[4].push(chartPoint); // Catch remaining days in 31-day cycles
      }
    }
    return weeks;
  }, [entries, selectedDate]);

  // Safely extract the active working dataset
  const activeChartData = useMemo(() => {
    return weeklyChunks[currentWeekIndex] || [];
  }, [weeklyChunks, currentWeekIndex]);

  const getBmiStatus = (bmi: string) => {
    const val = parseFloat(bmi);
    if (isNaN(val)) return { label: "No Data", color: "text-slate-400" };
    if (val < 18.5) return { label: "Underweight", color: "text-amber-500/50" };
    if (val >= 18.5 && val <= 24.9) return { label: "Healthy", color: "text-emerald-500/50" };
    if (val >= 25 && val <= 29.9) return { label: "Overweight", color: "text-orange-500/50" };
    return { label: "Obese", color: "text-red-500/50" };
  };

  const hasEntryForSelectedDate = entries.some(
    (entry) => entry.date === selectedDate.toLocaleDateString()
  );

  const status = getBmiStatus(calculatedBmi);

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col max-w-6xl gap-12 mx-auto md:flex-row">
        
        {/* LEFT PANEL CONTAINER */}
        <div className="flex-1">
          <h1 className="mb-8 text-2xl font-bold dark:text-white">Health Overview</h1>

          <MetricCards
            lastEntry={lastEntry}
            calculatedBmi={calculatedBmi}
            status={status}
            userHeightCm={userHeightCm}
            selectedDate={selectedDate}
          />
          
          <div className="p-6 mt-6 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold dark:text-slate-200">Weekly Health Report</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing {selectedDate.toLocaleString('default', { month: 'long' })}
                </p>
              </div>

              {/* PAGINATION AND VIEW TOGGLES */}
              <div className="flex items-center gap-3">
                {/* Left/Right Selector Buttons */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    disabled={currentWeekIndex === 0}
                    onClick={() => setCurrentWeekIndex(prev => prev - 1)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-700 dark:text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold px-2 dark:text-white min-w-[50px] text-center">
                    Week {currentWeekIndex + 1}
                  </span>
                  <button
                    disabled={currentWeekIndex === 4 || weeklyChunks[currentWeekIndex + 1]?.length === 0}
                    onClick={() => setCurrentWeekIndex(prev => prev + 1)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-700 dark:text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => setViewType(viewType === "bar" ? "line" : "bar")}
                  className="px-3 py-2 text-xs font-semibold transition-all bg-slate-100 dark:bg-slate-800 dark:text-slate-300 text-slate-600 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                >
                  {viewType === "bar" ? "Line" : "Bar"} View
                </button>
              </div>
            </div>

            {/* Render chart with computed slice data */}
            <HealthReportChart data={activeChartData} chartType={viewType} />
          </div>

          <MonthlyTrends entries={entries} />
          <CycleHistoryChart />
        </div>

        {/* RIGHT PANEL: CALENDAR */}
        <div className="w-full md:w-87.5">
          <div className="sticky top-6">
            <h2 className="mb-4 text-lg font-semibold dark:text-white">Calendar</h2>
            <div className="p-2 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
              <CustomCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                entries={entries}
              />
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
            <div className="mt-4">
              <CycleTrackerCard />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;