import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 animate-pulse shadow-sm">
    <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
    <div className="h-3 bg-slate-200 rounded w-full"></div>
    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
      <div className="h-6 bg-slate-200 rounded w-24"></div>
      <div className="h-9 w-24 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
    <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded flex-1"></div>
      ))}
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-slate-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const MetricsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-20"></div>
          <div className="h-7 bg-slate-200 rounded w-28"></div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
      </div>
    ))}
  </div>
);
