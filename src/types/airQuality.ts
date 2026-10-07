export type RegionId = 'national' | 'north' | 'south' | 'east' | 'west' | 'central';

export type StatusBandLevel = 1 | 2 | 3 | 4 | 5;

export interface StatusBandInfo {
  level: StatusBandLevel;
  name: string;
  psiRange: string;
  pm25Range: string;
  color: string; // primary alert color
  surface: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  actionSummary: string;
}

export interface RegionReading {
  id: RegionId;
  name: string;
  label: string;
  psi24Hr: number;
  pm25OneHr: number; // µg/m³
  pm25TwentyFourHr: number; // µg/m³
  pm10TwentyFourHr: number; // µg/m³
  o3EightHr: number; // µg/m³
  no2OneHr: number; // µg/m³
  so2TwentyFourHr: number; // µg/m³
  coEightHr: number; // mg/m³
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string; // e.g., 'SSW'
  windDegrees: number;
  uvIndex: number;
  lastUpdated: string;
  trend: 'rising' | 'falling' | 'stable';
  towns: string[];
}

export interface StationSensor {
  id: string;
  name: string;
  region: RegionId;
  postalCode: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  psi: number;
  pm25: number;
  status: 'ONLINE' | 'CALIBRATING' | 'MAINTENANCE';
  sensorModel: string;
  uptime30d: number;
  lastTransmission: string;
}

export interface HourlyReading {
  hour: string; // "00:00", "01:00", etc.
  psi: number;
  pm25: number;
  temperature: number;
  humidity: number;
}

export interface DayForecast {
  date: string;
  dayName: string;
  psiMin: number;
  psiMax: number;
  expectedBand: StatusBandLevel;
  weatherCondition: 'Sunny' | 'Partly Cloudy' | 'Passing Showers' | 'Thundery Showers' | 'Hazy';
  windSummary: string;
  rainProbability: number;
}

export interface HealthGuideline {
  group: 'Healthy Persons' | 'Elderly & Pregnant' | 'Children & Youths' | 'Chronic Heart/Lung' | 'Outdoor Workers';
  icon: string;
  bandGuidance: Record<StatusBandLevel, {
    canOutdoor: boolean;
    levelText: string;
    actionDetail: string;
  }>;
}

export type ScenarioPreset = 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
