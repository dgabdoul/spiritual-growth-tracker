
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par catégorie</CardTitle>
        <CardDescription>Dernière évaluation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
