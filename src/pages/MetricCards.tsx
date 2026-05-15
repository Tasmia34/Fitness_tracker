import { Activity, Scale, Droplets } from 'lucide-react';

interface MetricCardsProps {
  lastEntry: any;
  calculatedBmi: string;
  status: { label: string; color: string };
  userHeightCm: number;
  selectedDate: Date;
}

export const MetricCards = ({ lastEntry, calculatedBmi, status, userHeightCm, selectedDate }: MetricCardsProps) => (
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
        <p className="text-4xl font-bold text-blue-600 mb-1">{calculatedBmi}</p>
        <p className={`text-sm font-bold uppercase tracking-wider ${status.color}`}>{status.label}</p>
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
      <p className="text-sm text-slate-500 mt-2">
        {lastEntry ? `Record for ${lastEntry.date}` : `No data for ${selectedDate.toLocaleDateString()}`}
      </p>
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
);