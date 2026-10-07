import React from 'react';
import { RegionId, RegionReading, StatusBandInfo } from '../types/airQuality';
import { getStatusBand, getPm25StatusBand } from '../data/mockData';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface OverviewDashboardProps {
  selectedRegion: RegionId;
  regionsData: Record<string, RegionReading>;
  onSelectRegion: (id: RegionId) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  selectedRegion,
  regionsData,
  onSelectRegion,
  onNavigateToTab,
}) => {
  const currentReading = regionsData[selectedRegion] || regionsData['national'];
  const band = getStatusBand(currentReading.psi24Hr);
  const pm25Band = getPm25StatusBand(currentReading.pm25OneHr);

  const fiveRegions: { id: RegionId; title: string; subtitle: string }[] = [
    { id: 'north', title: 'North', subtitle: 'Woodlands, Yishun, Sembawang' },
    { id: 'south', title: 'South', subtitle: 'Marina Bay, Telok Blangah, Sentosa' },
    { id: 'east', title: 'East', subtitle: 'Bedok, Tampines, Changi' },
    { id: 'west', title: 'West', subtitle: 'Jurong, Tuas, Clementi' },
    { id: 'central', title: 'Central', subtitle: 'Bishan, Toa Payoh, Orchard' },
  ];

  const getTrendIcon = (trend: 'rising' | 'falling' | 'stable') => {
    switch (trend) {
      case 'rising':
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-600 gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> Rising
          </span>
        );
      case 'falling':
        return (
          <span className="inline-flex items-center text-xs font-medium text-emerald-600 gap-0.5">
            <ArrowDownRight className="w-3.5 h-3.5" /> Improving
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium text-[#64748B] gap-0.5">
            <Minus className="w-3.5 h-3.5" /> Stable
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HERO OVERVIEW CARD ================= */}
      <div className="bg-white rounded-lg border border-rose-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-7 border-b border-rose-100 bg-gradient-to-b from-white via-rose-50/25 to-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Region Title & Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full shadow-2xs">
                  Official Monitoring Sector
                </span>
                <span className="text-xs text-[#64748B] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  {currentReading.lastUpdated}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1124] tracking-tight">
                {currentReading.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569]">
                {currentReading.label} • Key coverage: {currentReading.towns.join(', ')}
              </p>
            </div>

            {/* Health Band Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className="px-4 py-2.5 rounded-md border flex items-center gap-3 transition-colors shadow-2xs"
                style={{
                  backgroundColor: band.surface,
                  borderColor: band.border,
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: band.color }}
                />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    24-hr PSI Status
                  </div>
                  <div
                    className="text-base sm:text-lg font-bold leading-tight"
                    style={{ color: band.text }}
                  >
                    Band {band.level}: {band.name}
                  </div>
                </div>
              </div>

              {/* 1-hr PM2.5 indicator pill */}
              <div
                className="px-4 py-2.5 rounded-md border flex items-center gap-3 shadow-2xs"
                style={{
                  backgroundColor: pm25Band.surface,
                  borderColor: pm25Band.border,
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: pm25Band.color }}
                />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    1-hr PM2.5 Status
                  </div>
                  <div
                    className="text-base sm:text-lg font-bold leading-tight"
                    style={{ color: pm25Band.text }}
                  >
                    {pm25Band.name} ({currentReading.pm25OneHr} µg/m³)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Metric Readings Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-rose-100">
            {/* Primary PSI Display */}
            <div className="flex items-baseline gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  National 24-hr Pollutant Standards Index
                </div>
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-6xl sm:text-7xl font-bold tracking-tight tabular-nums"
                    style={{ color: band.color }}
                  >
                    {currentReading.psi24Hr}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-[#1E1124] block">
                      PSI
                    </span>
                    <span className="text-xs text-[#64748B] block">
                      Band {band.psiRange}
                    </span>
                    <div className="mt-1">{getTrendIcon(currentReading.trend)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Immediate 1-hr PM2.5 Display */}
            <div className="flex items-baseline gap-4 md:border-l md:border-rose-100 md:pl-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  1-hr PM2.5 Fine Particulates (Immediate Planning)
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-bold text-[#1E1124] tracking-tight tabular-nums">
                    {currentReading.pm25OneHr}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-[#1E1124] block">
                      µg/m³
                    </span>
                    <span className="text-xs text-[#64748B] block">
                      24-hr Avg: {currentReading.pm25TwentyFourHr} µg/m³
                    </span>
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">
                      Recommended for current outdoor plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Meteorological Sub-metrics Row with Summer Accents */}
        <div className="p-4 sm:p-5 bg-white grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#FFF9FA] border border-rose-200/60 shadow-2xs">
            <Thermometer className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <span className="text-[11px] text-[#64748B] block font-medium">Summer Ambient Temp</span>
              <span className="text-sm font-bold text-[#1E1124] tabular-nums">
                {currentReading.temperature} °C
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#FFF9FA] border border-rose-200/60 shadow-2xs">
            <Droplets className="w-5 h-5 text-sky-500 shrink-0" />
            <div>
              <span className="text-[11px] text-[#64748B] block font-medium">Relative Humidity</span>
              <span className="text-sm font-bold text-[#1E1124] tabular-nums">
                {currentReading.humidity} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#FFF9FA] border border-rose-200/60 shadow-2xs">
            <Wind className="w-5 h-5 text-teal-600 shrink-0" />
            <div>
              <span className="text-[11px] text-[#64748B] block font-medium">Southwest Breeze</span>
              <span className="text-sm font-bold text-[#1E1124] tabular-nums">
                {currentReading.windDirection} • {currentReading.windSpeed} km/h
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#FFF9FA] border border-rose-200/60 shadow-2xs">
            <Sun className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="text-[11px] text-[#64748B] block font-medium">Solar Summer UV</span>
              <span className="text-sm font-bold text-[#1E1124] tabular-nums">
                {currentReading.uvIndex} (High)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5-REGION COMPARISON MATRIX ================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1E1124]">
              Islandwide 5-Region Telemetry Grid
            </h2>
            <p className="text-xs text-[#64748B]">
              Real-time synchronization across Singapore's geographical sectors
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('map')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
          >
            Inspect on Map →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {fiveRegions.map((reg) => {
            const data = regionsData[reg.id] || regionsData['national'];
            const regBand = getStatusBand(data.psi24Hr);
            const isSelected = selectedRegion === reg.id;

            return (
              <div
                key={reg.id}
                onClick={() => onSelectRegion(reg.id)}
                className={`group cursor-pointer rounded-lg p-4 bg-white border transition-all text-left relative ${
                  isSelected
                    ? 'border-rose-600 ring-2 ring-rose-500/30 shadow-md shadow-rose-500/10'
                    : 'border-rose-200/70 hover:border-rose-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1E1124]">{reg.title}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs"
                    style={{
                      backgroundColor: regBand.badgeBg,
                      color: regBand.text,
                      border: `1px solid ${regBand.badgeBorder}`,
                    }}
                  >
                    {regBand.name}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-bold tabular-nums"
                    style={{ color: regBand.color }}
                  >
                    {data.psi24Hr}
                  </span>
                  <span className="text-xs text-[#64748B]">PSI</span>
                </div>

                <div className="mt-3 pt-2 border-t border-rose-50 text-[11px] space-y-1">
                  <div className="flex justify-between text-[#64748B]">
                    <span>1-hr PM2.5:</span>
                    <span className="font-semibold text-[#1E1124] tabular-nums">
                      {data.pm25OneHr} µg/m³
                    </span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Temp & Wind:</span>
                    <span className="font-medium text-[#334155] tabular-nums">
                      {data.temperature}°C • {data.windDirection}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-[#94A3B8] mt-2 line-clamp-1">
                  {reg.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= COMPREHENSIVE SUB-POLLUTANTS TABLE ================= */}
      <div className="bg-white rounded-lg border border-rose-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-rose-200/80 bg-rose-50/40 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#1E1124]">
              Standardized Ambient Sub-Pollutants Matrix
            </h3>
            <p className="text-xs text-[#64748B]">
              Continuous readings measured against Singapore National Ambient Air Quality Targets
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-800">
            <Info className="w-3.5 h-3.5 text-rose-500" />
            <span>Based on 24-hr & 8-hr moving averages</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                <th className="py-2.5 px-4">Pollutant Parameter</th>
                <th className="py-2.5 px-4">Averaging Period</th>
                <th className="py-2.5 px-4">Current Value</th>
                <th className="py-2.5 px-4">National Target</th>
                <th className="py-2.5 px-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] font-normal text-[#0F172A]">
              <tr>
                <td className="py-3 px-4 font-semibold">
                  PM2.5 (Fine Particulate Matter)
                </td>
                <td className="py-3 px-4 text-[#64748B]">1-hr Concentration</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {currentReading.pm25OneHr} µg/m³
                </td>
                <td className="py-3 px-4 text-[#64748B]">&lt; 55 µg/m³ (Moderate band)</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Normal Safe
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold">
                  PM2.5 (Fine Particulate Matter)
                </td>
                <td className="py-3 px-4 text-[#64748B]">24-hr Moving Average</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {currentReading.pm25TwentyFourHr} µg/m³
                </td>
                <td className="py-3 px-4 text-[#64748B]">15 µg/m³ (Annual target)</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold">
                  PM10 (Coarse Particulate Matter)
                </td>
                <td className="py-3 px-4 text-[#64748B]">24-hr Moving Average</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {currentReading.pm10TwentyFourHr} µg/m³
                </td>
                <td className="py-3 px-4 text-[#64748B]">50 µg/m³</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold">
                  Ozone (O₃)
                </td>
                <td className="py-3 px-4 text-[#64748B]">8-hr Moving Average</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {currentReading.o3EightHr} µg/m³
                </td>
                <td className="py-3 px-4 text-[#64748B]">100 µg/m³</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold">
                  Nitrogen Dioxide (NO₂)
                </td>
                <td className="py-3 px-4 text-[#64748B]">1-hr Moving Average</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {currentReading.no2OneHr} µg/m³
                </td>
                <td className="py-3 px-4 text-[#64748B]">200 µg/m³</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold">
                  Sulphur Dioxide (SO₂)
                </td>
                <td className="py-3 px-4 text-[#64748B]">24-hr Moving Average</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {currentReading.so2TwentyFourHr} µg/m³
                </td>
                <td className="py-3 px-4 text-[#64748B]">40 µg/m³</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold">
                  Carbon Monoxide (CO)
                </td>
                <td className="py-3 px-4 text-[#64748B]">8-hr Moving Average</td>
                <td className="py-3 px-4 font-bold tabular-nums">
                  {currentReading.coEightHr} mg/m³
                </td>
                <td className="py-3 px-4 text-[#64748B]">10.0 mg/m³</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
