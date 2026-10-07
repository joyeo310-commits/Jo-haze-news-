import React, { useState } from 'react';
import { StationSensor, RegionId } from '../types/airQuality';
import { getStatusBand } from '../data/mockData';
import {
  Radio,
  Code,
  Copy,
  Check,
  Download,
  Filter,
  CheckCircle2,
  Cpu,
  Search,
} from 'lucide-react';

interface SensorNetworkProps {
  stations: StationSensor[];
  onSelectStation: (station: StationSensor) => void;
}

export const SensorNetwork: React.FC<SensorNetworkProps> = ({
  stations,
  onSelectStation,
}) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStations = stations.filter((s) => {
    const matchesRegion = filterRegion === 'all' || s.region === filterRegion;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.postalCode.includes(searchTerm) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Simulated live API response payload matching data.gov.sg schema
  const simulatedApiResponse = {
    api_version: 'v2.1-civic',
    agency: 'Hey Haze Telemetry Core (NEA)',
    timestamp: new Date().toISOString(),
    region_metadata: [
      { name: 'west', label_location: { latitude: 1.3573, longitude: 103.7 } },
      { name: 'east', label_location: { latitude: 1.3571, longitude: 103.94 } },
      { name: 'central', label_location: { latitude: 1.3573, longitude: 103.82 } },
      { name: 'south', label_location: { latitude: 1.2958, longitude: 103.82 } },
      { name: 'north', label_location: { latitude: 1.418, longitude: 103.82 } },
      { name: 'national', label_location: { latitude: 1.3521, longitude: 103.8198 } },
    ],
    items: [
      {
        timestamp: new Date().toISOString(),
        update_timestamp: new Date().toISOString(),
        readings: {
          psi_twenty_four_hourly: {
            west: 49,
            national: 44,
            east: 39,
            central: 43,
            south: 48,
            north: 42,
          },
          pm25_one_hourly: {
            west: 15,
            national: 11,
            east: 9,
            central: 11,
            south: 14,
            north: 10,
          },
          pm25_twenty_four_hourly: {
            west: 14,
            national: 12,
            east: 10,
            central: 12,
            south: 13,
            north: 11,
          },
          pm10_twenty_four_hourly: {
            west: 33,
            national: 28,
            east: 24,
            central: 27,
            south: 31,
            north: 26,
          },
          so2_twenty_four_hourly: {
            west: 11,
            national: 7,
            east: 5,
            central: 7,
            south: 9,
            north: 6,
          },
          co_eight_hour_max: {
            west: 0.8,
            national: 0.6,
            east: 0.5,
            central: 0.6,
            south: 0.7,
            north: 0.5,
          },
          o3_eight_hour_max: {
            west: 38,
            national: 34,
            east: 29,
            central: 33,
            south: 36,
            north: 32,
          },
          no2_one_hour_max: {
            west: 24,
            national: 18,
            east: 14,
            central: 19,
            south: 22,
            north: 16,
          },
        },
      },
    ],
  };

  const jsonString = JSON.stringify(simulatedApiResponse, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nea_air_quality_telemetry_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Station Telemetry Directory */}
      <div className="bg-white rounded-lg border border-rose-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-rose-200/80 bg-rose-50/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1E1124] flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500" />
              Hey Haze Continuous Ambient Monitoring Stations (CAMS)
            </h2>
            <p className="text-xs text-[#64748B]">
              Real-time hardware status, sensor calibration, and telemetry links
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search station or postal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-rose-200 rounded-md w-48 sm:w-56 focus:outline-none focus:border-rose-500 bg-white text-[#1E1124]"
              />
            </div>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-2.5 py-1 text-xs border border-rose-200 rounded-md bg-white text-[#334155] focus:outline-none"
            >
              <option value="all">All Sectors</option>
              <option value="north">North Sector</option>
              <option value="south">South Sector</option>
              <option value="east">East Sector</option>
              <option value="west">West Sector</option>
              <option value="central">Central Sector</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-rose-50/50 border-b border-rose-200/80 text-rose-950 font-semibold">
                <th className="py-2.5 px-4">Node ID</th>
                <th className="py-2.5 px-4">Station Name</th>
                <th className="py-2.5 px-4">Sector</th>
                <th className="py-2.5 px-4">Postal Code</th>
                <th className="py-2.5 px-4">Sensor Model</th>
                <th className="py-2.5 px-4">30-Day Uptime</th>
                <th className="py-2.5 px-4">Live PSI</th>
                <th className="py-2.5 px-4">Telemetry Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50 font-normal text-[#1E1124]">
              {filteredStations.map((station) => {
                const band = getStatusBand(station.psi);
                return (
                  <tr
                    key={station.id}
                    onClick={() => onSelectStation(station)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-[#0284C7]">
                      {station.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      {station.name}
                    </td>
                    <td className="py-3 px-4 uppercase text-[#64748B] font-medium">
                      {station.region}
                    </td>
                    <td className="py-3 px-4 text-[#64748B] font-mono">
                      {station.postalCode}
                    </td>
                    <td className="py-3 px-4 text-[#334155]">
                      {station.sensorModel}
                    </td>
                    <td className="py-3 px-4 tabular-nums font-semibold text-emerald-700">
                      {station.uptime30d}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="font-bold tabular-nums px-2 py-0.5 rounded text-[11px]"
                        style={{
                          backgroundColor: band.surface,
                          color: band.text,
                          border: `1px solid ${band.border}`,
                        }}
                      >
                        {station.psi} ({band.name})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {station.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open Government Data API Inspector */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Code className="w-4 h-4 text-[#0EA5E9]" />
              Open Data API Feed Inspector (data.gov.sg Schema)
            </h3>
            <p className="text-xs text-[#64748B]">
              Standardized programmatic endpoint for civic developers, research institutes & civil defense
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#CBD5E1] rounded hover:bg-slate-50 transition-colors text-[#0F172A]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0F172A] text-white rounded hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Schema</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#0F172A] text-slate-200 font-mono text-xs overflow-x-auto max-h-80 scrollbar-thin">
          <pre>{jsonString}</pre>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-xs text-[#475569] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0284C7]" />
            <span>Endpoint: <code>GET https://api.data.gov.sg/v1/environment/psi</code></span>
          </div>
          <span className="text-[11px] text-[#64748B]">
            Complies with Singapore Open Data Licence • Real-time 5-minute synchronization
          </span>
        </div>
      </div>
    </div>
  );
};
