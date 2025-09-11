'use client';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-700 dark:bg-gray-700 rounded-md ${className}`}
    />
  );
}
