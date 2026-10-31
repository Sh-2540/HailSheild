/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Check,
} from 'lucide-react';
import { AlertItem, AlertSeverity, AlertCategory } from '../../types';
import { Badge } from '../common/Badge';

interface AlertsManagerProps {
  alerts: AlertItem[];
  onMarkAsRead: (alertId: string) => void;
  onClearAll?: () => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({ alerts, onMarkAsRead }) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AlertCategory>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && alert.category !== categoryFilter) return false;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Bell className="w-6 h-6 text-emerald-700" />
              <span>Safety & Weather Incident Dispatch Center</span>
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time storm watch, mechanical limit notifications, and IoT gateway connectivity alarms
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            {(['all', 'critical', 'warning', 'info'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  severityFilter === s
                    ? 'bg-white text-stone-900 font-bold shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            {(['all', 'weather', 'canopy', 'device', 'maintenance'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  categoryFilter === c
                    ? 'bg-white text-stone-900 font-bold shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-stone-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-stone-800 text-sm">No Matching Incident Alerts</h4>
            <p className="text-xs text-stone-500">
              All sensors, meteorological indicators, and canopy motors are running within safety specifications.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                !alert.isRead ? 'bg-white shadow-2xs' : 'bg-stone-50/70 text-stone-600'
              } ${
                alert.severity === 'critical'
                  ? 'border-rose-300'
                  : alert.severity === 'warning'
                  ? 'border-amber-300'
                  : 'border-stone-200'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      alert.severity === 'critical'
                        ? 'danger'
                        : alert.severity === 'warning'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-stone-400 capitalize">
                    {alert.category}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-[11px] text-stone-400">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>

                <h4 className="font-bold text-stone-900 text-sm">{alert.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{alert.description}</p>

                {alert.recommendedAction && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-medium">
                    <strong>Recommended Action:</strong> {alert.recommendedAction}
                  </div>
                )}
              </div>

              {!alert.isRead && (
                <div className="shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => onMarkAsRead(alert.id)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
