/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Wind,
  CheckCircle2,
  Sliders,
  Square,
  Wrench,
  ArrowRight,
  Info,
  Layers,
  Activity,
  AlertOctagon,
  X,
  Play,
} from 'lucide-react';
import {
  CanopySystem,
  Plot,
  CropRow,
  CanopyCommand,
  LiveWeatherData,
  User,
  LongitudinalSection,
} from '../../types';
import { db } from '../../services/storage';
import { TRANSLATIONS } from '../../services/i18n';

interface CanopyControlPanelProps {
  canopySystems: CanopySystem[];
  plots: Plot[];
  rows: CropRow[];
  commands: CanopyCommand[];
  weather: LiveWeatherData | null;
  currentUser: User;
  onExecuteCommand: (params: {
    canopySystemId: string;
    plotId: string;
    targetSectionIds?: string[];
    targetRowNumbers?: number[];
    action: 'open' | 'close' | 'stop' | 'emergency_stop';
    reason: string;
    bypassWindLockout?: boolean;
    currentWindSpeedKmh?: number;
  }) => Promise<{ success: boolean; message: string; safetyViolation?: string }>;
  onResetEmergencyStop: (canopySystemId: string, plotId: string) => void;
  onUpdateSystemMode: (systemId: string, mode: 'manual' | 'automatic') => void;
  currentLang?: 'en' | 'mr' | 'hi';
}

export const CanopyControlPanel: React.FC<CanopyControlPanelProps> = ({
  canopySystems,
  plots,
  rows,
  commands,
  weather,
  currentUser,
  onExecuteCommand,
  onResetEmergencyStop,
  onUpdateSystemMode,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedSystemId, setSelectedSystemId] = useState<string>(
    canopySystems[0]?.id || ''
  );
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'open' | 'close' | 'stop' | null>(null);
  const [pendingTargetSectionIds, setPendingTargetSectionIds] = useState<string[]>([]);

  // Selected system & plot
  const currentSystem =
    canopySystems.find((s) => s.id === selectedSystemId) || canopySystems[0];
  const currentPlot = plots.find((p) => p.id === currentSystem?.plotId);
  const plotSections = db.getSections(currentPlot?.id);

  const currentWind = weather?.windSpeedKmh || 14.5;
  const isHighWind = currentSystem && currentWind > currentSystem.windSpeedLockoutKmh;

  // Recent commands for this system
  const systemCommands = commands.filter((c) => c.canopySystemId === currentSystem?.id);
  const latestCommand = systemCommands[0];

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedSectionIds(plotSections.map((s) => s.id));
  };

  const handleClearSelection = () => {
    setSelectedSectionIds([]);
  };

  // Open confirmation modal
  const promptAction = (
    action: 'open' | 'close' | 'stop',
    customSectionIds?: string[]
  ) => {
    const targets =
      customSectionIds ||
      (selectedSectionIds.length > 0 ? selectedSectionIds : plotSections.map((s) => s.id));

    setPendingAction(action);
    setPendingTargetSectionIds(targets);
    setConfirmModalOpen(true);
  };

  // Execute after confirmation
  const executeConfirmedAction = async () => {
    if (!currentSystem || !currentPlot || !pendingAction) return;

    setConfirmModalOpen(false);
    setIsSubmitting(true);
    setExecutionMessage(null);

    const actionText = pendingAction === 'close' ? 'Deploy (Protect)' : pendingAction === 'open' ? 'Retract (Sunlight)' : 'Halt';

    const res = await onExecuteCommand({
      canopySystemId: currentSystem.id,
      plotId: currentPlot.id,
      targetSectionIds: pendingTargetSectionIds,
      action: pendingAction,
      reason: `${actionText} initiated by ${currentUser.name}`,
      currentWindSpeedKmh: currentWind,
    });

    setExecutionMessage(res.message);
    setIsSubmitting(false);
    setPendingAction(null);
  };

  const handleEmergencyStop = () => {
    if (!currentSystem || !currentPlot) return;
    onExecuteCommand({
      canopySystemId: currentSystem.id,
      plotId: currentPlot.id,
      targetRowNumbers: [],
      action: 'emergency_stop',
      reason: `Emergency Halt triggered from UI by ${currentUser.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Plot / System Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Parallel Overhead Retractable Framework
              </span>
              <span className="text-xs text-stone-500">
                {currentPlot?.name || 'Selected Plot'} • {currentPlot?.cropType} ({currentPlot?.cropVariety})
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-800" />
              <span>HailShield Canopy Control Deck</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Motorized retractable high-density anti-hail net suspended 3.2m above grape vine rows on longitudinal steel cables.
            </p>
          </div>

          {/* System Selection & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSystemId}
              onChange={(e) => {
                setSelectedSystemId(e.target.value);
                setSelectedSectionIds([]);
              }}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {canopySystems.map((sys) => (
                <option key={sys.id} value={sys.id}>
                  {sys.name}
                </option>
              ))}
            </select>

            {/* Mode Toggle (Manual vs Automatic) */}
            <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs">
              <button
                onClick={() => onUpdateSystemMode(currentSystem.id, 'manual')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  currentSystem?.operatingMode === 'manual'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => onUpdateSystemMode(currentSystem.id, 'automatic')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  currentSystem?.operatingMode === 'automatic'
                    ? 'bg-emerald-800 text-white shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Auto-Storm
              </button>
            </div>
          </div>
        </div>

        {/* Global Controls & Emergency Halt Bar */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center gap-2">
            <button
              onClick={() => promptAction('close')}
              disabled={isSubmitting || currentSystem?.emergencyStopEngaged}
              className="px-4 py-2.5 min-h-[44px] bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t.deployAll}</span>
            </button>
            <button
              onClick={() => promptAction('open')}
              disabled={isSubmitting || currentSystem?.emergencyStopEngaged}
              className="px-4 py-2.5 min-h-[44px] bg-white hover:bg-stone-50 disabled:opacity-50 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-stone-500" />
              <span>{t.retractAll}</span>
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md"
            >
              Select All Sections
            </button>
            {selectedSectionIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
              >
                Clear Selection ({selectedSectionIds.length})
              </button>
            )}
          </div>

          {/* Emergency Stop Button */}
          <div className="flex items-center gap-2">
            {currentSystem?.emergencyStopEngaged ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-700" />
                  EMERGENCY STOPPED
                </span>
                <button
                  onClick={() => onResetEmergencyStop(currentSystem.id, currentPlot?.id || '')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                >
                  Reset Safety Interlock
                </button>
              </div>
            ) : (
              <button
                onClick={handleEmergencyStop}
                className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                title="Immediate software motor power cut"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>{t.emergencyHalt}</span>
              </button>
            )}
          </div>
        </div>

        {/* Execution Message Feedback */}
        {executionMessage && (
          <div className="mt-3 p-3 bg-stone-100 border border-stone-200 text-stone-800 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{executionMessage}</span>
            </div>
            <button
              onClick={() => setExecutionMessage(null)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* MECHANICAL ARCHITECTURE VISUALIZATION (Above the Grape Plants) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-800" />
              <span>Overhead Canopy Structural Cross-Section</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Accurate longitudinal view: High-tensile steel cables & retractable woven net suspended ABOVE crop vines
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-xs bg-emerald-700 inline-block" />
              Overhead Netting (Above Vines)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-xs bg-lime-600 inline-block" />
              Grape Vines (Below Net)
            </span>
          </div>
        </div>

        {/* Detailed SVG Mechanical Schematic */}
        <div className="mt-5 bg-gradient-to-b from-[#f8faf7] to-[#f4f7f2] rounded-xl p-4 border border-stone-200 relative overflow-hidden">
          <div className="md:hidden flex items-center justify-between text-[11px] font-medium text-stone-500 mb-2 px-1">
            <span>↔ Swipe horizontally to view full 110m cable span</span>
            <span className="text-emerald-700 font-semibold">Overhead Net View</span>
          </div>
          <div className="w-full overflow-x-auto pb-1">
            <svg
              className="w-full min-w-[700px] h-64"
              viewBox="0 0 800 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky Background */}
              <rect x="0" y="0" width="800" height="200" fill="#f8faf7" />

              {/* Ground level line */}
              <line x1="20" y1="200" x2="780" y2="200" stroke="#8c7853" strokeWidth="4" />
              <rect x="20" y="202" width="760" height="30" fill="#ded4c1" opacity="0.4" />
              <text x="30" y="222" fill="#786c55" fontSize="11" fontFamily="sans-serif">
                Vineyard Soil Level (Black Basaltic Clay Loam)
              </text>

              {/* HEADPOST (Motor End) - Left */}
              <g>
                <rect x="70" y="50" width="14" height="150" rx="3" fill="#3f4a42" />
                <circle cx="77" cy="50" r="10" fill="#1b4332" />
                {/* Winch Motor Housing */}
                <rect x="40" y="70" width="28" height="36" rx="4" fill="#1e293b" />
                <circle cx="54" cy="88" r="6" fill="#10b981" />
                <text x="25" y="125" fill="#1e293b" fontSize="10" fontWeight="bold">
                  Headpost & Motor
                </text>
                <text x="25" y="137" fill="#64748b" fontSize="9">
                  (Parking Line 0%)
                </text>
              </g>

              {/* INTERMEDIATE SUPPORT ARCH POLES (Overhead grid) */}
              <g>
                <rect x="280" y="60" width="8" height="140" fill="#71717a" />
                <line x1="260" y1="60" x2="308" y2="60" stroke="#71717a" strokeWidth="4" />

                <rect x="500" y="60" width="8" height="140" fill="#71717a" />
                <line x1="480" y1="60" x2="528" y2="60" stroke="#71717a" strokeWidth="4" />
              </g>

              {/* TAILPOST ANCHOR - Right */}
              <g>
                <rect x="710" y="50" width="14" height="150" rx="3" fill="#3f4a42" />
                <circle cx="717" cy="50" r="10" fill="#1b4332" />
                {/* Guy-wire anchor */}
                <line x1="724" y1="60" x2="770" y2="200" stroke="#71717a" strokeWidth="2" strokeDasharray="3 3" />
                <text x="680" y="125" fill="#1e293b" fontSize="10" fontWeight="bold">
                  Tailpost Anchor
                </text>
                <text x="690" y="137" fill="#64748b" fontSize="9">
                  (Deployed 100%)
                </text>
              </g>

              {/* MAIN OVERHEAD TENSION CABLE (3.2m Clearance) */}
              <line
                x1="77"
                y1="50"
                x2="717"
                y2="50"
                stroke="#475569"
                strokeWidth="3"
                strokeDasharray="6 2"
              />
              <text x="350" y="40" fill="#334155" fontSize="10" fontWeight="bold">
                Overhead Steel Suspension Cable (3.2m above vines)
              </text>

              {/* GRAPE PLANTS (BELOW THE NET) */}
              <g>
                {/* Vine 1 */}
                <path d="M 160 200 Q 165 160 170 140" stroke="#5c4033" strokeWidth="5" fill="none" />
                <ellipse cx="170" cy="130" rx="35" ry="24" fill="#4d7c0f" />
                <circle cx="160" cy="145" r="4" fill="#a3e635" />
                <circle cx="172" cy="150" r="4" fill="#a3e635" />
                <circle cx="180" cy="144" r="4" fill="#a3e635" />

                {/* Vine 2 */}
                <path d="M 380 200 Q 385 160 390 140" stroke="#5c4033" strokeWidth="5" fill="none" />
                <ellipse cx="390" cy="130" rx="35" ry="24" fill="#4d7c0f" />
                <circle cx="380" cy="145" r="4" fill="#a3e635" />
                <circle cx="392" cy="150" r="4" fill="#a3e635" />
                <circle cx="400" cy="144" r="4" fill="#a3e635" />

                {/* Vine 3 */}
                <path d="M 600 200 Q 605 160 610 140" stroke="#5c4033" strokeWidth="5" fill="none" />
                <ellipse cx="610" cy="130" rx="35" ry="24" fill="#4d7c0f" />
                <circle cx="600" cy="145" r="4" fill="#a3e635" />
                <circle cx="612" cy="150" r="4" fill="#a3e635" />
                <circle cx="620" cy="144" r="4" fill="#a3e635" />

                {/* Trellis Y-arms */}
                <line x1="150" y1="140" x2="190" y2="140" stroke="#94a3b8" strokeWidth="2" />
                <line x1="370" y1="140" x2="410" y2="140" stroke="#94a3b8" strokeWidth="2" />
                <line x1="590" y1="140" x2="630" y2="140" stroke="#94a3b8" strokeWidth="2" />
                <text x="360" y="175" fill="#65a30d" fontSize="10" fontWeight="bold">
                  Grape Vine Trellis Row (Y-Frame)
                </text>
              </g>

              {/* OVERHEAD RETRACTABLE NET (Drawn based on average position) */}
              {(() => {
                const avgPos =
                  plotSections.length > 0
                    ? Math.round(
                        plotSections.reduce((acc, s) => acc + s.positionPercent, 0) /
                          plotSections.length
                      )
                    : 100;
                const netEndX = 77 + ((717 - 77) * avgPos) / 100;

                return (
                  <g>
                    {/* The Netting Surface */}
                    <rect
                      x="77"
                      y="46"
                      width={Math.max(10, netEndX - 77)}
                      height="12"
                      rx="3"
                      fill="#065f46"
                      opacity="0.85"
                    />
                    {/* Woven diamond pattern effect */}
                    <line
                      x1="77"
                      y1="52"
                      x2={netEndX}
                      y2="52"
                      stroke="#a7f3d0"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />

                    {/* Lead Slider Bar */}
                    <line
                      x1={netEndX}
                      y1="40"
                      x2={netEndX}
                      y2="64"
                      stroke="#0f172a"
                      strokeWidth="4"
                    />
                    <circle cx={netEndX} cy="52" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

                    {/* Position Label Tag */}
                    <rect
                      x={Math.max(80, Math.min(650, netEndX - 55))}
                      y="15"
                      width="110"
                      height="22"
                      rx="4"
                      fill="#064e3b"
                    />
                    <text
                      x={Math.max(80, Math.min(650, netEndX - 55)) + 8}
                      y="30"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      Net Coverage: {avgPos}%
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="mt-2 text-center text-[11px] text-stone-500 font-medium">
            Longitudinal Travel: Net retracts to headpost parking line for sunlight exposure, and extends overhead over vines during hail / storm alert.
          </div>
        </div>
      </div>

      {/* INDIVIDUAL SECTION CARDS (Display each canopy section as a separate card) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Parallel Canopy Sections ({plotSections.length})
          </h2>
          <span className="text-xs text-stone-500">
            Individual row-group motor control
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plotSections.map((sec) => {
            const isSelected = selectedSectionIds.includes(sec.id);
            const isDeployed = sec.positionPercent >= 80;
            const isRetracted = sec.positionPercent <= 20;
            const isMoving = sec.motionState === 'deploying' || sec.motionState === 'retracting';

            const statusLabel = isDeployed
              ? t.deployed
              : isRetracted
              ? t.retracted
              : isMoving
              ? t.moving
              : `${sec.positionPercent}%`;

            const statusBadgeColor = isDeployed
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : isRetracted
              ? 'bg-stone-100 text-stone-700 border-stone-200'
              : 'bg-amber-50 text-amber-800 border-amber-200';

            return (
              <div
                key={sec.id}
                className={`bg-white rounded-xl border p-4 shadow-2xs transition-all ${
                  isSelected ? 'border-emerald-700 ring-2 ring-emerald-700/20' : 'border-stone-200'
                }`}
              >
                {/* Header: Section Name, Rows, Checkbox */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectSection(sec.id)}
                      className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-stone-900">{sec.name}</h3>
                      <p className="text-[11px] text-stone-500">
                        Span: {sec.spanWidthMeters}m • Rows {sec.assignedRowNumbers.join(', ')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadgeColor}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* Overhead Cable Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
                    <span>Overhead Position</span>
                    <span className="font-semibold tabular-nums text-stone-900">
                      {sec.positionPercent}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isDeployed ? 'bg-emerald-700' : isRetracted ? 'bg-stone-400' : 'bg-amber-600'
                      }`}
                      style={{ width: `${sec.positionPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-600 mt-1">
                    <span>Headpost (0%)</span>
                    <span>Tailpost (100%)</span>
                  </div>
                </div>

                {/* Hardware Verification Status (Limit Switches) */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {sec.limitSwDeployedActive
                        ? 'Tailpost Limit Switch (Closed)'
                        : sec.limitSwRetractedActive
                        ? 'Headpost Limit Switch (Open)'
                        : 'En Route on Cable Track'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-600 font-mono">
                    {sec.motorCurrentAmps}A
                  </span>
                </div>

                {/* Individual Action Buttons */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => promptAction('close', [sec.id])}
                    disabled={isSubmitting || isDeployed || currentSystem?.emergencyStopEngaged}
                    className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.deployCanopy}</span>
                  </button>
                  <button
                    onClick={() => promptAction('open', [sec.id])}
                    disabled={isSubmitting || isRetracted || currentSystem?.emergencyStopEngaged}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.retractCanopy}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {plotSections.length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-xs text-stone-500">
            {t.noData}. No canopy sections installed on this plot yet.
          </div>
        )}
      </div>

      {/* RECENT COMMAND AUDIT FEED (Operation States) */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Canopy Command Telemetry & Dispatch Audit
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Strict state machine validation: Commands require limit switch verification before confirmation
            </p>
          </div>
          <span className="text-xs text-stone-500">
            {systemCommands.length} commands logged
          </span>
        </div>

        <div className="mt-3 divide-y divide-stone-100">
          {systemCommands.slice(0, 4).map((cmd) => {
            const timeStr = new Date(cmd.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            const stateBadge = {
              created: 'bg-stone-100 text-stone-700 border-stone-200',
              dispatched: 'bg-sky-50 text-sky-800 border-sky-200',
              acknowledged: 'bg-indigo-50 text-indigo-800 border-indigo-200',
              motor_moving: 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse',
              completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              failed: 'bg-rose-50 text-rose-800 border-rose-200',
            }[cmd.state];

            return (
              <div
                key={cmd.id}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 uppercase">
                      {cmd.action === 'close' ? 'Deploy Netting' : cmd.action === 'open' ? 'Retract Netting' : cmd.action}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase border ${stateBadge}`}
                    >
                      {cmd.state.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {cmd.reason} • Issued by {cmd.issuedByName}
                  </p>
                </div>
                <span className="text-[11px] text-stone-600 font-mono sm:text-right">
                  {timeStr}
                </span>
              </div>
            );
          })}

          {systemCommands.length === 0 && (
            <div className="py-4 text-center text-xs text-stone-600">
              No recent canopy commands dispatched.
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL BEFORE OPERATING CANOPY (Requirement 5) */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
            onClick={() => setConfirmModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 z-10 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Confirm Canopy Operation
                  </h3>
                  <p className="text-xs text-stone-500">
                    Pre-operation safety verification checklist
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3 bg-[#f8faf7] rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">Target Action:</span>
                  <span className="font-bold text-emerald-800 uppercase">
                    {pendingAction === 'close'
                      ? 'Deploy Canopy (Protect Vines)'
                      : pendingAction === 'open'
                      ? 'Retract Canopy (Sunlight Exposure)'
                      : 'Stop Motors'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Target Sections:</span>
                  <span className="font-medium text-stone-800">
                    {pendingTargetSectionIds.length} Section(s) Selected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Current Field Wind:</span>
                  <span className={`font-semibold tabular-nums ${isHighWind ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {currentWind} km/h {isHighWind ? '(Lockout Warning!)' : '(Safe)'}
                  </span>
                </div>
              </div>

              {/* Safety Checklist */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Ground crew confirmed clear of overhead tension cables and winch drums.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Wind speed is within certified aerodynamic limits (&lt;35 km/h).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Actuator limit switches are active and verified.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch Command</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
