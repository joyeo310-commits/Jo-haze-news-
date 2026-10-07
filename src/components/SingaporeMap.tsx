import React, { useState } from 'react';
import { RegionId, RegionReading, StationSensor } from '../types/airQuality';
import { getStatusBand, getPm25StatusBand } from '../data/mockData';
import { Wind, Radio, Eye, Layers, Compass, MapPin } from 'lucide-react';

interface SingaporeMapProps {
  selectedRegion: RegionId;
  onSelectRegion: (id: RegionId) => void;
  regionsData: Record<string, RegionReading>;
  stations: StationSensor[];
  onSelectStation?: (station: StationSensor) => void;
}

export const SingaporeMap: React.FC<SingaporeMapProps> = ({
  selectedRegion,
  onSelectRegion,
  regionsData,
  stations,
  onSelectStation,
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);
  const [hoveredStation, setHoveredStation] = useState<StationSensor | null>(null);
  const [showWinds, setShowWinds] = useState(true);
  const [showStations, setShowStations] = useState(true);

  // Helper to get fill and stroke color for region
  const getRegionStyles = (regId: RegionId) => {
    const reading = regionsData[regId] || regionsData['national'];
    const band = getStatusBand(reading.psi24Hr);
    const isSelected = selectedRegion === regId;
    const isHovered = hoveredRegion === regId;

    return {
      fill: isSelected
        ? `${band.color}40`
        : isHovered
        ? `${band.color}25`
        : `${band.color}18`,
      stroke: isSelected ? band.color : `${band.color}90`,
      strokeWidth: isSelected ? 3 : 1.5,
      filter: isSelected ? 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))' : 'none',
      band,
      reading,
    };
  };

  const westStyles = getRegionStyles('west');
  const northStyles = getRegionStyles('north');
  const centralStyles = getRegionStyles('central');
  const eastStyles = getRegionStyles('east');
  const southStyles = getRegionStyles('south');

  const activeFocusData = hoveredRegion
    ? regionsData[hoveredRegion]
    : selectedRegion !== 'national'
    ? regionsData[selectedRegion]
    : regionsData['national'];

  const activeBand = getStatusBand(activeFocusData.psi24Hr);

  return (
    <div className="bg-white rounded-lg border border-rose-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Map Header Toolbar with Summer Rose Tint */}
      <div className="p-4 border-b border-rose-200/80 bg-rose-50/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-500" />
          <div>
            <h3 className="text-sm font-semibold text-[#1E1124] flex items-center gap-1.5">
              <span>Hey Haze Singapore Spatial Telemetry</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200">
                Summer Grid
              </span>
            </h3>
            <p className="text-xs text-[#64748B]">
              NEA 5-Region Monitoring Grid & Continuous Ambient Telemetry Stations
            </p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWinds(!showWinds)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              showWinds
                ? 'bg-rose-100/90 text-rose-800 border border-rose-300/80 shadow-2xs'
                : 'bg-white text-[#64748B] border border-rose-200 hover:bg-rose-50/50'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-rose-600" />
            <span>Monsoon Wind Vectors</span>
          </button>

          <button
            onClick={() => setShowStations(!showStations)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              showStations
                ? 'bg-rose-100/90 text-rose-800 border border-rose-300/80 shadow-2xs'
                : 'bg-white text-[#64748B] border border-rose-200 hover:bg-rose-50/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-600" />
            <span>Sensor Nodes</span>
          </button>

          {selectedRegion !== 'national' && (
            <button
              onClick={() => onSelectRegion('national')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Reset Islandwide
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive SVG Canvas with Summer Rose Wash */}
      <div className="relative w-full bg-[#FFF0F4]/35 min-h-[360px] sm:min-h-[460px] flex items-center justify-center p-2 sm:p-6 select-none overflow-hidden">
        {/* Subtle Map Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#FB7185 1px, transparent 1px), radial-gradient(#FB7185 1px, #FFF0F4 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Compass Rose in Corner */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs border border-rose-200 rounded p-2 text-center shadow-xs pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-rose-900">N</span>
            <Compass className="w-5 h-5 text-rose-400 my-0.5" />
            <span className="text-[9px] text-rose-300">S</span>
          </div>
        </div>

        {/* Active Inspection Card Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-rose-200/90 p-3 rounded-lg shadow-md max-w-[280px]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              {activeFocusData.name}
            </span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: activeBand.badgeBg,
                color: activeBand.text,
                border: `1px solid ${activeBand.badgeBorder}`,
              }}
            >
              {activeBand.name}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A] tabular-nums">
              {activeFocusData.psi24Hr}
            </span>
            <span className="text-xs text-[#64748B]">24-hr PSI</span>
            <span className="text-xs font-semibold text-[#0F172A] ml-auto tabular-nums">
              {activeFocusData.pm25OneHr} <span className="text-[10px] text-[#64748B]">µg/m³ PM2.5</span>
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 line-clamp-1">
            {activeFocusData.towns.join(' • ')}
          </p>
        </div>

        {/* SVG Container */}
        <svg
          viewBox="0 0 920 540"
          className="w-full h-auto max-h-[500px] transition-transform duration-300"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(15,23,42,0.06))' }}
        >
          <defs>
            {/* Gradients */}
            <pattern id="diagonalHaze" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#CBD5E1" strokeWidth="0.8" />
            </pattern>
            {/* Marker for Wind Arrows */}
            <marker
              id="windArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284C7" />
            </marker>
          </defs>

          {/* Ocean Water Background */}
          <rect x="0" y="0" width="920" height="540" fill="transparent" />

          {/* Johor / Malaysia Coastline Outline Reference */}
          <path
            d="M 20 40 Q 220 30 380 40 T 720 30 T 900 20 L 900 0 L 20 0 Z"
            fill="#E2E8F0"
            opacity="0.45"
          />
          <text x="320" y="25" fill="#94A3B8" fontSize="12" fontWeight="500" letterSpacing="2">
            STRAITS OF JOHOR
          </text>
          <text x="420" y="520" fill="#94A3B8" fontSize="12" fontWeight="500" letterSpacing="2">
            SINGAPORE STRAIT
          </text>

          {/* ===================== REGION 1: NORTH ===================== */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectRegion('north')}
            onMouseEnter={() => setHoveredRegion('north')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {/* North Geo Polygon (Woodlands, Yishun, Sembawang, Mandai) */}
            <path
              d="M 330 115 
                 C 380 90, 470 80, 560 100 
                 C 590 115, 620 150, 600 175 
                 C 560 190, 520 195, 480 200 
                 C 430 205, 380 195, 340 180 
                 C 325 150, 320 130, 330 115 Z"
              fill={northStyles.fill}
              stroke={northStyles.stroke}
              strokeWidth={northStyles.strokeWidth}
            />
            {/* Region Label Tag */}
            <g transform="translate(450, 140)">
              <rect
                x="-45"
                y="-14"
                width="90"
                height="26"
                rx="4"
                fill="white"
                fillOpacity="0.9"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                NORTH • {regionsData.north?.psi24Hr || 42}
              </text>
            </g>
          </g>

          {/* ===================== REGION 2: WEST ===================== */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectRegion('west')}
            onMouseEnter={() => setHoveredRegion('west')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {/* West Geo Polygon (Tuas, Jurong East/West, Clementi, Western Catchment) */}
            <path
              d="M 120 330 
                 C 100 370, 130 400, 190 395 
                 C 250 390, 320 380, 370 340 
                 C 380 300, 390 250, 370 210 
                 C 340 185, 310 175, 270 190 
                 C 210 200, 160 250, 120 330 Z"
              fill={westStyles.fill}
              stroke={westStyles.stroke}
              strokeWidth={westStyles.strokeWidth}
            />
            {/* Tuas Finger */}
            <path
              d="M 120 330 C 90 350, 60 380, 75 420 C 95 435, 135 410, 160 390 Z"
              fill={westStyles.fill}
              stroke={westStyles.stroke}
              strokeWidth={westStyles.strokeWidth}
            />
            {/* Region Label Tag */}
            <g transform="translate(240, 290)">
              <rect
                x="-45"
                y="-14"
                width="90"
                height="26"
                rx="4"
                fill="white"
                fillOpacity="0.9"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                WEST • {regionsData.west?.psi24Hr || 49}
              </text>
            </g>
          </g>

          {/* ===================== REGION 3: CENTRAL ===================== */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectRegion('central')}
            onMouseEnter={() => setHoveredRegion('central')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {/* Central Geo Polygon (Bishan, AMK, Bukit Timah, Toa Payoh, Queenstown) */}
            <path
              d="M 370 210 
                 C 410 198, 480 202, 530 205 
                 C 555 240, 560 280, 545 320 
                 C 520 340, 460 350, 410 345 
                 C 370 335, 365 270, 370 210 Z"
              fill={centralStyles.fill}
              stroke={centralStyles.stroke}
              strokeWidth={centralStyles.strokeWidth}
            />
            {/* Region Label Tag */}
            <g transform="translate(455, 270)">
              <rect
                x="-50"
                y="-14"
                width="100"
                height="26"
                rx="4"
                fill="white"
                fillOpacity="0.9"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                CENTRAL • {regionsData.central?.psi24Hr || 43}
              </text>
            </g>
          </g>

          {/* ===================== REGION 4: EAST ===================== */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectRegion('east')}
            onMouseEnter={() => setHoveredRegion('east')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {/* East Geo Polygon (Bedok, Tampines, Pasir Ris, Changi) */}
            <path
              d="M 560 175 
                 C 620 150, 710 170, 780 200 
                 C 820 220, 840 260, 810 295 
                 C 770 325, 700 335, 630 325 
                 C 580 315, 550 250, 560 175 Z"
              fill={eastStyles.fill}
              stroke={eastStyles.stroke}
              strokeWidth={eastStyles.strokeWidth}
            />
            {/* Pulau Ubin & Tekong Islands */}
            <path
              d="M 700 130 C 730 120, 770 135, 750 150 C 720 155, 690 145, 700 130 Z"
              fill={eastStyles.fill}
              stroke={eastStyles.stroke}
              strokeWidth="1"
            />
            <path
              d="M 780 120 C 820 115, 845 140, 830 165 C 800 170, 770 150, 780 120 Z"
              fill={eastStyles.fill}
              stroke={eastStyles.stroke}
              strokeWidth="1"
            />
            {/* Region Label Tag */}
            <g transform="translate(690, 245)">
              <rect
                x="-42"
                y="-14"
                width="84"
                height="26"
                rx="4"
                fill="white"
                fillOpacity="0.9"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                EAST • {regionsData.east?.psi24Hr || 39}
              </text>
            </g>
          </g>

          {/* ===================== REGION 5: SOUTH ===================== */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectRegion('south')}
            onMouseEnter={() => setHoveredRegion('south')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {/* South Geo Polygon (Marina Bay, Downtown, Telok Blangah, Sentosa) */}
            <path
              d="M 410 345 
                 C 480 348, 550 338, 620 330 
                 C 610 375, 560 415, 490 415 
                 C 430 415, 390 380, 410 345 Z"
              fill={southStyles.fill}
              stroke={southStyles.stroke}
              strokeWidth={southStyles.strokeWidth}
            />
            {/* Sentosa Island */}
            <path
              d="M 440 430 C 475 425, 510 435, 495 450 C 460 455, 430 445, 440 430 Z"
              fill={southStyles.fill}
              stroke={southStyles.stroke}
              strokeWidth={southStyles.strokeWidth}
            />
            {/* Southern Islands (St John's / Kusu) */}
            <circle cx="530" cy="455" r="7" fill={southStyles.fill} stroke={southStyles.stroke} />
            <circle cx="550" cy="460" r="5" fill={southStyles.fill} stroke={southStyles.stroke} />

            {/* Region Label Tag */}
            <g transform="translate(510, 375)">
              <rect
                x="-45"
                y="-14"
                width="90"
                height="26"
                rx="4"
                fill="white"
                fillOpacity="0.9"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                SOUTH • {regionsData.south?.psi24Hr || 48}
              </text>
            </g>
          </g>

          {/* ===================== MONSOON WIND VECTORS ===================== */}
          {showWinds && (
            <g className="pointer-events-none opacity-80 animate-drift-winds">
              {/* Wind stream paths pointing SSW to NNE */}
              {[
                { x: 180, y: 460, dx: 30, dy: -60 },
                { x: 300, y: 470, dx: 30, dy: -60 },
                { x: 420, y: 485, dx: 25, dy: -60 },
                { x: 560, y: 480, dx: 30, dy: -60 },
                { x: 720, y: 440, dx: 35, dy: -60 },
                { x: 260, y: 260, dx: 25, dy: -55 },
                { x: 460, y: 220, dx: 25, dy: -50 },
                { x: 670, y: 280, dx: 25, dy: -50 },
              ].map((w, idx) => (
                <line
                  key={idx}
                  x1={w.x}
                  y1={w.y}
                  x2={w.x + w.dx}
                  y2={w.y + w.dy}
                  stroke="#0284C7"
                  strokeWidth="1.75"
                  strokeDasharray="4 3"
                  markerEnd="url(#windArrow)"
                />
              ))}
              <text x="730" y="480" fill="#0369A1" fontSize="10" fontWeight="600">
                SSW MONSOON • 14 KM/H
              </text>
            </g>
          )}

          {/* ===================== SENSOR NODES / STATIONS ===================== */}
          {showStations &&
            stations.map((station) => {
              // Convert coordinate percentages roughly to SVG width 920, height 540
              const cx = 100 + (station.coordinates.x / 100) * 720;
              const cy = 40 + (station.coordinates.y / 100) * 440;
              const band = getStatusBand(station.psi);
              const isHovered = hoveredStation?.id === station.id;

              return (
                <g
                  key={station.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectStation) onSelectStation(station);
                    onSelectRegion(station.region);
                  }}
                  onMouseEnter={() => setHoveredStation(station)}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  {/* Ping Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 14 : 9}
                    fill={band.color}
                    fillOpacity="0.25"
                    className="transition-all"
                  />
                  {/* Core Node Marker */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4.5}
                    fill={band.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                </g>
              );
            })}
        </svg>

        {/* Hovered Station Tooltip Card */}
        {hoveredStation && (
          <div
            className="absolute z-30 pointer-events-none bg-[#0F172A] text-white p-3 rounded-md shadow-xl text-xs w-64"
            style={{
              top: `${Math.min(320, 60 + (hoveredStation.coordinates.y / 100) * 260)}px`,
              left: `${Math.min(600, 40 + (hoveredStation.coordinates.x / 100) * 500)}px`,
            }}
          >
            <div className="flex items-center justify-between gap-1 mb-1 border-b border-slate-700 pb-1">
              <span className="font-semibold text-slate-100">{hoveredStation.name}</span>
              <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 py-0.5">
              <span>Telemetry Node ID:</span>
              <span className="font-mono text-slate-200">{hoveredStation.id}</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-300">24-hr PSI Reading:</span>
              <span className="font-bold text-white tabular-nums">
                {hoveredStation.psi} ({getStatusBand(hoveredStation.psi).name})
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-300">1-hr PM2.5 Concentration:</span>
              <span className="font-bold text-sky-300 tabular-nums">
                {hoveredStation.pm25} µg/m³
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
              Sensor: {hoveredStation.sensorModel} • {hoveredStation.lastTransmission}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#0F172A] uppercase tracking-wider text-[11px]">
            NEA Standard 24-hr PSI Bands:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#10B981]" />
            <span className="text-[#334155]">Good (0 – 50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#0EA5E9]" />
            <span className="text-[#334155]">Moderate (51 – 100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#F59E0B]" />
            <span className="text-[#334155]">Unhealthy (101 – 200)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#F97316]" />
            <span className="text-[#334155]">Very Unhealthy (201 – 300)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#EF4444]" />
            <span className="text-[#334155]">Hazardous (&gt; 300)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
