import React from 'react';
import { RegionReading } from '../types/airQuality';
import { getStatusBand } from '../data/mockData';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

interface BulletinReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  regionsData: Record<string, RegionReading>;
}

export const BulletinReportModal: React.FC<BulletinReportModalProps> = ({
  isOpen,
  onClose,
  regionsData,
}) => {
  if (!isOpen) return null;

  const national = regionsData['national'];
  const natBand = getStatusBand(national.psi24Hr);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-2xl max-w-2xl w-full my-8 overflow-hidden print:m-0 print:border-none print:shadow-none">
        {/* Modal Action Header (hidden in print) */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0EA5E9]" />
            <h3 className="text-sm font-bold text-[#0F172A]">
              Official National Air Quality Bulletin
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0F172A] text-white rounded hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document */}
        <div className="p-6 sm:p-8 space-y-6 text-[#0F172A]">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#0F172A] pb-4 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                REPUBLIC OF SINGAPORE
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
                NATIONAL ENVIRONMENT AGENCY
              </h1>
              <div className="text-xs text-[#475569]">
                Environmental Monitoring & Telemetry Division • Ambient Air Assessment Bureau
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-[#0F172A]">DAILY AIR QUALITY BULLETIN</div>
              <div className="text-[#64748B] text-[11px]">{national.lastUpdated}</div>
              <div className="text-[10px] text-[#94A3B8] font-mono">REF: NEA-AQB-2026-10</div>
            </div>
          </div>

          {/* National Executive Summary */}
          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: natBand.surface,
              borderColor: natBand.border,
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              National Consolidated Status
            </div>
            <div className="flex items-baseline gap-3 my-1">
              <span className="text-3xl font-bold tabular-nums" style={{ color: natBand.text }}>
                PSI {national.psi24Hr}
              </span>
              <span className="text-base font-bold" style={{ color: natBand.text }}>
                Band {natBand.level}: {natBand.name}
              </span>
            </div>
            <p className="text-xs text-[#334155]">{natBand.description}</p>
          </div>

          {/* 5-Region Telemetry Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Regional Readings Summary:
            </h4>
            <table className="w-full text-xs text-left border border-[#E2E8F0]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-semibold text-[#64748B]">
                <tr>
                  <th className="py-2 px-3">Region</th>
                  <th className="py-2 px-3">24-hr PSI</th>
                  <th className="py-2 px-3">1-hr PM2.5 (µg/m³)</th>
                  <th className="py-2 px-3">Status Band</th>
                  <th className="py-2 px-3">Surface Wind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {['north', 'south', 'east', 'west', 'central'].map((rId) => {
                  const reg = regionsData[rId];
                  const b = getStatusBand(reg.psi24Hr);
                  return (
                    <tr key={rId}>
                      <td className="py-2 px-3 font-semibold">{reg.name}</td>
                      <td className="py-2 px-3 tabular-nums font-bold" style={{ color: b.color }}>
                        {reg.psi24Hr}
                      </td>
                      <td className="py-2 px-3 tabular-nums font-medium">{reg.pm25OneHr}</td>
                      <td className="py-2 px-3">
                        <span className="text-[11px] font-semibold" style={{ color: b.text }}>
                          {b.name}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#64748B]">{reg.windDirection} • {reg.windSpeed} km/h</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Public Health Action Advisory */}
          <div className="space-y-1.5 text-xs text-[#334155] pt-2 border-t border-[#E2E8F0]">
            <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
              National Health Directive:
            </h4>
            <p>
              • <strong>General Healthy Population:</strong> Normal outdoor endurance sports and physical exertion are permitted.
            </p>
            <p>
              • <strong>Vulnerable Persons (Elderly, Pregnant, Children, Heart/Lung Disease):</strong> Monitor physical condition and minimize excessive outdoor exertion during mid-day heat.
            </p>
            <p className="text-[11px] text-[#64748B] pt-2">
              For real-time updates and hourly PM2.5 readings, consult the National Environment Agency official portal (www.nea.gov.sg) or phone hotline 1800-CALL NEA (1800-225-5632).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
