import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 6, columns = 7 }: TableSkeletonProps) {
  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* هيكل مربع البحث (Search Input Skeleton) */}
      <div className="w-full max-w-md h-11 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse"></div>

      {/* هيكل الجدول (Table Skeleton) */}
      <div className="bg-background border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* صف العناوين (Header) */}
        <div className="flex bg-secondary/5 border-b border-gray-100 dark:border-gray-800 px-4 py-5">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className={`mx-2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${i === 0 ? 'w-12' : 'flex-1'}`}></div>
          ))}
        </div>

        {/* صفوف البيانات (Body Rows) */}
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50 bg-background">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex px-4 py-5 items-center">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={`col-${colIndex}`} 
                  className={`mx-2 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse 
                    ${colIndex === 0 ? 'w-10' : colIndex === columns - 1 ? 'w-24' : 'flex-1'}
                    ${colIndex % 2 === 0 && colIndex !== 0 ? 'opacity-60' : 'opacity-100'}
                  `}
                ></div>
              ))}
            </div>
          ))}
        </div>
        
        {/* شريط سفلي وهمي (Footer Skeleton) */}
        <div className="bg-secondary/5 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
           <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
           <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}