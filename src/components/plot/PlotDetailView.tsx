/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  ShieldX,
  Play,
  RotateCcw,
  CloudSun,
  Cpu,
  Wrench,
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  Plot,
  CropRow,
  CanopySystem,
  LiveWeatherData,
  IoTDevice,
  MaintenanceRecord,
  ActivityRecord,
  Farm,
  LongitudinalSection,
  NavTab,
} from '../../types';
import { Badge } from '../common/Badge';
import { SafetyDisclaimer } from '../common/SafetyDisclaimer';
import { db } from '../../services/storage';

interface PlotDetailViewProps {
  plots: Plot[];
  selectedPlotId: string;
  onSelectPlot: (plotId: string) => void;
  rows: CropRow[];
  canopySystems: CanopySystem[];
  devices: IoTDevice[];
  weather: LiveWeatherData | null;
  maintenanceRecords: MaintenanceRecord[];
  activities: ActivityRecord[];
  activeFarm: Farm | undefined;
  onNavigate: (tab: NavTab) => void;
  onExecuteRowAction: (
    canopySystemId: string,
    plotId: string,
    rows: number[],
    action: 'open' | 'close'
  ) => void;
}

export const PlotDetailView: React.FC<PlotDetailViewProps> = ({
  plots,
  selectedPlotId,
  onSelectPlot,
  rows,
  canopySystems,
  devices,
  weather,
  maintenanceRecords,
  activities,
  activeFarm,
  onNavigate,
  onExecuteRowAction,
}) => {
  const currentPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];
  const plotRows = rows.filter((r) => r.plotId === currentPlot?.id);
  const canopySystem = canopySystems.find((s) => s.plotId === currentPlot?.id);
  const plotDevices = devices.filter((d) => d.plotId === currentPlot?.id || d.farmId === currentPlot?.farmId);
  const plotMaintenance = maintenanceRecords.filter((m) => m.plotId === currentPlot?.id);
  const plotSections = db.getSections(currentPlot?.id);

  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);

  if (!currentPlot) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-stone-200">
        <p className="text-sm text-stone-500">No plot selected or registered in this farm.</p>
        <button
          onClick={() => onNavigate('farms')}
          className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
        >
          Go to Farm Registry
        </button>
      </div>
    );
  }

  const coveredRowCount = plotRows.filter((r) => r.positionPercent >= 80).length;
  const growthStages = ['Dormant', 'Bud Break', 'Flowering', 'Fruit Set', 'Veraison', 'Ripening', 'Harvest'];
  const currentStageIndex = growthStages.indexOf(currentPlot.growthStage);

  const toggleSectionSelect = (sectionId: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const selectAllSections = () => {
    setSelectedSectionIds(plotSections.map((s) => s.id));
  };

  const deselectAllSections = () => {
    setSelectedSectionIds([]);
  };

  const handleSectionAction = (sectionIds: string[], action: 'open' | 'close') => {
    if (!canopySystem) return;
    const targetSections = plotSections.filter((s) => sectionIds.includes(s.id));
    const targetRows = Array.from(new Set(targetSections.flatMap((s) => s.assignedRowNumbers)));
    onExecuteRowAction(canopySystem.id, currentPlot.id, targetRows, action);
  };

  return (
    <div className="space-y-6">
      {/* Header with Plot Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {activeFarm?.name}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">Trellis Block Studio</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Layers className="w-6 h-6 text-emerald-700" />
            <span>{currentPlot.name}</span>
            <span className="text-xs font-mono font-medium text-stone-400">
              [{currentPlot.plotNumber}]
            </span>
          </h2>
        </div>

        {/* Dropdown to switch plots */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-stone-500 hidden sm:inline">Select Plot:</label>
          <select
            value={currentPlot.id}
            onChange={(e) => onSelectPlot(e.target.value)}
            className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-800 shadow-2xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            {plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.plotNumber} – {p.name} ({p.cropType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Agronomic Snapshot Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-stone-400 text-[10px] font-bold uppercase block">Crop & Variety</span>
            <strong className="text-stone-900 text-sm">
              {currentPlot.cropType}
            </strong>
            <span className="text-stone-500 text-[11px] block">{currentPlot.cropVariety}</span>
          </div>

          <div>
            <span className="text-stone-400 text-[10px] font-bold uppercase block">Block Area</span>
            <strong className="text-stone-900 text-sm">{currentPlot.areaAcres} Acres</strong>
            <span className="text-stone-500 text-[11px] block">
              {(currentPlot.areaAcres * 0.404686).toFixed(2)} Hectares
            </span>
          </div>

          <div>
            <span className="text-stone-400 text-[10px] font-bold uppercase block">Row Layout</span>
            <strong className="text-stone-900 text-sm">{currentPlot.rowCount} Rows</strong>
            <span className="text-stone-500 text-[11px] block">{currentPlot.rowSpacingMeters}m spacing</span>
          </div>

          <div>
            <span className="text-stone-400 text-[10px] font-bold uppercase block">Planting Date</span>
            <strong className="text-stone-900 text-sm">{currentPlot.plantingDate}</strong>
            <span className="text-stone-500 text-[11px] block">Vigor: High</span>
          </div>

          <div>
            <span className="text-stone-400 text-[10px] font-bold uppercase block">Overhead Protection</span>
            <div className="mt-1">
              {currentPlot.canopyInstalled ? (
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                  Parallel Overhead Grid
                </Badge>
              ) : (
                <Badge variant="neutral" size="sm">
                  Unprotected
                </Badge>
              )}
            </div>
          </div>

          <div>
            <span className="text-stone-400 text-[10px] font-bold uppercase block">Current Coverage</span>
            <strong className="text-stone-900 text-sm">
              {coveredRowCount} / {plotRows.length} Rows Covered
            </strong>
            <span className="text-emerald-700 font-semibold text-[11px] block">
              {Math.round((coveredRowCount / (plotRows.length || 1)) * 100)}% Overhead Deployed
            </span>
          </div>
        </div>

        {/* Growth Stage Progress tracker */}
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
            <span>Crop Phenological Stage</span>
            <span className="text-emerald-800 font-bold">Current: {currentPlot.growthStage}</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {growthStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stage} className="text-center">
                  <div
                    className={`h-2 rounded-full mb-1 transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 ring-2 ring-emerald-300'
                        : isPast
                        ? 'bg-emerald-300'
                        : 'bg-stone-200'
                    }`}
                  />
                  <span
                    className={`text-[9px] block truncate ${
                      isCurrent ? 'font-bold text-emerald-900' : 'text-stone-400'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MECHANICAL ARCHITECTURE: PARALLEL COLUMN-WISE RETRACTABLE OVERHEAD NET SYSTEM */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
        {/* Header & Mode Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-stone-900">
                Parallel Column-Wise Retractable Overhead Net System
              </h3>
              <Badge variant="info" size="sm">
                OVERHEAD SUSPENSION
              </Badge>
              <Badge variant="simulation" size="sm">
                SIMULATION MODE
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Netting remains elevated above crops on pole-and-cable framework, extending and retracting along the longitudinal direction of crop rows.
            </p>
          </div>

          {currentPlot.canopyInstalled && canopySystem && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={selectAllSections}
                className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors font-medium"
              >
                Select All Sections
              </button>
              <button
                onClick={deselectAllSections}
                className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Clear
              </button>

              {selectedSectionIds.length > 0 && (
                <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
                  <button
                    onClick={() => handleSectionAction(selectedSectionIds, 'close')}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    Deploy Selected ({selectedSectionIds.length})
                  </button>
                  <button
                    onClick={() => handleSectionAction(selectedSectionIds, 'open')}
                    className="px-3 py-1 bg-stone-700 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    Retract Selected ({selectedSectionIds.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Structural Design Legend & Compliance Guard */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-stone-800 text-xs">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Overhead Cable-and-Pole Grid Mechanical Specifications</span>
            </div>
            <span className="text-[10px] text-stone-500 font-mono">
              Overhead Clearance: 3.2m above vine trellises • Longitudinal Traverse Axis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-stone-200">
              <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
              <span><strong>Deployed Net:</strong> Elevated hail protection</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-stone-200">
              <span className="w-3 h-3 rounded bg-stone-300 shrink-0" />
              <span><strong>Retracted Net:</strong> Parked at headpost</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-stone-200">
              <span className="w-3 h-3 rounded bg-amber-400 shrink-0 animate-pulse" />
              <span><strong>Longitudinal Traverse:</strong> Winch active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Limit Switches:</strong> Physical verification</span>
            </div>
          </div>
        </div>

        {/* INDEPENDENT CONTROL UNITS: LONGITUDINAL SECTIONS LIST */}
        {currentPlot.canopyInstalled && plotSections.length > 0 ? (
          <div className="space-y-4 pt-1">
            <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Independently Identifiable Longitudinal Sections ({plotSections.length} Column Units)
            </div>

            <div className="space-y-3">
              {plotSections.map((sec) => {
                const isSelected = selectedSectionIds.includes(sec.id);
                const isMoving = sec.motionState === 'deploying' || sec.motionState === 'retracting';
                const isDeployed = sec.positionPercent >= 95;
                const isRetracted = sec.positionPercent <= 5;

                return (
                  <div
                    key={sec.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    {/* Top Row: Section Identity, Dimensions & Checkbox */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSectionSelect(sec.id)}
                          className="w-4 h-4 text-emerald-600 rounded border-stone-300 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                            <span>{sec.name}</span>
                            <Badge
                              variant={
                                isMoving ? 'warning' : isDeployed ? 'success' : 'neutral'
                              }
                              size="sm"
                            >
                              {sec.motionState.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Longitudinal Span: <strong>{sec.lengthMeters}m</strong> • Width: <strong>{sec.spanWidthMeters}m</strong> • Rows: [ {sec.assignedRowNumbers.map((r) => `R${r}`).join(', ')} ]
                          </p>
                        </div>
                      </div>

                      {/* Right: Limit Switch Indicators & Individual Section Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono mr-2">
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              sec.limitSwRetractedActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                : 'bg-stone-100 text-stone-400 border-stone-200'
                            }`}
                            title="Limit Switch 1 (Headpost Parking End)"
                          >
                            LS-RETRACTED
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              sec.limitSwDeployedActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                : 'bg-stone-100 text-stone-400 border-stone-200'
                            }`}
                            title="Limit Switch 2 (Tailpost Anchor End)"
                          >
                            LS-DEPLOYED
                          </span>
                        </div>

                        <button
                          onClick={() => handleSectionAction([sec.id], 'close')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                        >
                          Deploy
                        </button>
                        <button
                          onClick={() => handleSectionAction([sec.id], 'open')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                        >
                          Retract
                        </button>
                      </div>
                    </div>

                    {/* Longitudinal Overhead Traverse Travel Schematic */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <span>Headpost (0m)</span>
                          <ArrowRight className="w-3 h-3 text-stone-400" />
                          <span>Tailpost ({sec.lengthMeters}m)</span>
                        </span>
                        <span className="font-mono font-bold text-stone-900">
                          {sec.positionPercent}% Longitudinal Cover
                        </span>
                      </div>

                      <div className="h-5 bg-stone-100 rounded-md overflow-hidden p-0.5 border border-stone-200 relative">
                        {/* Intermediate pole markers */}
                        <div className="absolute inset-0 flex justify-between px-6 pointer-events-none">
                          <div className="w-[1px] h-full bg-stone-300" />
                          <div className="w-[1px] h-full bg-stone-200" />
                          <div className="w-[1px] h-full bg-stone-200" />
                          <div className="w-[1px] h-full bg-stone-200" />
                          <div className="w-[1px] h-full bg-stone-300" />
                        </div>

                        {/* Moving Overhead Net Sheet */}
                        <div
                          className={`h-full rounded transition-all duration-500 relative ${
                            isMoving
                              ? 'bg-amber-400 shadow-sm animate-pulse'
                              : isDeployed
                              ? 'bg-emerald-600'
                              : 'bg-stone-400'
                          }`}
                          style={{ width: `${Math.max(4, sec.positionPercent)}%` }}
                        />
                      </div>
                    </div>

                    {/* Underlying Parallel Crop Rows covered by this section */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">
                        Underlying Trellis Rows (Directly Protected by this Section):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {sec.assignedRowNumbers.map((rowNum) => {
                          const r = plotRows.find((row) => row.rowNumber === rowNum);
                          return (
                            <div
                              key={rowNum}
                              className="p-2 rounded bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                            >
                              <span className="font-bold text-stone-800">Row {rowNum}</span>
                              <span className="text-[10px] text-stone-500 font-mono">
                                {r?.positionPercent || 0}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <ShieldX className="w-8 h-8 text-stone-400 mx-auto" />
            <h4 className="font-bold text-stone-800 text-sm">HailShield Overhead System Not Installed</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              This plot is currently open-field. To install a parallel column-wise retractable overhead canopy, configure HailShield in the Farm Registry.
            </p>
          </div>
        )}

        {/* Configurable Mechanical Design Callout */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs flex items-start gap-2.5 text-stone-600">
          <Wrench className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Configurable Mechanical Subsystems:</strong> Winch drum diameter (160mm), drive cable diameter (6mm Stainless 316), slider carrier spacing (2.5m), and intermediate overhead support post tensioning remain configurable until formal on-field validation by agricultural/mechanical engineers.
          </p>
        </div>
      </div>

      {/* Grid: Connected IoT Sensors + Maintenance Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Sensors in this Plot */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              <span>Assigned IoT Nodes & Sensors</span>
            </h3>
            <button
              onClick={() => onNavigate('sensors')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              All Sensors
            </button>
          </div>

          <div className="space-y-2">
            {plotDevices.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center">
                No dedicated IoT telemetry nodes assigned to this plot.
              </p>
            ) : (
              plotDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{dev.name}</span>
                      <span className="font-mono text-[10px] text-stone-400">({dev.deviceUid})</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Model: {dev.hardwareModel} • FW: {dev.firmwareVersion}
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={dev.isOnline ? 'success' : 'danger'} size="sm">
                      {dev.isOnline ? 'ONLINE' : 'OFFLINE'}
                    </Badge>
                    <div className="text-[10px] text-stone-400 mt-1">
                      Signal: {dev.signalRssi} dBm
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plot Maintenance & Service History */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-700" />
              <span>Overhead Cable & Winch Maintenance Records</span>
            </h3>
            <button
              onClick={() => onNavigate('maintenance')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Log Work Order
            </button>
          </div>

          <div className="space-y-2">
            {plotMaintenance.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center">
                No scheduled or previous maintenance service orders for this plot.
              </p>
            ) : (
              plotMaintenance.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{m.title}</span>
                    <Badge variant="neutral" size="sm">
                      {m.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-stone-600">{m.notes}</p>
                  <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-200">
                    <span>Tech: {m.technicianName}</span>
                    <span>Date: {m.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SafetyDisclaimer />
    </div>
  );
};
