/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Layers,
  ShieldCheck,
  Activity,
  X,
  FileCheck,
} from 'lucide-react';
import { MaintenanceRecord, Plot, UserRole } from '../../types';

interface MaintenanceRecordsProps {
  records: MaintenanceRecord[];
  plots: Plot[];
  currentUserRole: UserRole;
  currentUserName: string;
  onSaveRecord: (record: MaintenanceRecord) => void;
}

export const MaintenanceRecords: React.FC<MaintenanceRecordsProps> = ({
  records,
  plots,
  currentUserRole,
  currentUserName,
  onSaveRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'pending_parts' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [plotId, setPlotId] = useState(plots[0]?.id || '');
  const [category, setCategory] = useState<MaintenanceRecord['category']>('preventive');
  const [notes, setNotes] = useState('');
  const [parts, setParts] = useState('');
  const [status, setStatus] = useState<MaintenanceRecord['status']>('scheduled');

  const filteredRecords = records.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q) ||
        r.technicianName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const upcomingTasks = records.filter((r) => r.status === 'scheduled');
  const pendingTasks = records.filter((r) => r.status === 'pending_parts');
  const completedTasks = records.filter((r) => r.status === 'completed');

  // Equipment condition metrics
  const equipmentConditions = [
    {
      name: 'Overhead Tension Cables & Turnbuckles',
      status: 'Optimal (320 kg tension)',
      condition: 'Good',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      lastService: '5 days ago',
      notes: 'No cable sag detected across 110m longitudinal spans.',
    },
    {
      name: 'Planetary Winch Motors & Couplers',
      status: '24V DC / 0.8A idle draw',
      condition: 'Inspected',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      lastService: '12 days ago',
      notes: 'Bronze pillow blocks lubricated with marine-grade grease.',
    },
    {
      name: 'Optocoupled Limit Switches',
      status: 'Headpost & Tailpost Active',
      condition: 'Verified',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      lastService: '2 weeks ago',
      notes: 'Contacts cleaned. Optical interlock response < 50ms.',
    },
    {
      name: 'Woven Polyethylene Anti-Hail Netting',
      status: '54g/m² High Tenacity Mesh',
      condition: 'Intact',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      lastService: '1 month ago',
      notes: 'No tears or UV embrittlement. Ready for pre-monsoon squalls.',
    },
  ];

  const openNewModal = () => {
    setTitle('Quarterly Wire Tension & Planetary Drive Check');
    setPlotId(plots[0]?.id || '');
    setCategory('preventive');
    setNotes('Checked cable deflection at mid-span under 15kg test load. Greased drive couplers.');
    setParts('M8 Turnbuckle, 24V Micro-fuse 10A');
    setStatus('scheduled');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const partsList = parts
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const rec: MaintenanceRecord = {
      id: `maint-${Date.now()}`,
      plotId,
      technicianId: 'tech-user',
      technicianName: currentUserName,
      title: title.trim(),
      category,
      notes: notes.trim(),
      date: new Date().toISOString().slice(0, 10),
      partsReplaced: partsList,
      status,
    };

    onSaveRecord(rec);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Preventive Servicing & Mechanical Health
              </span>
              <span className="text-xs text-stone-500">
                Ensuring 100% canopy operational readiness before severe hail events
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-emerald-800" />
              <span>Equipment Maintenance & Service</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Track cable tensioning inspections, winch motor lubrication, limit switch replacements, and scheduled technician dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={openNewModal}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Maintenance</span>
            </button>
          </div>
        </div>

        {/* 3 Status Summary Strips */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setStatusFilter('scheduled')}
            className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 cursor-pointer hover:bg-sky-50 transition-colors"
          >
            <div className="flex items-center justify-between text-sky-900">
              <span className="text-xs font-bold uppercase tracking-wider">Upcoming Tasks</span>
              <Calendar className="w-4 h-4 text-sky-700" />
            </div>
            <div className="text-xl font-extrabold text-sky-950 mt-1 tabular-nums">
              {upcomingTasks.length} Scheduled
            </div>
            <p className="text-[11px] text-sky-800/80 mt-0.5">Pre-monsoon inspections</p>
          </div>

          <div
            onClick={() => setStatusFilter('pending_parts')}
            className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center justify-between text-amber-900">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Tasks</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-xl font-extrabold text-amber-950 mt-1 tabular-nums">
              {pendingTasks.length} Pending Parts
            </div>
            <p className="text-[11px] text-amber-800/80 mt-0.5">Awaiting replacement spares</p>
          </div>

          <div
            onClick={() => setStatusFilter('completed')}
            className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-colors"
          >
            <div className="flex items-center justify-between text-emerald-900">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Service</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-xl font-extrabold text-emerald-950 mt-1 tabular-nums">
              {completedTasks.length} Records
            </div>
            <p className="text-[11px] text-emerald-800/80 mt-0.5">Certified service history</p>
          </div>
        </div>
      </div>

      {/* Equipment Condition Overview */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <span>Current Equipment Condition</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Certified mechanical diagnostic report for Sahyadri Valley Vineyard
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Overall Health: 96%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipmentConditions.map((eq) => (
            <div
              key={eq.name}
              className="p-4 rounded-xl border border-stone-200 bg-[#fbfcf9] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-bold text-stone-900">{eq.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${eq.color}`}>
                  {eq.condition}
                </span>
              </div>
              <div className="text-xs font-semibold text-stone-800">{eq.status}</div>
              <p className="text-[11px] text-stone-500">{eq.notes}</p>
              <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-200/60">
                Last Service: {eq.lastService}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service History & Tasks Log */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-800" />
              <span>Service History & Records ({filteredRecords.length})</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Filter by status or search notes and replaced components
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium ${
                statusFilter === 'all'
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-2.5 py-1 rounded-md font-medium ${
                statusFilter === 'scheduled'
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-md font-medium ${
                statusFilter === 'completed'
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRecords.map((rec) => {
            const plotObj = plots.find((p) => p.id === rec.plotId);
            const statusBadge = {
              completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              pending_parts: 'bg-amber-50 text-amber-800 border-amber-200',
              scheduled: 'bg-sky-50 text-sky-800 border-sky-200',
            }[rec.status];

            return (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-stone-200 bg-[#fbfcf9] text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{rec.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadge}`}>
                      {rec.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className="text-stone-500 font-mono text-[11px]">{rec.date}</span>
                </div>

                <p className="text-stone-600 text-xs">{rec.notes}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-200/60">
                  <span>
                    Plot: <strong className="text-stone-700">{plotObj?.name || 'All Blocks'}</strong>
                  </span>
                  <span>
                    Service Category: <strong className="text-stone-700 uppercase">{rec.category.replace('_', ' ')}</strong>
                  </span>
                  <span>
                    Certified Technician: <strong className="text-stone-700">{rec.technicianName}</strong>
                  </span>
                </div>

                {rec.partsReplaced && rec.partsReplaced.length > 0 && (
                  <div className="text-[11px] text-stone-500">
                    Spares/Parts Serviced: <strong className="text-stone-700">{rec.partsReplaced.join(', ')}</strong>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-500">
              No matching maintenance records found.
            </div>
          )}
        </div>
      </div>

      {/* SCHEDULE MAINTENANCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Log Maintenance Work Order
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quarterly Wire Tension & Planetary Drive Check"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Plot</label>
                  <select
                    value={plotId}
                    onChange={(e) => setPlotId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="preventive">Preventive Inspection</option>
                    <option value="cable_tensioning">Cable Tensioning</option>
                    <option value="motor_service">Winch Motor Service</option>
                    <option value="limit_switch_check">Limit Switch Check</option>
                    <option value="breakdown">Emergency Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Service Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="pending_parts">Pending Replacement Parts</option>
                  <option value="completed">Completed & Verified</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Technical Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record observations, cable tension deflection in mm, motor current draw, etc."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Parts Replaced / Serviced</label>
                <input
                  type="text"
                  value={parts}
                  onChange={(e) => setParts(e.target.value)}
                  placeholder="e.g. M8 Turnbuckle, 24V Fuse, Grease (comma separated)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
