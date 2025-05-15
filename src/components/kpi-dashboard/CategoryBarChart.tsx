
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataItem {
  date: string;
  score: number;
}

interface CategoryBarChartProps {
  data: ChartDataItem[];
  categoryTitle: string;
  categoryColor: string;
}

const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data, categoryTitle, categoryColor }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar 
            dataKey="score" 
            name={categoryTitle} 
            fill={categoryColor} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBarChart;
