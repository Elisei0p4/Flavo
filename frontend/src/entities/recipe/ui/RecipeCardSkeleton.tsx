import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

export const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="vintage-card-dark p-4 rounded-lg flex flex-col h-full">
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={28} width="90%" className="mb-2" />
      <Skeleton height={18} width="70%" className="mb-4" />
      <div className="flex-grow">
        <Skeleton height={14} width="100%" className="mb-1" />
        <Skeleton height={14} width="80%" className="mb-1" />
        <Skeleton height={14} width="90%" />
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-text-light/10">
        <Skeleton height={20} width={60} />
        <Skeleton height={32} width={100} rounded />
      </div>
    </div>
  );
};