
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  max = 5
}) => {
  // Define rating labels
  const ratingLabels = [
    "Délaissé",
    "Paresse",
    "Combat intérieur",
    "Effort constant",
    "Alhamdoulillah"
  ];

  return (
    <div className="flex gap-2 justify-between my-3">
      {Array.from({ length: max }).map((_, index) => {
        const ratingValue = index + 1;
        return (
          <TooltipProvider key={ratingValue}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(ratingValue)}
                  className={cn(
                    "w-12 h-12 rounded-lg transition-all flex items-center justify-center text-sm font-medium shadow-sm",
                    value >= ratingValue
                      ? "bg-spirit-purple text-white shadow-md ring-1 ring-spirit-light-purple"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                  )}
                  aria-label={`${ratingLabels[index]} (${ratingValue} sur ${max})`}
                >
                  {ratingValue}
                </button>
              </TooltipTrigger>
              <TooltipContent className="px-3 py-1.5 text-xs bg-black/80 text-white border-none">
                <p>{ratingLabels[index]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default RatingInput;
