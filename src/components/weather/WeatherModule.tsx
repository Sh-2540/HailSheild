/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CloudLightning,
  CloudSun,
  Droplets,
  Wind,
  Compass,
  Sun,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Info,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { LiveWeatherData, Farm, SensorTelemetry, AlertItem } from '../../types';
import { db } from '../../services/storage';

interface WeatherModuleProps {
  weather: LiveWeatherData | null;
  activeFarm: Farm | undefined;
  telemetry: SensorTelemetry[];
  onRefreshWeather: () => void;
  onDeployCanopy?: () => void;
}

export const WeatherModule: React.FC<WeatherModuleProps> = ({
  weather,
  activeFarm,
  telemetry,
  onRefreshWeather,
  onDeployCanopy,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!weather) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
        <CloudSun className="w-10 h-10 text-stone-400 mx-auto animate-pulse mb-3" />
        <p className="text-sm font-semibold text-stone-800">
          Loading meteorological observations...
        </p>
        <p className="text-xs text-stone-500 mt-1">
          Fetching high-resolution Open-Meteo satellite and radar feeds for {activeFarm?.taluka || 'Nashik'}
        </p>
      </div>
    );
  }

  const selectedDay = weather.forecastDaily[selectedDayIndex] || weather.forecastDaily[0];

  const hailRisk = weather.hailRiskScore || 'LOW';
  const hailRiskBadge = {
    LOW: {
      label: 'Low Hail Risk',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
      description: 'Atmospheric stability nominal. Normal vineyard open sunlight exposure recommended.',
      action: 'Canopies can remain retracted for maximum natural photosynthesis.',
    },
    MODERATE: {
      label: 'Moderate Hail Risk',
      color: 'text-amber-800 bg-amber-50 border-amber-300',
      description: 'Isolated convective thermal updrafts detected in Western Ghats corridor.',
      action: 'Prepare canopies for rapid deployment if dark cumulonimbus clouds form.',
    },
    HIGH: {
      label: 'High Hail Threat',
      color: 'text-orange-800 bg-orange-50 border-orange-300 font-bold',
      description: 'Severe squall front and freezing level drops detected. Hail probability elevated.',
      action: 'Recommended action: Deploy HailShield canopies across all grape blocks.',
    },
    CRITICAL: {
      label: 'CRITICAL HAIL WARNING',
      color: 'text-rose-800 bg-rose-50 border-rose-300 font-extrabold',
      description: 'Severe convective hailstorm imminent in local taluka. Damaging hail stones likely.',
      action: 'Immediate action: Ensure all canopies deployed and lock emergency latches.',
    },
  }[hailRisk];

  const isWindLockout = weather.windSpeedKmh > 35;
  const alerts: AlertItem[] = db.getAlerts(activeFarm?.id).filter((a) => a.category === 'weather');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Meteorological Radar & Hail Defense
              </span>
              <span className="text-xs text-stone-500">
                {weather.locationName || `${activeFarm?.taluka}, Nashik`} • Lat: {weather.latitude.toFixed(2)}°, Lng: {weather.longitude.toFixed(2)}°
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <CloudLightning className="w-6 h-6 text-emerald-800" />
              <span>Weather & Hail Threat Center</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Live numerical weather prediction calibrated for high-value viticulture and horticulture in Nashik and Dindori valleys.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRefreshWeather}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh Forecast</span>
            </button>
            {hailRisk !== 'LOW' && onDeployCanopy && (
              <button
                onClick={onDeployCanopy}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Deploy Canopies Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Hail Risk Bar */}
        <div className={`mt-5 p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${hailRiskBadge.color}`}>
          <div className="flex items-start gap-3">
            <CloudLightning className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-extrabold uppercase tracking-wide">
                {hailRiskBadge.label}
              </div>
              <p className="text-xs mt-0.5 opacity-90">
                {hailRiskBadge.description}
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold md:text-right shrink-0">
            <span className="block opacity-75 text-[10px] uppercase tracking-wider">Recommended Action:</span>
            <span>{hailRiskBadge.action}</span>
          </div>
        </div>
      </div>

      {/* Main Meteorological Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Temperature */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1.5 text-xs font-semibold uppercase">
            <span>Temperature</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {weather.temperatureC}°C
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {weather.weatherDescription}
          </p>
        </div>

        {/* Relative Humidity */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1.5 text-xs font-semibold uppercase">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {weather.humidityPercent}%
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Dew point favorable
          </p>
        </div>

        {/* Wind Speed & Lockout */}
        <div className={`p-4 rounded-xl border shadow-2xs ${isWindLockout ? 'bg-amber-50 border-amber-300' : 'bg-white border-stone-200'}`}>
          <div className="flex items-center justify-between text-stone-500 mb-1.5 text-xs font-semibold uppercase">
            <span>Wind Speed</span>
            <Wind className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {weather.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {isWindLockout ? 'Lockout: >35 km/h' : 'Within safe limits'}
          </p>
        </div>

        {/* Rain Probability */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1.5 text-xs font-semibold uppercase">
            <span>Precipitation</span>
            <CloudSun className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {weather.rainProbabilityPercent}%
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {weather.rainMm > 0 ? `${weather.rainMm} mm expected` : 'Dry conditions'}
          </p>
        </div>

        {/* Wind Direction */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1.5 text-xs font-semibold uppercase">
            <span>Wind Heading</span>
            <Compass className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {weather.windDirectionDeg}°
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            West-Southwest squall vector
          </p>
        </div>

        {/* UV Radiation */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1.5 text-xs font-semibold uppercase">
            <span>UV Radiation</span>
            <Sun className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {weather.uvIndex} <span className="text-xs font-normal">UV</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Index level: Moderate
          </p>
        </div>
      </div>

      {/* 7-Day Agricultural Forecast */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <span>7-Day Agricultural Weather Outlook</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Daily maximums, squall probabilities, and precipitation forecasts for canopy planning
            </p>
          </div>
          <span className="text-xs text-stone-500">
            Open-Meteo High Resolution Model
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecastDaily.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const hasRain = day.rainProbabilityPercent > 30;

            return (
              <div
                key={day.date}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                    : 'border-stone-200 bg-[#fbfcf9] hover:bg-stone-50'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">
                  {day.dayName}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>

                <div className="my-2.5">
                  <CloudSun className="w-7 h-7 mx-auto text-amber-500" />
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-stone-900 tabular-nums">
                  <span>{day.tempMaxC}°</span>
                  <span className="text-stone-400 font-normal">/</span>
                  <span className="text-stone-500 font-medium">{day.tempMinC}°</span>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-200/80 text-[11px]">
                  <span
                    className={`block font-semibold tabular-nums ${
                      hasRain ? 'text-blue-700' : 'text-stone-500'
                    }`}
                  >
                    {day.rainProbabilityPercent}% Rain
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Max wind: {day.windSpeedMaxKmh} km/h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Incident & Alert Dispatch Feed */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Regional Weather Alerts & Advisories</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Automated notifications for convective storm cells and rapid pressure drops
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-600">
            {alerts.length} Active Notice(s)
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.severity === 'critical'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <CloudLightning
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'text-rose-700'
                      : alert.severity === 'warning'
                      ? 'text-amber-700'
                      : 'text-stone-600'
                  }`}
                />
                <div>
                  <h3 className="font-bold text-xs">{alert.title}</h3>
                  <p className="text-[11px] opacity-90 mt-0.5">{alert.description}</p>
                  {alert.recommendedAction && (
                    <p className="text-[11px] font-semibold mt-1">
                      Action: {alert.recommendedAction}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-stone-500 font-mono shrink-0 sm:text-right">
                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="p-6 text-center text-xs text-stone-500 bg-[#fbfcf9] rounded-xl border border-stone-100">
              No critical weather alerts recorded. Field microclimate is stable.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
