import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface MonthlyTrendsProps {
  entries: any[];
}

const COLORS = {
  weight: "#10b981",
  sugar: "#f87171",
  systolic: "#f87171",
  diastolic: "#4286eb",
};

const MonthlyTrends = ({ entries }: MonthlyTrendsProps) => {
  // Keeping state internal to the component for cleaner Dashboard code
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [activeMetric, setActiveMetric] = useState<"weight" | "sugar" | "bp">(
    "weight",
  );

  const trendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return entries
      .filter((e) => {
        const parts = e.date.split("/");
        const month = parseInt(parts[0]) - 1;
        const year = parseInt(parts[2]);
        return month === selectedMonth && year === currentYear;
      })
      .sort((a, b) => {
        const d1 = a.date.split("/");
        const d2 = b.date.split("/");
        return (
          new Date(
            parseInt(d1[2]),
            parseInt(d1[0]) - 1,
            parseInt(d1[1]),
          ).getTime() -
          new Date(
            parseInt(d2[2]),
            parseInt(d2[0]) - 1,
            parseInt(d2[1]),
          ).getTime()
        );
      })
      .map((e) => ({
        day: parseInt(e.date.split("/")[1]),
        weight: parseFloat(e.weight) || 0,
        sugar: parseFloat(e.sugar) || 0,
        systolic: parseFloat(e.bpSystolic) || 0,
        diastolic: parseFloat(e.bpDiastolic) || 0,
      }));
  }, [entries, selectedMonth]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mt-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-lg font-bold dark:text-white">
            Monthly Analytics
          </h3>
          <p className="text-sm text-slate-500">
            Viewing {activeMetric} for{" "}
            {new Date(0, selectedMonth).toLocaleString("default", {
              month: "long",
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* METRIC TOGGLES */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(["weight", "sugar", "bp"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeMetric === m
                    ? "bg-white dark:bg-slate-700 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* MONTH SELECTOR */}
          <select
            className="bg-slate-100 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold rounded-xl px-3 py-2 border-none outline-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "short" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="h-72 w-full">
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid
                vertical={false}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                opacity={0.8}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip
                labelFormatter={(day) => `Day ${day}`}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              {activeMetric === "bp" ? (
                <>
                
                  {/* Systolic Line */}
                  <Line
                    type="linear"
                    dataKey="systolic"
                    name="Systolic"
                    stroke={COLORS.systolic}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 5 }}
                  />
                  {/* Diastolic Line */}
                  <Line
                    type="linear"
                    dataKey="diastolic"
                    name="Diastolic"
                    stroke={COLORS.diastolic}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 5 }}
                  />
                </>
              ) : (
                <Line
                  type="linear"
                  dataKey={activeMetric}
                  stroke={COLORS[activeMetric]}
                  strokeWidth={2}
                  dot={{ r: 5 }}
                />
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
  );
};

export default MonthlyTrends;
