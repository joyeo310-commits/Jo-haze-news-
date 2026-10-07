import React from 'react';
import { RegionId, RegionReading } from '../types/airQuality';
import { getStatusBand } from '../data/mockData';

interface RegionPillsProps {
  selectedRegion: RegionId;
  onSelectRegion: (id: RegionId) => void;
  regionsData: Record<string, RegionReading>;
}

export const RegionPills: React.FC<RegionPillsProps> = ({
  selectedRegion,
  onSelectRegion,
  regionsData,
}) => {
  const regions: { id: RegionId; label: string }[] = [
    { id: 'national', label: 'All Singapore (National)' },
    { id: 'north', label: 'North' },
    { id: 'south', label: 'South' },
    { id: 'east', label: 'East' },
    { id: 'west', label: 'West' },
    { id: 'central', label: 'Central' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-thin">
      <div className="inline-flex items-center gap-2 p-1 min-w-max">
        {regions.map((region) => {
          const isSelected = selectedRegion === region.id;
          const reading = regionsData[region.id];
          const psi = reading ? reading.psi24Hr : 44;
          const band = getStatusBand(psi);

          return (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region.id)}
              className={`inline-flex items-center gap-2 h-8 px-4 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer whitespace-nowrap select-none ${
                isSelected
                  ? 'bg-[#1E1124] text-white font-semibold shadow-xs ring-1 ring-rose-500/30'
                  : 'bg-white/95 border border-rose-200/70 text-[#334155] hover:bg-rose-50/60 hover:border-rose-300'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: band.color }}
              />
              <span>{region.label}</span>
              <span
                className={`text-[11px] tabular-nums font-semibold ml-0.5 ${
                  isSelected ? 'text-rose-200' : 'text-[#64748B]'
                }`}
              >
                {psi}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
