/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  User as UserIcon,
  Bell,
  Lock,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Shield,
  Terminal,
} from 'lucide-react';
import { User, UserRole, Farm, IoTDevice } from '../../types';
import { db } from '../../services/storage';
import { HardwareGatewayConsole } from '../hardware/HardwareGatewayConsole';

interface SettingsPageProps {
  currentUser: User;
  activeFarm: Farm | undefined;
  devices: IoTDevice[];
  currentLang: 'en' | 'mr' | 'hi';
  onSelectLang: (lang: 'en' | 'mr' | 'hi') => void;
  onSelectRole: (role: UserRole) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  activeFarm,
  devices,
  currentLang,
  onSelectLang,
  onSelectRole,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'hardware'>('profile');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98220 14829');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [autoHailTrigger, setAutoHailTrigger] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const isTechnicianOrAdmin = currentUser.role === 'technician' || currentUser.role === 'admin';

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    db.setCurrentUser({
      ...currentUser,
      phone,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Account & Preferences
              </span>
              <span className="text-xs text-stone-500">
                Current Role: <strong className="text-stone-800 uppercase">{currentUser.role.replace('_', ' ')}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-800" />
              <span>Platform Settings</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Configure notification channels, storm alert triggers, language, and role-based device administration.
            </p>
          </div>

          {/* Settings Tabs */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Profile & Language
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Alert Channels
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'hardware'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Hardware & Diagnostics</span>
              {isTechnicianOrAdmin && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Preferences saved successfully.</span>
        </div>
      )}

      {/* TAB 1: PROFILE & LANGUAGE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
            User Profile & Agricultural Entity
          </h2>

          <form onSubmit={handleSavePreferences} className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Mobile / WhatsApp Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98220 14829"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                Required for real-time IMD / HailShield SMS squall dispatches.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Application Language</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'mr', label: 'मराठी (Marathi)' },
                  { id: 'hi', label: 'हिन्दी (Hindi)' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onSelectLang(l.id as any)}
                    className={`py-2 px-3 rounded-lg border text-center font-semibold text-xs transition-colors ${
                      currentLang === l.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
            Emergency Dispatch & Storm Notification Preferences
          </h2>

          <div className="space-y-4 max-w-xl text-xs text-stone-700">
            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-stone-200 bg-[#fbfcf9]">
              <div>
                <strong className="block text-stone-900 mb-0.5">Automated Convective Hail Trigger</strong>
                <p className="text-[11px] text-stone-500">
                  Automatically engage motorized canopies when optical hail sensor registers severe convective activity.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoHailTrigger}
                onChange={(e) => setAutoHailTrigger(e.target.checked)}
                className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700 mt-1"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-stone-200 bg-[#fbfcf9]">
              <div>
                <strong className="block text-stone-900 mb-0.5">WhatsApp Squall Advisories</strong>
                <p className="text-[11px] text-stone-500">
                  Receive instant WhatsApp alerts when high-wind (&gt;35 km/h) or convective hail fronts form within 15 km of your farm.
                </p>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700 mt-1"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-stone-200 bg-[#fbfcf9]">
              <div>
                <strong className="block text-stone-900 mb-0.5">SMS Urgent Dispatch (Fallback)</strong>
                <p className="text-[11px] text-stone-500">
                  Send high-priority SMS alerts if field internet connectivity drops or power fails.
                </p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700 mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HARDWARE & RESTRICTED TECHNICIAN CONSOLE */}
      {activeTab === 'hardware' && (
        <div>
          {isTechnicianOrAdmin ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <Sliders className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-sm">
                    Restricted Field Engineering Console ({currentUser.role.toUpperCase()})
                  </strong>
                  <p className="mt-0.5">
                    This technical diagnostics console is restricted to certified technicians and administrators. Normal farmers only see simple actions (Deploy, Retract, Weather, Alerts).
                  </p>
                </div>
              </div>

              {/* Existing Hardware Gateway Console safely mounted inside restricted tech mode */}
              <HardwareGatewayConsole devices={devices} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-2xs text-center space-y-3 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-500">
                <Lock className="w-6 h-6 text-stone-600" />
              </div>
              <h2 className="text-base font-bold text-stone-900">
                Hardware Configuration Restricted
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                Raw firmware source code, GPIO pin numbers, and RS485 relay mappings are maintained exclusively by certified KHETKAVACH field engineers to ensure physical safety and warranty integrity.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => onSelectRole('technician')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Switch to Field Technician Role (Testing)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
