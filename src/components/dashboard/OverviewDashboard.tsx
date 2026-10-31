/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Trees,
  Grid,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CloudLightning,
  CloudSun,
  Wind,
  Droplets,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Compass,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  Farm,
  Plot,
  CropRow,
  LiveWeatherData,
  AlertItem,
  ActivityRecord,
  IoTDevice,
  CanopySystem,
  LongitudinalSection,
  NavTab,
} from '../../types';
import { db } from '../../services/storage';
import { TRANSLATIONS } from '../../services/i18n';

interface OverviewDashboardProps {
  activeFarm: Farm | undefined;
  allFarms: Farm[];
  plots: Plot[];
  rows: CropRow[];
  devices: IoTDevice[];
  alerts: AlertItem[];
  activities: ActivityRecord[];
  canopySystems: CanopySystem[];
  weather: LiveWeatherData | null;
  onNavigate: (tab: NavTab, plotId?: string) => void;
  onExecuteDeployCanopy: () => void;
  onExecuteRetractCanopy: () => void;
  currentLang?: 'en' | 'mr' | 'hi';
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  activeFarm,
  allFarms,
  plots,
  rows,
  devices,
  alerts,
  activities,
  canopySystems,
  weather,
  onNavigate,
  onExecuteDeployCanopy,
  onExecuteRetractCanopy,
  currentLang = 'en',
}) => {
  const currentUser = db.getCurrentUser();
  const t = TRANSLATIONS[currentLang];

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? t.greetingMorning
      : currentHour < 17
      ? t.greetingAfternoon
      : t.greetingEvening;

  // 1. Total Farms
  const totalFarmsCount = allFarms.length;
  const totalAcres = allFarms.reduce((sum, f) => sum + (f.totalAreaAcres || 0), 0);

  // 2. Total Protected Plots
  const farmPlots = plots.filter((p) => p.farmId === activeFarm?.id);
  const protectedPlots = farmPlots.filter((p) => p.canopyInstalled);
  const totalProtectedAcres = protectedPlots.reduce((sum, p) => sum + (p.areaAcres || 0), 0);

  // 3. Canopy Status
  const farmSections: LongitudinalSection[] = db
    .getSections()
    .filter((s) => farmPlots.some((p) => p.id === s.plotId));
  const deployedSections = farmSections.filter((s) => s.positionPercent >= 80);
  const retractedSections = farmSections.filter((s) => s.positionPercent < 20);
  const movingSections = farmSections.filter((s) => s.motionState === 'deploying' || s.motionState === 'retracting');
  const faultSections = farmSections.filter((s) => s.motionState === 'fault');

  // Last operation timestamp from commands or sections
  const recentCommands = db.getCommands();
  const lastOp = recentCommands[0]?.createdAt || farmSections[0]?.lastOperationTime;
  const lastOpFormatted = lastOp
    ? new Date(lastOp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ', ' +
      new Date(lastOp).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : t.noData;

  // 4. Current Weather Risk
  const hailRisk = weather?.hailRiskScore || 'LOW';
  const hailRiskText =
    hailRisk === 'CRITICAL'
      ? t.critical
      : hailRisk === 'HIGH'
      ? t.high
      : hailRisk === 'MODERATE'
      ? t.moderate
      : t.low;

  const hailRiskCardColor = {
    LOW: 'text-emerald-800 bg-emerald-50/70 border-emerald-200',
    MODERATE: 'text-amber-800 bg-amber-50/70 border-amber-200',
    HIGH: 'text-orange-800 bg-orange-50/70 border-orange-200',
    CRITICAL: 'text-rose-800 bg-rose-50 border-rose-300 font-bold',
  }[hailRisk];

  // Wind speed & safety threshold
  const windSpeed = weather?.windSpeedKmh ?? 0;
  const isHighWind = windSpeed > 35;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-30_at_8.59.20_AM_bf57edc3.jpeg"
              alt="KhetKavach Logo"
              className="w-14 h-14 object-contain rounded-xl border border-stone-200/90 bg-white p-1 shadow-2xs shrink-0 hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  {activeFarm?.name || 'My Farm'} • {activeFarm?.taluka}, {activeFarm?.district}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
                {greeting}, {currentUser.name}
              </h1>
              <p className="text-stone-600 text-sm mt-1 max-w-xl">
                Protection for Every Harvest • {t.latestUpdateSub}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={onExecuteDeployCanopy}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t.deployCanopy}</span>
            </button>
            <button
              onClick={onExecuteRetractCanopy}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 shadow-2xs transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <RotateCcw className="w-4 h-4 text-stone-500" />
              <span>{t.retractCanopy}</span>
            </button>
            <button
              onClick={() => onNavigate('weather')}
              className="col-span-2 sm:col-span-1 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>{t.viewWeather}</span>
            </button>
          </div>
        </div>

        {/* Soft background aura */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-emerald-50/80 to-transparent pointer-events-none" />
      </div>

      {/* 4 Summary Cards - 2x2 on Mobile, 4x1 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Farms */}
        <div
          onClick={() => onNavigate('farms')}
          className="bg-white p-3.5 sm:p-5 rounded-xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">
              {t.totalFarms}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0">
              <Trees className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums">
              {totalFarmsCount}
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
              {totalAcres.toFixed(1)} {t.acres}
            </p>
          </div>
        </div>

        {/* 2. Total Protected Plots */}
        <div
          onClick={() => onNavigate('plots')}
          className="bg-white p-3.5 sm:p-5 rounded-xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">
              {t.protectedPlots}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0">
              <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums">
              {protectedPlots.length}/{farmPlots.length}
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
              {totalProtectedAcres.toFixed(1)} {t.acres} protected
            </p>
          </div>
        </div>

        {/* 3. Canopy Status */}
        <div
          onClick={() => onNavigate('canopy')}
          className="bg-white p-3.5 sm:p-5 rounded-xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">
              {t.canopyStatus}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums truncate">
              {deployedSections.length} Deployed
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
              {retractedSections.length} retracted • {farmSections.length} total
            </p>
          </div>
        </div>

        {/* 4. Current Weather Risk */}
        <div
          onClick={() => onNavigate('weather')}
          className={`p-3.5 sm:p-5 rounded-xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between ${hailRiskCardColor}`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider truncate">
              {t.weatherRisk}
            </span>
            <CloudLightning className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums truncate">
              {hailRiskText}
            </div>
            <p className="text-[11px] sm:text-xs opacity-80 mt-0.5 truncate">
              {windSpeed} km/h • {isHighWind ? 'Lockout' : 'Safe'}
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Weather Module & Overhead Canopy Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Overhead Canopy System View */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                  <span>Overhead Canopy Netting Overview</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Overhead retractable hail netting suspended on tension cables above crop rows
                </p>
              </div>
              <button
                onClick={() => onNavigate('canopy')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>Control Deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Overhead Net Representation */}
            <div className="mt-4 p-4 rounded-xl bg-[#f8faf7] border border-stone-200/80">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-3">
                <span className="font-semibold text-stone-800">
                  {farmSections.length > 0 ? `${farmSections.length} Parallel Longitudinal Sections` : t.noData}
                </span>
                <span className="text-[11px] text-stone-500">
                  Last operation: <strong className="text-stone-700">{lastOpFormatted}</strong>
                </span>
              </div>

              {/* Section Rows Visualization */}
              <div className="space-y-3">
                {farmSections.slice(0, 3).map((sec) => {
                  const isDeployed = sec.positionPercent >= 80;
                  const isRetracted = sec.positionPercent <= 20;
                  return (
                    <div
                      key={sec.id}
                      className="bg-white p-3 rounded-lg border border-stone-200/90 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span className="font-semibold text-stone-900">{sec.name}</span>
                          <span className="text-[10px] text-stone-400">
                            (Rows {sec.assignedRowNumbers.join(', ')})
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isDeployed
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isRetracted
                              ? 'bg-stone-100 text-stone-700 border border-stone-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isDeployed
                            ? t.deployed
                            : isRetracted
                            ? t.retracted
                            : `${sec.positionPercent}% Deployed`}
                        </span>
                      </div>

                      {/* Cable & Net Deployment Track Graphic */}
                      <div className="relative h-3 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="h-full bg-emerald-700 transition-all duration-500 rounded-full"
                          style={{ width: `${sec.positionPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-600 mt-1 font-mono">
                        <span>Headpost Parking (0%)</span>
                        <span>{sec.lengthMeters}m Cable Span</span>
                        <span>Tailpost Anchor (100%)</span>
                      </div>
                    </div>
                  );
                })}

                {farmSections.length === 0 && (
                  <div className="p-6 text-center text-xs text-stone-600">
                    {t.noData}. Install or assign canopy sections in Plot Settings.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Summary Counters */}
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50/70 text-emerald-900 border border-emerald-100">
              <span className="block text-lg font-bold">{deployedSections.length}</span>
              <span className="text-[11px] text-stone-600">{t.deployed}</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-100 text-stone-800 border border-stone-200">
              <span className="block text-lg font-bold">{retractedSections.length}</span>
              <span className="text-[11px] text-stone-600">{t.retracted}</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50/70 text-amber-900 border border-amber-100">
              <span className="block text-lg font-bold">{faultSections.length}</span>
              <span className="text-[11px] text-stone-600">Need Attention</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Weather & Microclimate */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-amber-600" />
                  <span>Farm Microclimate & Weather</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {weather?.locationName || `${activeFarm?.taluka}, Nashik`}
                </p>
              </div>
              <button
                onClick={() => onNavigate('weather')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>Full Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {weather ? (
              <div className="mt-4 space-y-4">
                {/* Main Temperature & Condition Glance */}
                <div className="flex items-center justify-between p-4 bg-[#fbfcf9] rounded-xl border border-stone-200">
                  <div className="flex items-center gap-3">
                    <CloudSun className="w-10 h-10 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-3xl font-black text-stone-900 tabular-nums">
                        {weather.temperatureC}°C
                      </div>
                      <div className="text-xs font-medium text-stone-600">
                        {weather.weatherDescription}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${hailRiskCardColor}`}
                    >
                      Hail Risk: {weather.hailRiskScore}
                    </span>
                    <div className="text-[11px] text-stone-600 mt-1">
                      UV Index: <strong className="text-stone-800">{weather.uvIndex}</strong>
                    </div>
                  </div>
                </div>

                {/* Weather Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <div className="flex items-center gap-1 text-stone-500 text-[11px] mb-1">
                      <Wind className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.windSpeed}</span>
                    </div>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {weather.windSpeedKmh} km/h
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <div className="flex items-center gap-1 text-stone-500 text-[11px] mb-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t.humidity}</span>
                    </div>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {weather.humidityPercent}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <div className="flex items-center gap-1 text-stone-500 text-[11px] mb-1">
                      <CloudLightning className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.rainProbability}</span>
                    </div>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {weather.rainProbabilityPercent}%
                    </span>
                  </div>
                </div>

                {/* 4-Day Daily Forecast Strip */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Upcoming Forecast
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {weather.forecastDaily.slice(0, 4).map((day) => (
                      <div
                        key={day.date}
                        className="p-2 rounded-lg bg-stone-50/80 border border-stone-200 text-xs"
                      >
                        <div className="font-medium text-stone-600 text-[11px]">
                          {day.dayName.slice(0, 3)}
                        </div>
                        <div className="font-bold text-stone-900 text-xs mt-1 tabular-nums">
                          {day.tempMaxC}°
                        </div>
                        <div className="text-[10px] text-stone-500 tabular-nums">
                          {day.rainProbabilityPercent}% rain
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-stone-500">
                {t.noData}. Connecting to live weather service...
              </div>
            )}
          </div>

          {/* Safety Advisory Banner */}
          <div className="mt-4 p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-tight">
              <strong>Farm Advisory:</strong> HailShield automated storm monitor is active. In case of sudden squalls, canopies can be deployed in under 2 minutes.
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" />
              <span>{t.recentActivity}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified chronological records from farm operations, alerts, and canopy movements
            </p>
          </div>
          <button
            onClick={() => onNavigate('activity')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View Full Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-stone-100">
          {activities.slice(0, 5).map((act) => {
            const dateStr = new Date(act.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }) + ', ' + new Date(act.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={act.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                    {act.actionType.includes('DEPLOY') || act.actionType.includes('CLOSE') ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    ) : act.actionType.includes('RETRACT') || act.actionType.includes('OPEN') ? (
                      <RotateCcw className="w-4 h-4 text-stone-600" />
                    ) : act.actionType.includes('ALERT') ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{act.description}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Executed by <strong className="text-stone-700">{act.userName}</strong> ({act.userRole.replace('_', ' ')})
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-stone-600 font-medium shrink-0 sm:text-right">
                  {dateStr}
                </span>
              </div>
            );
          })}

          {activities.length === 0 && (
            <div className="p-6 text-center text-xs text-stone-600">
              {t.noData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
