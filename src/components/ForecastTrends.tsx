import React, { useState } from 'react';
import { HourlyReading, DayForecast, ScenarioPreset } from '../types/airQuality';
import { STATUS_BANDS, getStatusBand } from '../data/mockData';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Wind,
  Compass,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface ForecastTrendsProps {
  hourlyData: HourlyReading[];
  forecastData: DayForecast[];
  scenarioMultiplier: number;
}

export const ForecastTrends: React.FC<ForecastTrendsProps> = ({
  hourlyData,
  forecastData,
  scenarioMultiplier,
}) => {
  const [metricMode, setMetricMode] = useState<'psi' | 'pm25'>('psi');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute scaled readings for the scenario
  const scaledHourly = hourlyData.map((d) => ({
    ...d,
    psi: Math.min(420, Math.round(d.psi * scenarioMultiplier)),
    pm25: Math.min(350, Math.round(d.pm25 * scenarioMultiplier)),
  }));

  // SVG Chart Dimensions
  const chartWidth = 840;
  const chartHeight = 280;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = metricMode === 'psi' ? 320 : 200;
  const minVal = 0;

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return paddingTop + innerHeight - ((clamped - minVal) / (maxVal - minVal)) * innerHeight;
  };

  const getX = (idx: number) => {
    return paddingLeft + (idx / (scaledHourly.length - 1)) * innerWidth;
  };

  // Build path line
  const points = scaledHourly.map((d, i) => `${getX(i)},${getY(metricMode === 'psi' ? d.psi : d.pm25)}`);
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${getX(scaledHourly.length - 1)},${paddingTop + innerHeight} L ${getX(0)},${paddingTop + innerHeight} Z`;

  const activeHoverData = hoveredIndex !== null ? scaledHourly[hoveredIndex] : scaledHourly[scaledHourly.length - 1];

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case 'Sunny':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Partly Cloudy':
        return <CloudSun className="w-5 h-5 text-sky-500" />;
      case 'Passing Showers':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'Thundery Showers':
        return <CloudLightning className="w-5 h-5 text-indigo-500" />;
      default:
        return <CloudSun className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 24-Hour Trend Section */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0EA5E9]" />
              24-Hour Continuous Air Quality Trend
            </h2>
            <p className="text-xs text-[#64748B]">
              Tabular telemetry trend across past 24 hours with NEA standard health band boundaries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-medium mr-1">Parameter:</span>
            <div className="inline-flex rounded border border-[#CBD5E1] p-0.5 bg-white text-xs">
              <button
                onClick={() => setMetricMode('psi')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  metricMode === 'psi'
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#475569] hover:bg-slate-50'
                }`}
              >
                24-hr PSI
              </button>
              <button
                onClick={() => setMetricMode('pm25')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  metricMode === 'pm25'
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#475569] hover:bg-slate-50'
                }`}
              >
                1-hr PM2.5 (µg/m³)
              </button>
            </div>
          </div>
        </div>

        {/* Hover Inspector Bar */}
        <div className="px-5 py-3 bg-[#F1F5F9]/50 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-[#64748B]">
              Inspecting Timestamp: <strong className="text-[#0F172A]">{activeHoverData.hour}</strong>
            </span>
            <span className="text-[#64748B]">
              PSI Value:{' '}
              <strong
                className="tabular-nums"
                style={{ color: getStatusBand(activeHoverData.psi).color }}
              >
                {activeHoverData.psi} ({getStatusBand(activeHoverData.psi).name})
              </strong>
            </span>
            <span className="text-[#64748B]">
              1-hr PM2.5:{' '}
              <strong className="text-[#0F172A] tabular-nums">
                {activeHoverData.pm25} µg/m³
              </strong>
            </span>
          </div>

          <div className="text-[11px] text-[#64748B]">
            Hover along chart data points to inspect past readings
          </div>
        </div>

        {/* SVG Graph */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[700px] h-auto select-none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Threshold horizontal background bands */}
            {metricMode === 'psi' ? (
              <>
                {/* 0 - 50 Good */}
                <rect
                  x={paddingLeft}
                  y={getY(50)}
                  width={innerWidth}
                  height={getY(0) - getY(50)}
                  fill="#10B981"
                  fillOpacity="0.06"
                />
                {/* 51 - 100 Moderate */}
                <rect
                  x={paddingLeft}
                  y={getY(100)}
                  width={innerWidth}
                  height={getY(50) - getY(100)}
                  fill="#0EA5E9"
                  fillOpacity="0.06"
                />
                {/* 101 - 200 Unhealthy */}
                <rect
                  x={paddingLeft}
                  y={getY(200)}
                  width={innerWidth}
                  height={getY(100) - getY(200)}
                  fill="#F59E0B"
                  fillOpacity="0.06"
                />
                {/* 201 - 300 Very Unhealthy */}
                <rect
                  x={paddingLeft}
                  y={getY(300)}
                  width={innerWidth}
                  height={getY(200) - getY(300)}
                  fill="#F97316"
                  fillOpacity="0.06"
                />
              </>
            ) : (
              <>
                {/* PM2.5 thresholds */}
                <rect
                  x={paddingLeft}
                  y={getY(12)}
                  width={innerWidth}
                  height={getY(0) - getY(12)}
                  fill="#10B981"
                  fillOpacity="0.06"
                />
                <rect
                  x={paddingLeft}
                  y={getY(55)}
                  width={innerWidth}
                  height={getY(12) - getY(55)}
                  fill="#0EA5E9"
                  fillOpacity="0.06"
                />
                <rect
                  x={paddingLeft}
                  y={getY(150)}
                  width={innerWidth}
                  height={getY(55) - getY(150)}
                  fill="#F59E0B"
                  fillOpacity="0.06"
                />
              </>
            )}

            {/* Grid Lines & Y-Axis Labels */}
            {[0, 50, 100, 200, 300].map((tVal) => {
              if (metricMode !== 'psi' && tVal > 150) return null;
              const yPos = getY(tVal);
              return (
                <g key={tVal}>
                  <line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={paddingLeft + innerWidth}
                    y2={yPos}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={yPos + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="600"
                    fill="#64748B"
                    className="tabular-nums"
                  >
                    {tVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#areaGrad)" />

            {/* Main Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Point Circles and X-axis Labels */}
            {scaledHourly.map((d, i) => {
              const xPos = getX(i);
              const val = metricMode === 'psi' ? d.psi : d.pm25;
              const yPos = getY(val);
              const isHovered = hoveredIndex === i;
              const band = getStatusBand(d.psi);

              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible hit area */}
                  <rect
                    x={xPos - 12}
                    y={paddingTop}
                    width={24}
                    height={innerHeight}
                    fill="transparent"
                  />

                  {/* Marker Dot */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isHovered ? 5.5 : 3}
                    fill={band.color}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? 2 : 1}
                  />

                  {/* X Axis Time Labels (every 3 hours) */}
                  {i % 3 === 0 && (
                    <text
                      x={xPos}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="500"
                      fill="#64748B"
                      className="tabular-nums"
                    >
                      {d.hour}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 4-Day Outlook Section */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0EA5E9]" />
            4-Day Regional Air Quality & Synoptic Outlook
          </h2>
          <p className="text-xs text-[#64748B]">
            Meteorological trajectory based on ASEAN Specialised Meteorological Centre (ASMC) models
          </p>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecastData.map((f, idx) => {
            const scaledMin = Math.min(380, Math.round(f.psiMin * scenarioMultiplier));
            const scaledMax = Math.min(420, Math.round(f.psiMax * scenarioMultiplier));
            const band = getStatusBand(scaledMax);

            return (
              <div
                key={idx}
                className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">{f.dayName}</span>
                    <span className="text-[11px] text-[#64748B]">{f.date}</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-[#E2E8F0] shadow-xs">
                    {getWeatherIcon(f.weatherCondition)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">
                    Expected 24-hr PSI
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span
                      className="text-2xl font-bold tabular-nums"
                      style={{ color: band.color }}
                    >
                      {scaledMin} – {scaledMax}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span
                      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: band.surface,
                        color: band.text,
                        border: `1px solid ${band.border}`,
                      }}
                    >
                      {band.name} Band
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] text-xs space-y-1 text-[#475569]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Wind className="w-3 h-3 text-[#64748B]" />
                      Wind:
                    </span>
                    <span className="font-medium text-[#0F172A] text-[11px]">{f.windSummary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">Rain Probability:</span>
                    <span className="font-semibold text-[#0EA5E9] text-[11px] tabular-nums">
                      {f.rainProbability}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Synoptic Briefing Note */}
        <div className="p-4 bg-[#F1F5F9] border-t border-[#E2E8F0] text-xs text-[#334155] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#0F172A]">ASMC Regional Synoptic Assessment:</span>{' '}
            Prevalent Southwest Monsoon conditions maintain low to moderate transboundary particulate dispersion across the Malacca Straits. Isolated afternoon convective thundery showers are expected to assist localized pollutant scavenging.
          </div>
        </div>
      </div>
    </div>
  );
};
