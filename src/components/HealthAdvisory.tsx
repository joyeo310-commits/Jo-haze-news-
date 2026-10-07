import React, { useState } from 'react';
import { StatusBandInfo, StatusBandLevel } from '../types/airQuality';
import { STATUS_BANDS, HEALTH_GUIDELINES } from '../data/mockData';
import {
  Shield,
  Heart,
  Users,
  Baby,
  Activity,
  HardHat,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Wind,
  Home,
  Check,
} from 'lucide-react';

interface HealthAdvisoryProps {
  currentPsi: number;
  currentPm25: number;
  currentBand: StatusBandInfo;
}

export const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({
  currentPsi,
  currentPm25,
  currentBand,
}) => {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);

  const activeGroup = HEALTH_GUIDELINES[selectedGroupIdx];
  const groupAdviceForCurrentBand = activeGroup.bandGuidance[currentBand.level];

  // Specific Actionable Flags based on current status band
  const isOutdoorCardioSafe = currentBand.level <= 2;
  const isWindowVentilationSafe = currentBand.level <= 2;
  const isN95Recommended = currentBand.level >= 4;

  return (
    <div className="space-y-6">
      {/* Personalized Risk & Activity Advisor with Summer Styling */}
      <div className="bg-white rounded-lg border border-rose-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-rose-200/80 bg-rose-50/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E1124] flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                Personalized Civic Activity & Exposure Planner
              </h2>
              <p className="text-xs text-[#64748B]">
                Tailored health protocols based on active national air quality (PSI {currentPsi} • {currentBand.name})
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100/70 border border-rose-200 text-xs font-semibold text-rose-900 shadow-2xs">
              <span>Active Band {currentBand.level}:</span>
              <span style={{ color: currentBand.color }}>{currentBand.name}</span>
            </div>
          </div>
        </div>

        {/* Demographic Group Selector Tabs */}
        <div className="p-4 border-b border-rose-100 bg-[#FFF9FA] overflow-x-auto">
          <label className="text-xs font-bold uppercase tracking-wider text-rose-900 block mb-2">
            Select Your Health Profile:
          </label>
          <div className="inline-flex gap-2 min-w-max">
            {HEALTH_GUIDELINES.map((g, idx) => {
              const isSelected = selectedGroupIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedGroupIdx(idx)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold border-rose-600 shadow-xs shadow-rose-500/20'
                      : 'bg-white text-[#334155] border-rose-200 hover:bg-rose-50/70'
                  }`}
                >
                  {idx === 0 && <Activity className="w-3.5 h-3.5" />}
                  {idx === 1 && <Heart className="w-3.5 h-3.5" />}
                  {idx === 2 && <Baby className="w-3.5 h-3.5" />}
                  {idx === 3 && <Shield className="w-3.5 h-3.5" />}
                  {idx === 4 && <HardHat className="w-3.5 h-3.5" />}
                  <span>{g.group}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Advice Breakdown for Selected Profile */}
        <div className="p-5 sm:p-7 space-y-6">
          <div
            className="p-4 sm:p-5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: currentBand.surface,
              borderColor: currentBand.border,
            }}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Protocol for {activeGroup.group}
              </div>
              <h3
                className="text-lg sm:text-xl font-bold mt-0.5"
                style={{ color: currentBand.text }}
              >
                {groupAdviceForCurrentBand.levelText}
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] mt-1 max-w-2xl">
                {groupAdviceForCurrentBand.actionDetail}
              </p>
            </div>

            <div className="shrink-0">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: currentBand.badgeBg,
                  borderColor: currentBand.badgeBorder,
                  color: currentBand.text,
                }}
              >
                {groupAdviceForCurrentBand.canOutdoor ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Outdoor Allowed
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-600" />
                    Restrictions Apply
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Quick Action Matrix for Home & Commute */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Action 1: Outdoor Exercise */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0EA5E9]" />
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Outdoor Exercise
                </h4>
              </div>
              <div className="text-sm font-semibold text-[#0F172A]">
                {isOutdoorCardioSafe
                  ? 'Safe for Running & Sports'
                  : 'Curtail Outdoor Exertion'}
              </div>
              <p className="text-xs text-[#64748B]">
                {isOutdoorCardioSafe
                  ? 'Aerobic workouts and open-air activities safe at current particulate concentrations.'
                  : 'Replace outdoor running or sports with indoor gym workouts or shaded light walking.'}
              </p>
            </div>

            {/* Action 2: Windows & Ventilation */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#0EA5E9]" />
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Window Ventilation
                </h4>
              </div>
              <div className="text-sm font-semibold text-[#0F172A]">
                {isWindowVentilationSafe
                  ? 'Keep Natural Air Flow'
                  : 'Close Windows & Seal Drafts'}
              </div>
              <p className="text-xs text-[#64748B]">
                {isWindowVentilationSafe
                  ? 'Adequate fresh air exchange recommended to maintain healthy indoor air.'
                  : 'Close external windows and utilize air purifiers fitted with HEPA filters.'}
              </p>
            </div>

            {/* Action 3: N95 Respirators */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0EA5E9]" />
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  N95 Mask Usage
                </h4>
              </div>
              <div className="text-sm font-semibold text-[#0F172A]">
                {isN95Recommended
                  ? 'Recommended for Prolonged Outdoor'
                  : 'Not Required Currently'}
              </div>
              <p className="text-xs text-[#64748B]">
                {isN95Recommended
                  ? 'Properly fitted N95 masks filter fine PM2.5. Note: standard surgical masks do not filter fine smoke haze.'
                  : 'General public does not require respirators under current air quality.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official NEA & MOH National Health Advisory Matrix Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-sm font-bold text-[#0F172A]">
            Official National Environment Agency (NEA) & Ministry of Health (MOH) Advisory Matrix
          </h3>
          <p className="text-xs text-[#64748B]">
            Public health action recommendations calibrated across all 5 standard 24-hr PSI bands
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                <th className="py-3 px-4 w-44">Target Demographic</th>
                <th className="py-3 px-3 bg-emerald-50/60 text-emerald-900 border-l border-emerald-100">
                  Good (0 – 50)
                </th>
                <th className="py-3 px-3 bg-sky-50/60 text-sky-900 border-l border-sky-100">
                  Moderate (51 – 100)
                </th>
                <th className="py-3 px-3 bg-amber-50/60 text-amber-900 border-l border-amber-100">
                  Unhealthy (101 – 200)
                </th>
                <th className="py-3 px-3 bg-orange-50/60 text-orange-900 border-l border-orange-100">
                  Very Unhealthy (201 – 300)
                </th>
                <th className="py-3 px-3 bg-red-50/60 text-red-900 border-l border-red-100">
                  Hazardous (&gt; 300)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-normal text-[#0F172A]">
              {HEALTH_GUIDELINES.map((g, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#0F172A] bg-white">
                    {g.group}
                  </td>
                  <td className="py-3 px-3 border-l border-slate-200">
                    <span className="font-medium text-emerald-700 block">
                      {g.bandGuidance[1].levelText}
                    </span>
                    <span className="text-[11px] text-[#64748B] line-clamp-2">
                      {g.bandGuidance[1].actionDetail}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-l border-slate-200">
                    <span className="font-medium text-sky-700 block">
                      {g.bandGuidance[2].levelText}
                    </span>
                    <span className="text-[11px] text-[#64748B] line-clamp-2">
                      {g.bandGuidance[2].actionDetail}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-l border-slate-200">
                    <span className="font-medium text-amber-700 block">
                      {g.bandGuidance[3].levelText}
                    </span>
                    <span className="text-[11px] text-[#64748B] line-clamp-2">
                      {g.bandGuidance[3].actionDetail}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-l border-slate-200">
                    <span className="font-medium text-orange-700 block">
                      {g.bandGuidance[4].levelText}
                    </span>
                    <span className="text-[11px] text-[#64748B] line-clamp-2">
                      {g.bandGuidance[4].actionDetail}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-l border-slate-200">
                    <span className="font-medium text-red-700 block">
                      {g.bandGuidance[5].levelText}
                    </span>
                    <span className="text-[11px] text-[#64748B] line-clamp-2">
                      {g.bandGuidance[5].actionDetail}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidance Note: Understanding 1-hr PM2.5 vs 24-hr PSI */}
      <div className="p-4 sm:p-5 rounded-lg border border-[#CBD5E1] bg-white flex items-start gap-4 text-xs">
        <HelpCircle className="w-5 h-5 text-[#0EA5E9] shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-[#334155]">
          <h4 className="font-bold text-[#0F172A] text-sm">
            Civic Guide: When to rely on 1-hr PM2.5 vs 24-hr PSI
          </h4>
          <p>
            • <strong>1-hr PM2.5 (µg/m³):</strong> Reflects immediate, short-term particulate levels. Use this indicator to make immediate decisions on outdoor plans within the next few hours (e.g. deciding whether to go jogging or let children play outdoors now).
          </p>
          <p>
            • <strong>24-hr PSI:</strong> Evaluates total health impact over a 24-hour duration based on multiple pollutants (PM2.5, PM10, SO2, CO, O3, NO2). Official health advisories, school cancellation protocols, and general medical guidance are anchored on 24-hr PSI.
          </p>
        </div>
      </div>
    </div>
  );
};
