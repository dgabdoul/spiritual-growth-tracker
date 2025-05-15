
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';

interface ChartData {
  date: string;
  psychologie: number;
  santé: number;
  spiritualité: number;
  relations: number;
  finances: number;
  global: number;
}

interface ProgressionChartProps {
  data: Array<{
    assessment_date: string;
    psychology_score: number;
    health_score: number;
    spirituality_score: number;
    relationships_score: number;
    finances_score: number;
    overall_score: number;
  }>;
  height?: number;
}

const ProgressionChart: React.FC<ProgressionChartProps> = ({ data, height = 400 }) => {
  const formattedData: ChartData[] = data
    .map(item => ({
      date: format(new Date(item.assessment_date), 'dd/MM/yy', { locale: fr }),
      psychologie: item.psychology_score,
      santé: item.health_score,
      spiritualité: item.spirituality_score,
      relations: item.relationships_score,
      finances: item.finances_score,
      global: item.overall_score
    }))
    .reverse();

  return (
    <div style={{ width: '100%', height }}>
      <ChartContainer
        config={{
          global: { color: '#9b87f5' },
          psychologie: { color: '#8884d8' },
          santé: { color: '#82ca9d' },
          spiritualité: { color: '#ffc658' },
          relations: { color: '#a4de6c' },
          finances: { color: '#d0ed57' },
        }}
      >
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line 
            type="monotone" 
            dataKey="global" 
            name="Score global" 
            stroke="#9b87f5" 
            activeDot={{ r: 8 }} 
            strokeWidth={2} 
          />
          <Line type="monotone" dataKey="psychologie" stroke="#8884d8" strokeWidth={1} />
          <Line type="monotone" dataKey="santé" stroke="#82ca9d" strokeWidth={1} />
          <Line type="monotone" dataKey="spiritualité" stroke="#ffc658" strokeWidth={1} />
          <Line type="monotone" dataKey="relations" stroke="#a4de6c" strokeWidth={1} />
          <Line type="monotone" dataKey="finances" stroke="#d0ed57" strokeWidth={1} />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ProgressionChart;
