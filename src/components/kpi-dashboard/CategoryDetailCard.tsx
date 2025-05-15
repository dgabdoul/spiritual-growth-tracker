
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CategoryDetailCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  averageScore: number;
  latestScore: number;
  diff?: number;
}

const CategoryDetailCard: React.FC<CategoryDetailCardProps> = ({
  title,
  description = "Tendance et moyenne",
  icon,
  averageScore,
  latestScore,
  diff
}) => {
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-spirit-purple/10 p-2 rounded-full">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-sm text-gray-500">Score moyen</span>
            <div className="text-3xl font-bold">{averageScore}%</div>
          </div>

          <div>
            <span className="text-sm text-gray-500">Dernier score</span>
            <div className="text-2xl font-medium">{latestScore}%</div>
          </div>

          {diff !== undefined && (
            <div>
              <span className="text-sm text-gray-500">Progression</span>
              <div className="text-xl font-medium">
                <div className="flex items-center gap-2">
                  {diff > 0 ? (
                    <TrendingUp className="text-green-600" />
                  ) : diff < 0 ? (
                    <TrendingUp className="text-red-600 rotate-180" />
                  ) : (
                    <Separator className="w-4 h-0.5" />
                  )}
                  <span className={diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : ''}>
                    {diff > 0 ? '+' : ''}{diff}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDetailCard;
