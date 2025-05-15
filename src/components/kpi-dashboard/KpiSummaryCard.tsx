
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KpiSummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const KpiSummaryCard: React.FC<KpiSummaryCardProps> = ({
  title,
  value,
  description,
  icon,
}) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="bg-spirit-purple/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default KpiSummaryCard;
