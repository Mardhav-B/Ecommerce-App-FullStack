import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
    />
  );
};
