import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-card border border-parchment/20 flex flex-col rounded-lg overflow-hidden p-6 animate-pulse">
      <div className="h-64 bg-parchment/10 rounded-md" />
      <div className="pt-6">
        <div className="h-7 w-3/4 bg-parchment/10 rounded-md mb-4" />
        <div className="h-4 w-full bg-parchment/10 rounded-md mb-2" />
        <div className="h-4 w-2/3 bg-parchment/10 rounded-md mb-4" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-8 w-1/3 bg-parchment/10 rounded-md" />
          <div className="w-12 h-12 bg-parchment/10 rounded-md" />
        </div>
      </div>
    </div>
  );
};