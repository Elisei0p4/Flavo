import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

export const OrderCardSkeleton: React.FC = () => (
  <div className="vintage-card-dark p-6 rounded-lg">
    <div className="flex justify-between items-start mb-4">
      <Skeleton height={24} width={120} />
      <Skeleton height={20} width={80} rounded />
    </div>
    <Skeleton height={16} width="100%" className="mb-2" />
    <Skeleton height={16} width="70%" className="mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton height={20} width={100} />
      <Skeleton height={32} width={100} rounded />
    </div>
  </div>
);