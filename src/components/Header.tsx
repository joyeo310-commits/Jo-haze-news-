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
  SunMedium,
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
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-rose-200/80 sticky top-0 z-40 shadow-xs">
      {/* Top Civic Authenticity Bar with Summer Rose Tint */}
      <div className="bg-[#1E1124] text-rose-200/90 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-rose-950">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          {/* Singapore Flag / Crest Dot */}
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50 shrink-0" />
          <span className="font-semibold text-rose-100">
            A Singapore Government Agency Website
          </span>
          <span className="hidden sm:inline text-rose-300/80">
            • Official NEA National Air Quality & Environmental Telemetry
          </span>
          <span className="ml-auto hidden md:inline text-rose-300/70 text-[10px] flex items-center gap-1">
            <SunMedium className="w-3 h-3 text-rose-400" />
            Summer Monsoon Season • 24-hr PSI Standard
          </span>
        </div>
      </div>

      {/* Main Header Container with subtle summer pink glow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 bg-gradient-to-r from-rose-50/40 via-white to-pink-50/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Brand Identity: Hey Haze */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Summer Pink Gradient Badge */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center font-extrabold text-lg tracking-wider shadow-md shadow-rose-500/25 relative group">
                <span className="drop-shadow-xs">HH</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1E1124] flex items-center gap-1.5">
                    Hey Haze
                    <span className="text-rose-500">✨</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100/90 text-rose-800 border border-rose-300/80 shadow-2xs">
                    Summer Edition
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  National Environmental Air Telemetry • Singapore
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                onClick={onToggleAudio}
                className="p-2 rounded text-rose-700 hover:bg-rose-100/60"
                title={isAudioOn ? 'Mute Chimes' : 'Enable Chimes'}
              >
                {isAudioOn ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenSubscribe}
                className="p-2 rounded text-rose-700 hover:bg-rose-100/60"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center-Right Controls: Telemetry Status, Scenario Switcher, Bulletins */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live-Update Status Indicator with Rosy Accent */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF1F2] border border-rose-200 text-xs shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="font-bold text-rose-900 text-[11px] tracking-wide uppercase">
                LIVE NEA FEED • UPDATED 2 MINS AGO
              </span>
              <button
                onClick={handleRefresh}
                className={`text-rose-600 hover:text-rose-900 transition-transform ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                title="Force refresh telemetry"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Scenario Preset Selector */}
            <div className="inline-flex items-center gap-1.5 bg-white border border-rose-200/90 p-1 rounded-md shadow-2xs">
              <span className="text-[11px] font-bold text-rose-800/80 px-1.5 hidden sm:inline flex items-center gap-1">
                <span>Scenario:</span>
              </span>
              <select
                value={currentScenario}
                onChange={(e) => {
                  const val = e.target.value as ScenarioPreset;
                  onSelectScenario(val);
                }}
                className="text-xs font-semibold text-[#1E1124] bg-transparent focus:outline-none cursor-pointer py-0.5"
              >
                <option value="good">1. Clear Oceanic (Good • PSI ~44)</option>
                <option value="moderate">2. Summer Afternoon (Moderate • PSI ~72)</option>
                <option value="unhealthy">3. Transboundary Haze (Unhealthy • PSI ~138)</option>
                <option value="very_unhealthy">4. Dense Plume Surge (Very Unhealthy • PSI ~235)</option>
                <option value="hazardous">5. Emergency Crisis (Hazardous • PSI ~345)</option>
              </select>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded-md border text-xs transition-colors ${
                  isAudioOn
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-rose-50/50'
                }`}
                title={isAudioOn ? 'Mute civic audio alerts' : 'Enable audio alerts'}
              >
                {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={onOpenBulletin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1E1124] bg-white border border-rose-200 rounded-md hover:bg-rose-50/60 transition-colors shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>Bulletin</span>
              </button>

              <button
                onClick={onOpenSubscribe}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-md transition-all shadow-xs shadow-rose-500/20"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Haze Alerts</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Quick Township Chips with Summer Rose Styling */}
        <div className="mt-3.5 pt-3 border-t border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-rose-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search postal code (e.g. 738600), landmark or town..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-20 py-1.5 text-xs border border-rose-200 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-400 bg-white text-[#1E1124] placeholder-rose-300"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1 px-2.5 py-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-[11px] font-semibold rounded transition-colors shadow-2xs"
            >
              Locate
            </button>
          </form>

          {/* Quick Town Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-[#64748B] py-0.5">
            <span className="font-semibold text-rose-900 shrink-0">Popular:</span>
            {['Woodlands', 'Jurong', 'Marina Bay', 'Bedok', 'Bishan', 'Changi'].map((town) => (
              <button
                key={town}
                type="button"
                onClick={() => {
                  setSearchVal(town);
                  onSearchSelect(town);
                }}
                className="px-2 py-0.5 rounded-full bg-rose-50/80 hover:bg-rose-100 text-rose-900 border border-rose-200/60 whitespace-nowrap transition-colors"
              >
                {town}
              </button>
            ))}
          </div>
        </div>

        {/* Primary View Tabs */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto border-b border-rose-200 pb-px">
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
                    ? 'border-rose-600 text-rose-700 font-bold'
                    : 'border-transparent text-slate-600 hover:text-rose-600 hover:border-rose-300'
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
