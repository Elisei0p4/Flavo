import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

export const ProfileCardSkeleton: React.FC = () => (
  <div className="vintage-card-dark p-8 rounded-lg">
    <Skeleton height={80} width={80} rounded className="mx-auto mb-4" />
    <Skeleton height={24} width="60%" className="mx-auto mb-2" />
    <Skeleton height={16} width="40%" className="mx-auto mb-4" />
    <Skeleton height={20} width={120} className="mx-auto" />
  </div>
);