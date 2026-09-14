import React from 'react';
import { ROLE_CONFIG } from '../../utils/formatters';
import { ShieldCheck, Headphones, PackageCheck, UserCheck } from 'lucide-react';

export const RoleBadge = ({ role, showIcon = true, size = 'md' }) => {
  const config = ROLE_CONFIG[role] || {
    label: role || 'Nomaʼlum',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const getIcon = () => {
    switch (role) {
      case 'Admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />;
      case 'Manager':
        return <PackageCheck className="w-3.5 h-3.5 text-indigo-600" />;
      case 'CallCenter':
        return <Headphones className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5 gap-1' 
    : 'text-xs font-semibold px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border ${config.badgeClass} ${sizeClasses}`}>
      {showIcon && getIcon()}
      <span>{config.label}</span>
    </span>
  );
};
