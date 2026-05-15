import { 
 ResponsiveContainer, BarChart, Bar, 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HealthReportChart = ({ data, chartType }: { data: any[], chartType: 'bar' | 'line' }) => {

const commonElements = [
  <XAxis 
    key="xaxis" 
    dataKey="date" 
    axisLine={false} 
    tickLine={false} 
    tick={{fontSize: 10, fill: '#94a3b8'}} 
    dy={10} 
  />,
  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />,
  <Tooltip 
    key="tooltip"
    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
    // ADD THIS: labelFormatter customizes the header of the tooltip
    labelFormatter={(value) => `Date: ${value}`}
    // ADD THIS: formatter clarifies the unit for each bar/line
    formatter={(value: any, name: string) => {
      if (name === "sugar") return [`${value} mg/dL`, "Sugar Level"];
      if (name === "systolic") return [`${value} mmHg`, "Systolic BP"];
      return [value, name];
    }}
    contentStyle={{ 
      backgroundColor: '#0f172a', 
      border: 'none', 
      borderRadius: '12px',
      color: '#fff',
      fontSize: '12px'
    }} 
    itemStyle={{ padding: '2px 0' }}
  />
];

  if (chartType === 'line') {
    return (
      <div className="h-64 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20, right: 10 }}>
            {commonElements}
    
              <CartesianGrid key="grid" vertical={false} stroke="#94a3b8" strokeDasharray="3 3" />,
            
            <Line 
              type="linear" 
              dataKey="sugar" 
              stroke="#f87171" 
              strokeWidth={2} 
              dot={true} 
              activeDot={{ r: 5 }} 
            />
            <Line 
              type="linear" 
              dataKey="systolic" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={true} 
              activeDot={{ r: 5 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          {commonElements}
          <YAxis yAxisId="left" hide />
          <YAxis yAxisId="right" orientation="right" hide />
  
  
          <Bar yAxisId="left" dataKey="sugar" fill="#f87171" radius={[4, 4, 0, 0]} barSize={15} />
          <Bar yAxisId="right" dataKey="systolic" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};