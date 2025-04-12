
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressBar from './ProgressBar';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/contexts/AssessmentContext';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: Category;
  title: string;
  score: number;
  description: string;
  icon: React.ReactNode;
  advice?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  title,
  score,
  description,
  icon,
  advice
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-spirit-soft-purple p-4 flex flex-row items-center gap-4">
        <div className="bg-spirit-purple p-3 rounded-full text-white">
          {icon}
        </div>
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <ProgressBar 
            value={score} 
            label={`${score}%`} 
            size="md"
            color={score >= 80 ? "bg-green-500" : 
                  score >= 60 ? "bg-spirit-purple" : 
                  score >= 40 ? "bg-amber-500" : "bg-red-500"} 
          />
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
        {advice && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
            {advice}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Link to={`/assessment/${category}`} className="w-full">
          <Button variant="ghost" className="w-full flex items-center justify-between">
            View Details
            <ChevronRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
