/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Radio,
  Battery,
  BatteryCharging,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Sparkles,
  ShieldCheck,
  Plus,
  Compass,
} from 'lucide-react';
import { IoTDevice, Farm, Plot, SensorTelemetry, DeviceType, UserRole } from '../../types';
import { db } from '../../services/storage';

interface IotDeviceManagerProps {
  devices: IoTDevice[];
  farms: Farm[];
  plots: Plot[];
  telemetry: SensorTelemetry[];
  userRole?: UserRole;
  onSaveDevice?: (device: IoTDevice) => void;
  onDeleteDevice?: (deviceId: string) => void;
  onInjectTelemetry?: (telemetry: SensorTelemetry) => void;
}

export const IotDeviceManager: React.FC<IotDeviceManagerProps> = ({
  devices,
  farms,
  plots,
  telemetry,
  userRole = 'farmer',
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [showTechDiagnostics, setShowTechDiagnostics] = useState(false);

  // Derive understandable sensor readings
  const sensorCards = [
    {
      id: 'sensor-rain',
      name: 'Optical Hail & Rain Detector',
      location: 'Plot 1A – North Block Trellis',
      type: 'rain',
      reading: telemetry.find((t) => t.sensorType === 'rain_optical')?.value ?? 0,
      unit: 'mm / Optical Sleet Alert',
      status: 'online',
      statusText: 'Active & Calibrated',
      lastUpdated: '2 mins ago',
      powerSource: 'Solar + Battery Buffer',
      batteryPercent: 94,
      condition: 'Normal - Surface Dry',
      icon: CloudRain,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'sensor-anemometer',
      name: 'Ultrasonic Wind Anemometer',
      location: 'Perimeter Weather Mast (3.5m elevation)',
      type: 'wind',
      reading: telemetry.find((t) => t.sensorType === 'wind_speed')?.value ?? 14.8,
      unit: 'km/h',
      status: 'online',
      statusText: 'Active',
      lastUpdated: '1 min ago',
      powerSource: 'Solar Powered',
      batteryPercent: 92,
      condition: 'Within Safe Motion Threshold (<35 km/h)',
      icon: Wind,
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'sensor-temp-hum',
      name: 'Ambient Temperature & Humidity Station',
      location: 'Vine Canopy Microclimate Station',
      type: 'ambient',
      reading: telemetry.find((t) => t.sensorType === 'temperature')?.value ?? 28.4,
      unit: '°C (Humidity: 58%)',
      status: 'online',
      statusText: 'Active',
      lastUpdated: 'Just now',
      powerSource: 'Lithium Battery (2-yr life)',
      batteryPercent: 88,
      condition: 'Favorable photosynthesis range',
      icon: Sun,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 'sensor-soil',
      name: 'Root Zone Soil Moisture Probe',
      location: 'Plot 1A – Vine Row 4 (Depth: 45cm)',
      type: 'soil',
      reading: telemetry.find((t) => t.sensorType === 'soil_moisture')?.value ?? 42.0,
      unit: '% Volumetric Water Content',
      status: 'online',
      statusText: 'Active',
      lastUpdated: '5 mins ago',
      powerSource: 'Grid Mains / Drip Controller',
      batteryPercent: 100,
      condition: 'Adequate Moisture for Veraison',
      icon: Droplets,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    },
    {
      id: 'sensor-gateway-orchard',
      name: 'Panchavati Orchard Field Gateway',
      location: 'Panchavati Orchard Plot 2A',
      type: 'gateway',
      reading: 0,
      unit: 'Standby Gateway',
      status: 'offline',
      statusText: 'Offline / Solar Check Needed',
      lastUpdated: 'Yesterday at 19:40',
      powerSource: 'Solar MPPT Pack',
      batteryPercent: 12,
      condition: 'Technician inspection scheduled',
      icon: Radio,
      color: 'text-stone-700 bg-stone-50 border-stone-200',
    },
  ];

  const filteredCards =
    filterType === 'all'
      ? sensorCards
      : sensorCards.filter((c) => c.type === filterType || (filterType === 'active' && c.status === 'online'));

  const isTechnicianOrAdmin = userRole === 'technician' || userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                On-Field Telemetry & Microclimate
              </span>
              <span className="text-xs text-stone-500">
                Calibrated agricultural sensors monitoring vineyard environmental parameters
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-800" />
              <span>Field Sensor Monitoring</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Real-time readings for optical rain detection, wind anemometers, vine canopy temperatures, and soil moisture levels.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isTechnicianOrAdmin && (
              <button
                onClick={() => setShowTechDiagnostics(!showTechDiagnostics)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                  showTechDiagnostics
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showTechDiagnostics ? 'Hide Diagnostics' : 'Field Diagnostics'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Sensors ({sensorCards.length})
          </button>
          <button
            onClick={() => setFilterType('rain')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'rain'
                ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Rain & Hail
          </button>
          <button
            onClick={() => setFilterType('wind')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'wind'
                ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Wind Speed
          </button>
          <button
            onClick={() => setFilterType('ambient')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'ambient'
                ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Temperature & Humidity
          </button>
          <button
            onClick={() => setFilterType('soil')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'soil'
                ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Soil Moisture
          </button>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((sensor) => {
          const Icon = sensor.icon;
          const isOnline = sensor.status === 'online';

          return (
            <div
              key={sensor.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f8faf7] border border-stone-200 flex items-center justify-center text-emerald-800 shrink-0">
                      <Icon className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 leading-tight">
                        {sensor.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {sensor.location}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${
                      isOnline
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                {/* Primary Measurement Display */}
                <div className="my-4 p-4 rounded-xl bg-[#fbfcf9] border border-stone-200/80">
                  <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Current Reading
                  </div>
                  <div className="text-2xl font-black text-stone-900 tabular-nums">
                    {sensor.reading} <span className="text-xs font-medium text-stone-600">{sensor.unit}</span>
                  </div>
                  <div className="text-xs text-emerald-800 font-medium mt-1">
                    {sensor.condition}
                  </div>
                </div>

                {/* Secondary Specs */}
                <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Power Source:</span>
                    <span className="font-medium text-stone-800 flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{sensor.batteryPercent}% ({sensor.powerSource})</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Last Telemetry Ping:</span>
                    <span className="font-medium text-stone-800">{sensor.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Technician Diagnostic Panel (Restricted) */}
              {showTechDiagnostics && (
                <div className="mt-4 pt-3 border-t border-amber-200 bg-amber-50/60 -mx-5 -mb-5 p-4 rounded-b-2xl text-[11px] text-amber-950 font-mono space-y-1">
                  <div className="font-bold text-amber-900 font-sans">
                    Technician Telemetry Audit
                  </div>
                  <div>Device UID: ESP32-KK-GW-{sensor.id.slice(-4).toUpperCase()}</div>
                  <div>Signal RSSI: -64 dBm (High SNR)</div>
                  <div>Calibration Verified: Jan 2026</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Farmer Advisory Note */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 flex items-start gap-3 shadow-2xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Continuous Protection:</strong> Optical hail sensors trigger automatic audible warnings and SMS dispatch when impact frequencies exceed convective thresholds. All telemetry is recorded for crop microclimate records.
        </p>
      </div>
    </div>
  );
};
