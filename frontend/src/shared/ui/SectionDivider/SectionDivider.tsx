import React from "react";

interface SectionDividerProps {
  variant?: 'top' | 'bottom';
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'top', className }) => {
  return (
    <div
      className={`${variant === 'top' ? 'section-divider-top' : 'section-divider-bottom'} ${className}`}
      aria-hidden="true"
    />
  );
};