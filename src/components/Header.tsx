import React, { useState } from 'react';
import { ScenarioPreset } from '../types/airQuality';
import { SCENARIO_PRESETS } from '../data/mockData';
import { civicAudio } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  FileText,
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  currentScenario: ScenarioPreset;
  onSelectScenario: (scen: ScenarioPreset) => void;
  onOpenBulletin: () => void;
  onOpenSubscribe: () => void;
  onSearchSelect: (query: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  onSelectScenario,
  onOpenBulletin,
  onOpenSubscribe,
  onSearchSelect,
  activeTab,
  onSelectTab,
  isAudioOn,
  onToggleAudio,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    civicAudio.playNotification('click');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearchSelect(searchVal.trim());
      civicAudio.playNotification('click');
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Regional Dashboard' },
    { id: 'map', label: 'Interactive National Map' },
    { id: 'trends', label: '24h Trends & 4-Day Outlook' },
    { id: 'health', label: 'Public Health Advisory' },
    { id: 'sensors', label: 'Sensor Network & Open API' },
  ];

  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-xs">
      {/* Top Civic Authenticity Bar */}
      <div className="bg-[#0F172A] text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          {/* Singapore Flag / Crest Dot */}
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span className="font-semibold text-slate-200">
            A Singapore Government Agency Website
          </span>
          <span className="hidden sm:inline text-slate-400">
            • Official NEA National Air Quality & Environmental Telemetry
          </span>
          <span className="ml-auto hidden md:inline text-slate-400 text-[10px]">
            Security Verified • 24-hr PSI Standard
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Civic Crest Badge */}
              <div className="w-10 h-10 rounded-sm bg-[#0F172A] text-white flex items-center justify-center font-bold text-lg tracking-wider shadow-xs">
                CA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0F172A]">
                    CIVIC ATMOS
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                    GovTech Standard
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  National Environment Agency Telemetry System
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                onClick={onToggleAudio}
                className="p-2 rounded text-[#64748B] hover:bg-slate-100"
                title={isAudioOn ? 'Mute Chimes' : 'Enable Chimes'}
              >
                {isAudioOn ? <Volume2 className="w-4 h-4 text-[#0EA5E9]" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenSubscribe}
                className="p-2 rounded text-[#64748B] hover:bg-slate-100"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center-Right Controls: Telemetry Status, Scenario Switcher, Bulletins */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live-Update Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-bold text-emerald-900 text-[11px] tracking-wide uppercase">
                LIVE NEA FEED • UPDATED 2 MINS AGO
              </span>
              <button
                onClick={handleRefresh}
                className={`text-emerald-700 hover:text-emerald-900 transition-transform ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                title="Force refresh telemetry"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Scenario Preset Selector */}
            <div className="inline-flex items-center gap-1.5 bg-[#F8FAFC] border border-[#CBD5E1] p-1 rounded">
              <span className="text-[11px] font-bold text-[#64748B] px-1.5 hidden sm:inline">
                Atmospheric Scenario:
              </span>
              <select
                value={currentScenario}
                onChange={(e) => {
                  const val = e.target.value as ScenarioPreset;
                  onSelectScenario(val);
                }}
                className="text-xs font-semibold text-[#0F172A] bg-transparent focus:outline-none cursor-pointer py-0.5"
              >
                <option value="good">1. Clear Oceanic (Good • PSI ~44)</option>
                <option value="moderate">2. Urban Afternoon (Moderate • PSI ~72)</option>
                <option value="unhealthy">3. Transboundary Haze (Unhealthy • PSI ~138)</option>
                <option value="very_unhealthy">4. Dense Plume Surge (Very Unhealthy • PSI ~235)</option>
                <option value="hazardous">5. Emergency Crisis (Hazardous • PSI ~345)</option>
              </select>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded border text-xs transition-colors ${
                  isAudioOn
                    ? 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]'
                    : 'border-[#CBD5E1] bg-white text-[#64748B] hover:bg-slate-50'
                }`}
                title={isAudioOn ? 'Mute civic audio alerts' : 'Enable audio alerts'}
              >
                {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={onOpenBulletin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] bg-white border border-[#CBD5E1] rounded hover:bg-[#F8FAFC] transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Bulletin</span>
              </button>

              <button
                onClick={onOpenSubscribe}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F172A] rounded hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Haze Alerts</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Quick Township Chips */}
        <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search postal code (e.g. 738600), landmark or town..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-20 py-1.5 text-xs border border-[#CBD5E1] rounded focus:outline-none focus:border-[#0284C7] bg-white text-[#0F172A] placeholder-[#94A3B8]"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1 px-2.5 py-1 bg-[#0F172A] text-white text-[11px] font-semibold rounded hover:bg-slate-800 transition-colors"
            >
              Locate
            </button>
          </form>

          {/* Quick Town Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-[#64748B] py-0.5">
            <span className="font-semibold text-[#0F172A] shrink-0">Popular:</span>
            {['Woodlands', 'Jurong', 'Marina Bay', 'Bedok', 'Bishan', 'Changi'].map((town) => (
              <button
                key={town}
                type="button"
                onClick={() => {
                  setSearchVal(town);
                  onSearchSelect(town);
                }}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[#334155] whitespace-nowrap transition-colors"
              >
                {town}
              </button>
            ))}
          </div>
        </div>

        {/* Primary View Tabs */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto border-b border-[#E2E8F0] pb-px">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  civicAudio.playNotification('click');
                }}
                className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap select-none ${
                  isActive
                    ? 'border-[#0F172A] text-[#0F172A]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
