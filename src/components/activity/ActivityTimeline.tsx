/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
  Calendar,
  User,
  Trees,
} from 'lucide-react';
import { ActivityRecord, Farm } from '../../types';

interface ActivityTimelineProps {
  activities: ActivityRecord[];
  activeFarm: Farm | undefined;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  activeFarm,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = activities.filter((act) => {
    if (filterType !== 'all') {
      if (filterType === 'canopy' && !act.actionType.includes('CANOPY') && !act.actionType.includes('MODE')) {
        return false;
      }
      if (filterType === 'weather' && !act.actionType.includes('WEATHER') && !act.actionType.includes('ALERT')) {
        return false;
      }
      if (filterType === 'maint' && !act.actionType.includes('MAINT')) {
        return false;
      }
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        act.description.toLowerCase().includes(q) ||
        act.userName.toLowerCase().includes(q) ||
        act.actionType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action Type', 'Description'];
    const rows = filtered.map((a) => [
      `"${a.timestamp}"`,
      `"${a.userName}"`,
      `"${a.userRole}"`,
      `"${a.actionType}"`,
      `"${a.description.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khetkavach_activity_${new Date().toISOString().slice(0, 10)}.csv`;
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
                Audit Trail & Operation Logs
              </span>
              <span className="text-xs text-stone-500">
                {activeFarm?.name || 'All Farms'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-800" />
              <span>Farm Activity History</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Chronological ledger of motorized canopy deployments, automatic storm alerts, mode toggles, and technician service completions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Events ({activities.length})
            </button>
            <button
              onClick={() => setFilterType('canopy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'canopy'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Canopy Movements
            </button>
            <button
              onClick={() => setFilterType('weather')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'weather'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Weather Advisories
            </button>
            <button
              onClick={() => setFilterType('maint')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'maint'
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Maintenance
            </button>
          </div>

          <input
            type="text"
            placeholder="Search records by name, action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 bg-[#fbfcf9] border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
        <div className="space-y-4">
          {filtered.map((item, idx) => {
            const isCanopyDeploy = item.actionType.includes('DEPLOY') || item.actionType.includes('CLOSE');
            const isCanopyRetract = item.actionType.includes('RETRACT') || item.actionType.includes('OPEN');
            const isAlert = item.actionType.includes('ALERT') || item.actionType.includes('WEATHER');

            const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }) + ' • ' + new Date(item.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="flex items-start gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                    isCanopyDeploy
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isCanopyRetract
                      ? 'bg-stone-100 text-stone-700 border-stone-200'
                      : isAlert
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}
                >
                  {isCanopyDeploy ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  ) : isCanopyRetract ? (
                    <RotateCcw className="w-5 h-5 text-stone-600" />
                  ) : isAlert ? (
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-sky-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-stone-900">{item.description}</h3>
                    <span className="text-[11px] text-stone-400 font-mono sm:text-right shrink-0">
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 font-medium text-stone-700">
                      <User className="w-3 h-3 text-stone-400" />
                      {item.userName}
                    </span>
                    <span>•</span>
                    <span className="uppercase text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {item.userRole.replace('_', ' ')}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-stone-400">{item.actionType}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-500">
              No matching activity records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
