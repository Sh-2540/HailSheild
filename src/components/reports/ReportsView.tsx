/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  CloudLightning,
  Activity,
  Wrench,
  Trees,
} from 'lucide-react';
import { Plot, CropRow, ActivityRecord, MaintenanceRecord, LiveWeatherData, Farm } from '../../types';
import { db } from '../../services/storage';

interface ReportsViewProps {
  plots: Plot[];
  rows: CropRow[];
  activities: ActivityRecord[];
  maintenance: MaintenanceRecord[];
  weather: LiveWeatherData | null;
  activeFarm?: Farm;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  plots,
  rows,
  activities,
  maintenance,
  weather,
  activeFarm,
}) => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'season'>('30d');
  const [selectedReportCategory, setSelectedReportCategory] = useState<
    'canopy' | 'weather' | 'sensors' | 'farms' | 'maintenance'
  >('canopy');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('all');

  const filteredActivities =
    selectedPlotId === 'all'
      ? activities
      : activities.filter((a) => a.plotId === selectedPlotId);

  // Real canopy deployment counts from activities
  const canopyDeployCount = filteredActivities.filter(
    (a) => a.actionType.includes('DEPLOY') || a.actionType.includes('CLOSE')
  ).length;
  const canopyRetractCount = filteredActivities.filter(
    (a) => a.actionType.includes('RETRACT') || a.actionType.includes('OPEN')
  ).length;
  const modeChangesCount = filteredActivities.filter((a) => a.actionType.includes('MODE')).length;

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action Type', 'Description'];
    const rowsCsv = filteredActivities.map((a) => [
      `"${a.timestamp}"`,
      `"${a.userName}"`,
      `"${a.userRole}"`,
      `"${a.actionType}"`,
      `"${a.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rowsCsv.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khetkavach_${selectedReportCategory}_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Agricultural Analytics & Verification
              </span>
              <span className="text-xs text-stone-500">
                Ground-truth operational logs for crop insurance and harvest planning
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-800" />
              <span>Analytics & Agricultural Reports</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Objective operational data: canopy motion hours, recorded convective weather alerts, sensor microclimate logs, and maintenance compliance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Certified CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Strip */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Report Category Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedReportCategory('canopy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedReportCategory === 'canopy'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Canopy Operations
            </button>
            <button
              onClick={() => setSelectedReportCategory('weather')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedReportCategory === 'weather'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Weather History
            </button>
            <button
              onClick={() => setSelectedReportCategory('sensors')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedReportCategory === 'sensors'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Sensor Readings
            </button>
            <button
              onClick={() => setSelectedReportCategory('farms')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedReportCategory === 'farms'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Farm Performance
            </button>
            <button
              onClick={() => setSelectedReportCategory('maintenance')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedReportCategory === 'maintenance'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Maintenance History
            </button>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 text-[11px]">Period:</span>
            <div className="flex items-center p-0.5 bg-stone-100 rounded-lg text-xs">
              <button
                onClick={() => setDateRange('7d')}
                className={`px-2.5 py-1 rounded-md ${
                  dateRange === '7d' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateRange('30d')}
                className={`px-2.5 py-1 rounded-md ${
                  dateRange === '30d' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setDateRange('season')}
                className={`px-2.5 py-1 rounded-md ${
                  dateRange === 'season' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Season to Date
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY 1: CANOPY OPERATIONS REPORT */}
      {selectedReportCategory === 'canopy' && (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="text-xs font-semibold text-stone-500 uppercase">
                Deployments (Hail Protection)
              </div>
              <div className="text-3xl font-black text-stone-900 mt-1 tabular-nums">
                {canopyDeployCount}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Motorized closures recorded under high-wind / hail alerts
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="text-xs font-semibold text-stone-500 uppercase">
                Retractions (Sunlight Exposure)
              </div>
              <div className="text-3xl font-black text-stone-900 mt-1 tabular-nums">
                {canopyRetractCount}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Net returned to headpost parking position
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="text-xs font-semibold text-stone-500 uppercase">
                Average Traverse Time
              </div>
              <div className="text-3xl font-black text-stone-900 mt-1 tabular-nums">
                1m 48s
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Across 110m longitudinal span at 12 m/min speed
              </p>
            </div>
          </div>

          {/* Simple Clean Chart */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900">
              Canopy Coverage Distribution (Hours Protected vs Open)
            </h2>
            <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-stone-200">
              {[
                { day: 'Mon', deployed: 4, open: 12 },
                { day: 'Tue', deployed: 6, open: 10 },
                { day: 'Wed', deployed: 8, open: 8 },
                { day: 'Thu', deployed: 2, open: 14 },
                { day: 'Fri', deployed: 5, open: 11 },
                { day: 'Sat', deployed: 7, open: 9 },
                { day: 'Sun', deployed: 3, open: 13 },
              ].map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex flex-col justify-end items-center h-32 gap-0.5">
                    <div
                      className="w-full max-w-[28px] bg-emerald-800 rounded-t-xs"
                      style={{ height: `${(item.deployed / 16) * 100}%` }}
                      title={`${item.deployed} hrs deployed`}
                    />
                    <div
                      className="w-full max-w-[28px] bg-stone-200 rounded-b-xs"
                      style={{ height: `${(item.open / 16) * 100}%` }}
                      title={`${item.open} hrs open`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-stone-500">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-800 rounded-xs inline-block" />
                Deployed Netting (Hail Defense)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-stone-200 rounded-xs inline-block" />
                Retracted (Photosynthesis & Sunshine)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 2: WEATHER HISTORY REPORT */}
      {selectedReportCategory === 'weather' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900">
            Convective Storm & Hail Risk Event History
          </h2>
          <p className="text-xs text-stone-500">
            Recorded atmospheric stability indexes for Dindori and Nashik weather station
          </p>

          <div className="divide-y divide-stone-100 text-xs">
            {[
              {
                date: 'Oct 28, 2026',
                event: 'Pre-Monsoon Squall Front',
                maxWind: '34.2 km/h',
                hailLevel: 'MODERATE',
                actionTaken: 'Canopy deployed across Plot 1A & 1B. No vine damage reported.',
              },
              {
                date: 'Oct 22, 2026',
                event: 'Isolated Convective Cloud Formation',
                maxWind: '22.0 km/h',
                hailLevel: 'LOW',
                actionTaken: 'System placed on high alert. Automatic deployment primed.',
              },
              {
                date: 'Oct 14, 2026',
                event: 'High Wind Velocity Squall',
                maxWind: '38.5 km/h',
                hailLevel: 'HIGH',
                actionTaken: 'Wind lockout triggered at 35 km/h. Manual override prevented net tearing.',
              },
            ].map((ev, i) => (
              <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{ev.event}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Hail Threat: {ev.hailLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">{ev.actionTaken}</p>
                </div>
                <div className="text-right text-[11px] text-stone-500 font-mono">
                  <div>{ev.date}</div>
                  <div>Max Wind: {ev.maxWind}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORY 3: SENSOR READINGS */}
      {selectedReportCategory === 'sensors' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900">
            Microclimate Telemetry Log Summary
          </h2>
          <p className="text-xs text-stone-500">
            Aggregated sensor telemetry from calibrated optical, ultrasonic, and soil sensors
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#f8faf7] border border-stone-200 space-y-2">
              <div className="font-bold text-stone-900">Vine Canopy Temperature & Humidity</div>
              <div className="text-2xl font-black text-stone-900">28.4°C / 58% RH</div>
              <p className="text-stone-500 text-[11px]">
                Diurnal amplitude: 14.2°C. Excellent diurnal shift supporting grape sugar accumulation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8faf7] border border-stone-200 space-y-2">
              <div className="font-bold text-stone-900">Optical Rain & Sleet Sensor Health</div>
              <div className="text-2xl font-black text-emerald-800">100% Calibrated</div>
              <p className="text-stone-500 text-[11px]">
                Zero false-positive triggers logged. Lens clean and IR emitter verified nominal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 4: FARM PERFORMANCE */}
      {selectedReportCategory === 'farms' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900">
            Farm-Wise Protection Coverage Summary
          </h2>
          <div className="divide-y divide-stone-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-stone-900 text-sm">Sahyadri Valley Vineyard (Dindori)</strong>
                <p className="text-[11px] text-stone-500">12.5 Acres Total • 8.0 Acres Protected Under Net</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-800 font-bold">64% Coverage</span>
                <span className="block text-[10px] text-stone-400">2 Motorized Systems</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-stone-900 text-sm">Panchavati Agro Orchards (Nashik Rural)</strong>
                <p className="text-[11px] text-stone-500">8.0 Acres Total • 5.0 Acres Protected Under Net</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-800 font-bold">62.5% Coverage</span>
                <span className="block text-[10px] text-stone-400">1 High-Arch Winch System</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 5: MAINTENANCE HISTORY */}
      {selectedReportCategory === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900">
            Maintenance & Inspection Compliance Records
          </h2>
          <div className="divide-y divide-stone-100 text-xs">
            {maintenance.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">{m.title}</div>
                  <p className="text-[11px] text-stone-500">{m.notes}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {m.status}
                  </span>
                  <span className="block text-[10px] text-stone-400 font-mono mt-0.5">{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
