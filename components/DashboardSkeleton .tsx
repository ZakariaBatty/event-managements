import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="h-20 rounded-2xl bg-muted animate-pulse flex flex-col justify-center px-4"
          >
            <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 w-1/2 bg-gray-400 rounded"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border p-4 animate-pulse space-y-4">
        {/* Table header */}
        <div className="flex items-center gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="h-4 w-1/4 bg-gray-300 rounded"
            ></div>
          ))}
        </div>

        {/* Table rows */}
        <div className="space-y-3">
          {[...Array(5)].map((_, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-4">
              {[...Array(4)].map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="h-4 w-1/4 bg-gray-200 rounded"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
