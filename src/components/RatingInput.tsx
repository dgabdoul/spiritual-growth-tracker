
import React from 'react';
import { cn } from '@/lib/utils';

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
  return (
    <div className="flex gap-2 justify-center my-2">
      {Array.from({ length: max }).map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={ratingValue}
            type="button"
            onClick={() => onChange(ratingValue)}
            className={cn(
              "w-10 h-10 rounded-full transition-all flex items-center justify-center text-sm font-medium",
              value >= ratingValue
                ? "bg-spirit-purple text-white ring-2 ring-spirit-light-purple shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}
            aria-label={`Rate ${ratingValue} out of ${max}`}
          >
            {ratingValue}
          </button>
        );
      })}
    </div>
  );
};

export default RatingInput;
