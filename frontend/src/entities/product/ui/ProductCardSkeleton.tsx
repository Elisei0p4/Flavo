import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

export const ProductCardSkeleton: React.FC = () => (
  <div className="vintage-card-dark p-4 rounded-lg">
    <Skeleton height={200} className="mb-4" />
    <Skeleton height={24} width="80%" className="mb-2" />
    <Skeleton height={16} width="60%" className="mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton height={20} width={80} />
      <Skeleton height={40} width={120} rounded />
    </div>
  </div>
);