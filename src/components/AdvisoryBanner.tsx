import React from 'react';
import { StatusBandInfo } from '../types/airQuality';
import { AlertTriangle, AlertOctagon, ShieldCheck, Activity, ChevronRight } from 'lucide-react';

interface AdvisoryBannerProps {
  band: StatusBandInfo;
  headline: string;
  onViewDetails?: () => void;
}

export const AdvisoryBanner: React.FC<AdvisoryBannerProps> = ({
  band,
  headline,
  onViewDetails,
}) => {
  const getIcon = () => {
    switch (band.level) {
      case 1:
        return <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />;
      case 2:
        return <Activity className="w-5 h-5 text-[#0EA5E9] shrink-0" />;
      case 3:
        return <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />;
      case 4:
        return <AlertOctagon className="w-5 h-5 text-[#F97316] shrink-0" />;
      case 5:
        return <AlertOctagon className="w-5 h-5 text-[#EF4444] shrink-0" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />;
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-white border border-rose-200/80 shadow-xs transition-all"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: band.color,
      }}
    >
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className="p-2 rounded-md shrink-0 mt-0.5 shadow-2xs"
            style={{ backgroundColor: band.surface }}
          >
            {getIcon()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs"
                style={{
                  backgroundColor: band.surface,
                  color: band.text,
                  border: `1px solid ${band.border}`,
                }}
              >
                Band {band.level}: {band.name} (PSI {band.psiRange})
              </span>
              <span className="text-xs text-[#64748B]">
                Official National Health Advisory
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-[#1E1124] leading-snug">
              {headline}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] max-w-3xl">
              {band.actionSummary}
            </p>
          </div>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="self-start md:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E1124] bg-white border border-rose-200 rounded-md hover:bg-rose-50/70 transition-colors whitespace-nowrap shadow-2xs"
          >
            Activity Guidance Matrix
            <ChevronRight className="w-3.5 h-3.5 text-rose-500" />
          </button>
        )}
      </div>
    </div>
  );
};
