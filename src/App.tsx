/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  RegionId,
  ScenarioPreset,
  StationSensor,
  RegionReading,
} from './types/airQuality';
import {
  BASELINE_REGIONS,
  STATIONS,
  HOURLY_READINGS,
  FOUR_DAY_FORECAST,
  SCENARIO_PRESETS,
  getStatusBand,
} from './data/mockData';
import { civicAudio } from './utils/audio';

import { Header } from './components/Header';
import { RegionPills } from './components/RegionPills';
import { AdvisoryBanner } from './components/AdvisoryBanner';
import { OverviewDashboard } from './components/OverviewDashboard';
import { SingaporeMap } from './components/SingaporeMap';
import { ForecastTrends } from './components/ForecastTrends';
import { HealthAdvisory } from './components/HealthAdvisory';
import { SensorNetwork } from './components/SensorNetwork';
import { AlertSubscribeModal } from './components/AlertSubscribeModal';
import { BulletinReportModal } from './components/BulletinReportModal';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('national');
  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>('good');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isBulletinOpen, setIsBulletinOpen] = useState<boolean>(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState<boolean>(false);
  const [searchNotification, setSearchNotification] = useState<string | null>(null);

  const scenarioConfig = SCENARIO_PRESETS[currentScenario];

  // Scale region readings according to current scenario
  const scaledRegionsData = useMemo(() => {
    const mult = scenarioConfig.multiplier;
    const result: Record<string, RegionReading> = {};

    Object.keys(BASELINE_REGIONS).forEach((key) => {
      const base = BASELINE_REGIONS[key];
      const scaledPsi = Math.min(420, Math.round(base.psi24Hr * mult));
      const scaledPm25OneHr = Math.min(360, Math.round(base.pm25OneHr * mult));
      const scaledPm2524Hr = Math.min(320, Math.round(base.pm25TwentyFourHr * mult));
      const scaledPm10 = Math.min(450, Math.round(base.pm10TwentyFourHr * mult));

      result[key] = {
        ...base,
        psi24Hr: scaledPsi,
        pm25OneHr: scaledPm25OneHr,
        pm25TwentyFourHr: scaledPm2524Hr,
        pm10TwentyFourHr: scaledPm10,
        trend: mult > 2.0 ? 'rising' : mult < 1.2 ? 'falling' : 'stable',
      };
    });

    return result;
  }, [scenarioConfig]);

  // Scale station readings
  const scaledStations = useMemo(() => {
    const mult = scenarioConfig.multiplier;
    return STATIONS.map((s) => ({
      ...s,
      psi: Math.min(420, Math.round(s.psi * mult)),
      pm25: Math.min(360, Math.round(s.pm25 * mult)),
    }));
  }, [scenarioConfig]);

  // Handle scenario switch with sound
  const handleSelectScenario = (scen: ScenarioPreset) => {
    setCurrentScenario(scen);
    if (scen === 'hazardous' || scen === 'very_unhealthy') {
      civicAudio.playNotification('alert');
    } else if (scen === 'unhealthy') {
      civicAudio.playNotification('warning');
    } else {
      civicAudio.playNotification('info');
    }
  };

  // Toggle audio
  const handleToggleAudio = () => {
    const nextState = !isAudioOn;
    setIsAudioOn(nextState);
    civicAudio.setEnabled(nextState);
    if (nextState) {
      civicAudio.playNotification('info');
    }
  };

  // Search logic
  const handleSearchSelect = (query: string) => {
    const q = query.toLowerCase();
    let targetRegion: RegionId | null = null;
    let matchDescription = '';

    if (q.includes('woodland') || q.includes('yishun') || q.includes('sembawang') || q.includes('mandai') || q.startsWith('73') || q.startsWith('76')) {
      targetRegion = 'north';
      matchDescription = `Located in Northern Sector: Matched "${query}"`;
    } else if (q.includes('jurong') || q.includes('tuas') || q.includes('clementi') || q.includes('boon lay') || q.startsWith('60') || q.startsWith('63') || q.startsWith('12')) {
      targetRegion = 'west';
      matchDescription = `Located in Western Sector: Matched "${query}"`;
    } else if (q.includes('bedok') || q.includes('tampines') || q.includes('changi') || q.includes('pasir ris') || q.startsWith('46') || q.startsWith('52') || q.startsWith('81')) {
      targetRegion = 'east';
      matchDescription = `Located in Eastern Sector: Matched "${query}"`;
    } else if (q.includes('marina') || q.includes('sentosa') || q.includes('telok') || q.includes('tanjong') || q.startsWith('01') || q.startsWith('09') || q.startsWith('08')) {
      targetRegion = 'south';
      matchDescription = `Located in Southern Sector: Matched "${query}"`;
    } else if (q.includes('bishan') || q.includes('ang mo kio') || q.includes('orchard') || q.includes('toa payoh') || q.startsWith('56') || q.startsWith('24') || q.startsWith('31')) {
      targetRegion = 'central';
      matchDescription = `Located in Central Sector: Matched "${query}"`;
    } else {
      targetRegion = 'national';
      matchDescription = `General islandwide query: "${query}"`;
    }

    if (targetRegion) {
      setSelectedRegion(targetRegion);
      setSearchNotification(matchDescription);
      setTimeout(() => setSearchNotification(null), 3500);
    }
  };

  const currentNationalReading = scaledRegionsData['national'];
  const activeNationalBand = getStatusBand(currentNationalReading.psi24Hr);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0EA5E9]/20">
      {/* Top Header */}
      <Header
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        onOpenBulletin={() => setIsBulletinOpen(true)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onSearchSelect={handleSearchSelect}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-6 space-y-5">
        {/* Search match toast feedback */}
        {searchNotification && (
          <div className="p-3 bg-sky-50 border border-sky-200 text-sky-900 rounded-md text-xs font-medium flex items-center justify-between animate-in fade-in">
            <span>{searchNotification}</span>
            <button
              onClick={() => setSearchNotification(null)}
              className="text-sky-700 hover:text-sky-900 font-bold ml-2 text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Region Selector Pills */}
        <div className="flex items-center justify-between gap-4">
          <RegionPills
            selectedRegion={selectedRegion}
            onSelectRegion={(id) => {
              setSelectedRegion(id);
              civicAudio.playNotification('click');
            }}
            regionsData={scaledRegionsData}
          />
        </div>

        {/* Civic Advisory Banner */}
        <AdvisoryBanner
          band={activeNationalBand}
          headline={scenarioConfig.headline}
          onViewDetails={() => setActiveTab('health')}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <OverviewDashboard
            selectedRegion={selectedRegion}
            regionsData={scaledRegionsData}
            onSelectRegion={(id) => {
              setSelectedRegion(id);
              civicAudio.playNotification('click');
            }}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              civicAudio.playNotification('click');
            }}
          />
        )}

        {activeTab === 'map' && (
          <SingaporeMap
            selectedRegion={selectedRegion}
            onSelectRegion={(id) => {
              setSelectedRegion(id);
              civicAudio.playNotification('click');
            }}
            regionsData={scaledRegionsData}
            stations={scaledStations}
            onSelectStation={(station) => {
              setSelectedRegion(station.region);
              civicAudio.playNotification('click');
            }}
          />
        )}

        {activeTab === 'trends' && (
          <ForecastTrends
            hourlyData={HOURLY_READINGS}
            forecastData={FOUR_DAY_FORECAST}
            scenarioMultiplier={scenarioConfig.multiplier}
          />
        )}

        {activeTab === 'health' && (
          <HealthAdvisory
            currentPsi={currentNationalReading.psi24Hr}
            currentPm25={currentNationalReading.pm25OneHr}
            currentBand={activeNationalBand}
          />
        )}

        {activeTab === 'sensors' && (
          <SensorNetwork
            stations={scaledStations}
            onSelectStation={(station) => {
              setSelectedRegion(station.region);
              setActiveTab('overview');
              civicAudio.playNotification('click');
            }}
          />
        )}
      </main>

      {/* Official Civic Footer */}
      <footer className="mt-12 bg-white border-t border-[#E2E8F0] text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-xs bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
                  CA
                </span>
                <span className="font-bold text-[#0F172A]">CIVIC ATMOS</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#64748B]">
                Republic of Singapore National Air Quality Telemetry & Environmental Telemetry Network.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-[#0F172A] text-xs">Emergency Hotlines</div>
              <div className="text-[11px] text-[#475569]">NEA Call Centre: 1800-CALL NEA (1800-225-5632)</div>
              <div className="text-[11px] text-[#475569]">Singapore Civil Defence Force (SCDF): 995</div>
              <div className="text-[11px] text-[#475569]">MOH HealthLine: 1800-223-1313</div>
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-[#0F172A] text-xs">Methodology & Standards</div>
              <div className="text-[11px] text-[#475569]">Singapore 24-hr PSI Standard (SS 587)</div>
              <div className="text-[11px] text-[#475569]">WHO Global Air Quality Guidelines (2021)</div>
              <div className="text-[11px] text-[#475569]">ASEAN Specialised Meteorological Centre (ASMC)</div>
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-[#0F172A] text-xs">Civic Transparency</div>
              <div className="text-[11px] text-[#475569]">Open Government Data Licence v1.2</div>
              <div className="text-[11px] text-[#475569]">Continuous Telemetry Calibration Protocol</div>
              <div className="text-[11px] text-[#475569]">GovTech Civic Digital Service Standard</div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#94A3B8]">
            <div>
              © 2026 Government of Singapore • National Environment Agency. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-[#0F172A] cursor-pointer">Privacy Statement</span>
              <span>•</span>
              <span className="hover:text-[#0F172A] cursor-pointer">Terms of Use</span>
              <span>•</span>
              <span className="hover:text-[#0F172A] cursor-pointer">Rate This Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AlertSubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />

      <BulletinReportModal
        isOpen={isBulletinOpen}
        onClose={() => setIsBulletinOpen(false)}
        regionsData={scaledRegionsData}
      />
    </div>
  );
}
