import { 
  ResponsiveContainer, BarChart, Bar, 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HealthReportChart = ({ data, chartType }: { data: any[], chartType: 'bar' | 'line' }) => {
console.log("CHART DATA PROPS IS RECEIVING:", data);
  const commonElements = [
    <XAxis 
      key="xaxis" 
      dataKey="date" 
      axisLine={false} 
      tickLine={false} 
      tick={{ fontSize: 10, fill: '#94a3b8' }} 
      dy={10} 
      interval={0} 
    />,
    <Tooltip 
      key="tooltip"
      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
      labelFormatter={(value) => `Date: ${value}`}
      formatter={(value: any, name: string) => {
        if (name === "sugar") return [`${value} mg/dL`, "Sugar Level"];
        if (name === "systolic") return [`${value} mmHg`, "Systolic BP"];
        if (name === "diastolic") return [`${value} mmHg`, "Diastolic BP"];
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
      <div className="w-full h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20, right: 10 }}>
            {commonElements}
            {/* Single clean axis for line chart layout */}
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
            <CartesianGrid key="grid" vertical={false} stroke="#94a3b8" strokeDasharray="3 3" />
            
            {/* Red Line - Sugar */}
            <Line 
              type="linear" 
              dataKey="sugar" 
              stroke="#f87171" 
              strokeWidth={2} 
              dot={true} 
              activeDot={{ r: 5 }} 
            />
            {/* Blue Line - Systolic */}
            <Line 
              type="linear" 
              dataKey="systolic" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={true} 
              activeDot={{ r: 5 }} 
            />
            {/* Cyan Line - Diastolic */}
            <Line 
              type="linear" 
              dataKey="diastolic" 
              stroke="#06b6d4" 
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
    <div className="w-full h-64 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} margin={{ left: -20, right: 10 }}>
          {commonElements}
          {/* Explicit dual Y-axes without default un-id'd axis interference */}
          <YAxis yAxisId="left" hide />
          <YAxis yAxisId="right" orientation="right" hide />
  
          {/* Bar 1: Sugar Level (Left Axis) */}
          <Bar yAxisId="left" dataKey="sugar" fill="#f87171" radius={[4, 4, 0, 0]} barSize={12} />
          
          {/* Bar 2: Systolic Pressure (Right Axis) */}
          <Bar yAxisId="right" dataKey="systolic" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
          
          {/* Bar 3: Diastolic Pressure (Shared Right Axis for blood pressure tracking) */}
          <Bar yAxisId="right" dataKey="diastolic" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};