import { useState, useEffect } from "react";
import CustomCalendar from "./CustomCalendar";

import { HealthReportChart } from "./HealthCharts";
import { useAppContext } from "../context/Appcontext";
import MonthlyTrends from "./MothlyTrends";
import { MetricCards } from "./MetricCards";

import { MOCK_USER_DATA } from '../utils/mockData';
import CycleTrackerCard from "./CycleTrackerCard";


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
  const { user } = useAppContext();
  const [lastEntry, setLastEntry] = useState<HealthEntry | null>(null);
  const [calculatedBmi, setCalculatedBmi] = useState<string>("--.-");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<"bar" | "line">("bar");
  const [chartData, setChartData] = useState<any[]>([]);

  // for calendar
  const [entries, setEntries] = useState<HealthEntry[]>([]);

  const userHeightCm = user?.height || 164;

  useEffect(() => {
    const savedEntries = localStorage.getItem("health_logs");
    if (savedEntries) {
      const parsed: HealthEntry[] = JSON.parse(savedEntries);

      // Set the full list so the calendar can see which days have dots
      setEntries(parsed);
      // 1. Format the calendar's selectedDate to match your log format (e.g., "M/D/YYYY")
      const formattedSelectedDate = selectedDate.toLocaleDateString();

      // 2. Find the entry for the selected date
      const dayEntry = parsed.find(
        (entry) => entry.date === formattedSelectedDate,
      );

      // 3. Update the "Last Entry" state (which the cards use) to the found entry
      // If no entry exists for that day, we set it to null so the UI shows "--"
      setLastEntry(dayEntry || null);

      // 4. Prepare Chart Data (We keep this showing the last 7 entries for context)
      const formattedChart = parsed
        .slice(0, 7)
        .map((entry) => ({
          date: entry.date.split("/")[0] + "/" + entry.date.split("/")[1],
          weight: parseFloat(entry.weight),
          sugar: parseFloat(entry.sugar),
          systolic: parseFloat(entry.bpSystolic),
        }))
        .reverse();

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
        setCalculatedBmi("--.-"); // Reset if no data for selected day
      }
    }
  }, [selectedDate, userHeightCm]); // Added selectedDate as a dependency

  // const [selectedMonth] = useState(new Date().getMonth());
  // const [activeMetric, setActiveMetric] = useState<"weight" | "sugar" | "bp">(
  //   "weight",
  // );
  // const trendData = useMemo(() => {
  //   const currentYear = new Date().getFullYear();

  //   const data = entries
  //     .filter((e) => {
  //       // Split the saved string (M/D/YYYY) to ensure accurate parsing
  //       const parts = e.date.split("/");
  //       if (parts.length !== 3) return false;

  //       // Note: This logic assumes your locale is M/D/YYYY.
  //       // If your locale is D/M/YYYY, swap parts[0] and parts[1]
  //       const month = parseInt(parts[0]) - 1;
  //       const year = parseInt(parts[2]);

  //       return month === selectedMonth && year === currentYear;
  //     })
  //     .sort((a, b) => {
  //       const d1 = a.date.split("/");
  //       const d2 = b.date.split("/");
  //       return (
  //         new Date(
  //           parseInt(d1[2]),
  //           parseInt(d1[0]) - 1,
  //           parseInt(d1[1]),
  //         ).getTime() -
  //         new Date(
  //           parseInt(d2[2]),
  //           parseInt(d2[0]) - 1,
  //           parseInt(d2[1]),
  //         ).getTime()
  //       );
  //     })
  //     .map((e) => {
  //       const day = parseInt(e.date.split("/")[1]);
  //       return {
  //         day: day,
  //         weight: parseFloat(e.weight) || 0,
  //         sugar: parseFloat(e.sugar) || 0,
  //         systolic: parseFloat(e.bpSystolic) || 0,
  //         diastolic: parseFloat(e.bpDiastolic) || 0,
  //       };
  //     });

  //   console.log("Chart Data for Month", selectedMonth, ":", data);
  //   return data;
  // }, [entries, selectedMonth]);

  

  const getBmiStatus = (bmi: string) => {
    const val = parseFloat(bmi);
    if (isNaN(val)) return { label: "No Data", color: "text-slate-400" };

    if (val < 18.5) {
      return { label: "Underweight", color: "text-amber-500/50" };
    } else if (val >= 18.5 && val <= 24.9) {
      return { label: "Healthy", color: "text-emerald-500/50" };
    } else if (val >= 25 && val <= 29.9) {
      return { label: "Overweight", color: "text-orange-500/50" };
    } else {
      return { label: "Obese", color: "text-red-500/50" };
    }
  };

  // This filters your logs to only show entries matching the calendar date
  const filteredEntries = entries.filter(
    (entry) => entry.date === selectedDate.toLocaleDateString(),
  );

  // We also keep track if ANY data exists for this day to show the "No entry found" card
  const hasEntryForSelectedDate = filteredEntries.length > 0;

  const status = getBmiStatus(calculatedBmi);

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col max-w-6xl gap-12 mx-auto md:flex-row">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <h1 className="mb-8 text-2xl font-bold dark:text-white">
            Health Overview
          </h1>

          <MetricCards
            lastEntry={lastEntry}
            calculatedBmi={calculatedBmi}
            status={status}
            userHeightCm={userHeightCm}
            selectedDate={selectedDate}
          />
          <div>
            
          </div>

          <div className="p-6 mt-6 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
            {/* Weekly Chart UI */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-slate-200">
                Weekly Health Report
              </h3>
              <button 
                onClick={() => setViewType(viewType === "bar" ? "line" : "bar")}
                className="px-3 py-2 mr-5 text-xs font-semibold border-none outline-none bg-slate-200/50 dark:bg-slate-800 dark:text-slate-300 text-slate-600 rounded-xl"
              >
                 {viewType === "bar" ? "Line" : "Bar"} View
              </button>
              
            </div>
            <HealthReportChart data={chartData} chartType={viewType} />
          </div>

          {/* Inside Dashboard.tsx */}
          <MonthlyTrends entries={entries} />
        </div>

        {/* --- RIGHT SIDE: CALENDAR --- */}
        <div className="w-full md:w-87.5">
          <div className="sticky top-6">
            <h2 className="mb-4 text-lg font-semibold dark:text-white">
              Calendar
            </h2>
            <div className="p-2 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
              <CustomCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                entries={entries}
              />
            </div>
            <div
              className={`mt-4 p-4 rounded-2xl border transition-all duration-300 ${
                hasEntryForSelectedDate
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                  : "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
              }`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  hasEntryForSelectedDate
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-amber-600 dark:text-amber-500"
                }`}
              >
                {hasEntryForSelectedDate ? "Entry Found" : "No Entry Found"}
              </p>
              <p
                className={`text-lg font-bold ${
                  hasEntryForSelectedDate
                    ? "text-blue-800 dark:text-blue-200"
                    : "text-amber-800 dark:text-amber-200"
                }`}
              >
                {selectedDate.toDateString()}
              </p>
            </div>
            <div className="mt-4">
                {/* 🚀 Place the new component here */}
        <CycleTrackerCard data={MOCK_USER_DATA} />
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
