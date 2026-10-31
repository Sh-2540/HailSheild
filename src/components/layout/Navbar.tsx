/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Bell,
  ChevronDown,
  CloudSun,
  Wind,
  CheckCircle2,
  MapPin,
  Globe,
  User as UserIcon,
  Menu,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { db } from '../../services/storage';
import { TRANSLATIONS } from '../../services/i18n';
import { User, UserRole, LiveWeatherData, Farm } from '../../types';

interface NavbarProps {
  currentUser: User;
  activeFarm: Farm | undefined;
  allFarms: Farm[];
  onSelectFarm: (farmId: string) => void;
  onSelectRole: (role: UserRole) => void;
  weather: LiveWeatherData | null;
  onOpenAlerts: () => void;
  onOpenAuth: () => void;
  currentLang: 'en' | 'mr' | 'hi';
  onSelectLang: (lang: 'en' | 'mr' | 'hi') => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeFarm,
  allFarms,
  onSelectFarm,
  onSelectRole,
  weather,
  onOpenAlerts,
  onOpenAuth,
  currentLang,
  onSelectLang,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showFarmMenu, setShowFarmMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAlertsPreview, setShowAlertsPreview] = useState(false);

  const alerts = db.getAlerts(activeFarm?.id);
  const unreadAlerts = alerts.filter((a) => !a.isRead);

  const t = TRANSLATIONS[currentLang];

  const roleConfigs: Record<
    UserRole,
    { label: string; desc: string; badgeClass: string }
  > = {
    farmer: {
      label: 'Farmer / Owner',
      desc: 'Simple dashboard, canopy & plot defense',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    farm_manager: {
      label: 'Farm Manager',
      desc: 'Multi-plot operations & team records',
      badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    },
    technician: {
      label: 'Field Technician',
      desc: 'Hardware diagnostics & mechanical service',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    admin: {
      label: 'Administrator',
      desc: 'Fleet management & firmware config',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  };

  const hailRiskStyle = {
    LOW: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    MODERATE: 'text-amber-700 bg-amber-50 border-amber-200',
    HIGH: 'text-orange-700 bg-orange-50 border-orange-200',
    CRITICAL: 'text-rose-700 bg-rose-50 border-rose-200 font-bold',
  }[weather?.hailRiskScore || 'LOW'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs">
      <div className="px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 -ml-1 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-30_at_8.59.20_AM_bf57edc3.jpeg"
              alt="KhetKavach Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg border border-stone-200/80 bg-white p-0.5 shadow-2xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-emerald-950">
                  KhetKavach
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  HailShield
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 hidden sm:block">
                Protection for Every Harvest
              </p>
            </div>
          </div>
        </div>

        {/* Center: Active Farm Selector (Responsive for both desktop & mobile) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFarmMenu(!showFarmMenu);
              setShowRoleMenu(false);
              setShowLangMenu(false);
              setShowAlertsPreview(false);
            }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-stone-200 bg-[#f8faf7] hover:bg-stone-100 transition-colors text-left"
            title="Switch Active Farm"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <div className="max-w-[90px] sm:max-w-[200px]">
              <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 truncate">
                <span className="truncate">{activeFarm?.name || 'Select Farm'}</span>
              </div>
              <p className="text-[10px] text-stone-500 truncate hidden sm:block">
                {activeFarm?.taluka}, {activeFarm?.district} ({activeFarm?.totalAreaAcres || 0} {t.acres})
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-stone-400 shrink-0 ml-0.5" />
          </button>

          {showFarmMenu && (
            <div className="fixed sm:absolute top-14 sm:top-auto left-3 right-3 sm:left-0 sm:right-auto sm:mt-2 sm:w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50">
              <div className="px-2 py-1.5 text-[10px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                <span>Select Active Farm</span>
                <span className="text-[10px] text-emerald-800 font-bold sm:hidden">
                  {allFarms.length} Farms
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {allFarms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => {
                      onSelectFarm(farm.id);
                      setShowFarmMenu(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      farm.id === activeFarm?.id
                        ? 'bg-emerald-50 text-emerald-950 font-medium'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{farm.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {farm.taluka}, {farm.district} • {farm.totalAreaAcres} {t.acres}
                      </div>
                    </div>
                    {farm.id === activeFarm?.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Controls: Weather Glance, Language, Notifications, User Profile & Role */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Weather Quick Glance */}
          {weather && (
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-[#fbfcf9] border border-stone-200 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-stone-800">
                <CloudSun className="w-4 h-4 text-amber-600" />
                <span className="font-semibold tabular-nums">{weather.temperatureC}°C</span>
              </div>
              <div className="h-3 w-px bg-stone-200" />
              <div className="flex items-center gap-1.5 text-stone-600">
                <Wind className="w-3.5 h-3.5 text-emerald-700" />
                <span className="tabular-nums">{weather.windSpeedKmh} km/h</span>
              </div>
              <div className="h-3 w-px bg-stone-200" />
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${hailRiskStyle}`}
              >
                Hail: {weather.hailRiskScore}
              </span>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowFarmMenu(false);
                setShowRoleMenu(false);
                setShowAlertsPreview(false);
              }}
              className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-800" />
              <span className="font-semibold uppercase">{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {showLangMenu && (
              <div className="fixed sm:absolute top-14 sm:top-auto right-3 sm:right-0 sm:mt-2 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50">
                <button
                  onClick={() => {
                    onSelectLang('en');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between ${
                    currentLang === 'en'
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>English</span>
                  {currentLang === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                </button>
                <button
                  onClick={() => {
                    onSelectLang('mr');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between ${
                    currentLang === 'mr'
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>मराठी (Marathi)</span>
                  {currentLang === 'mr' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                </button>
                <button
                  onClick={() => {
                    onSelectLang('hi');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between ${
                    currentLang === 'hi'
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {currentLang === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAlertsPreview(!showAlertsPreview);
                setShowFarmMenu(false);
                setShowRoleMenu(false);
                setShowLangMenu(false);
              }}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              title="Alerts and Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
              )}
            </button>

            {showAlertsPreview && (
              <div className="fixed sm:absolute top-16 sm:top-auto right-3 sm:right-0 sm:mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900">
                    Farm Alerts ({unreadAlerts.length} unread)
                  </span>
                  <button
                    onClick={() => {
                      setShowAlertsPreview(false);
                      onOpenAlerts();
                    }}
                    className="text-[11px] text-emerald-700 hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                  {alerts.slice(0, 3).map((a) => (
                    <div
                      key={a.id}
                      className={`p-2 rounded-lg text-xs ${
                        a.severity === 'critical'
                          ? 'bg-rose-50 border border-rose-200 text-rose-900'
                          : 'bg-stone-50 border border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">
                        {a.description}
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-xs text-stone-500 py-3 text-center">
                      No active alerts. All systems normal.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowFarmMenu(false);
                setShowLangMenu(false);
                setShowAlertsPreview(false);
              }}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-stone-50 transition-colors"
            >
              <img
                src={currentUser.avatarUrl || '/src/assets/images/farmer_portrait_avatar_1793376499951.jpg'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-stone-200"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-stone-900 leading-tight">
                  {currentUser.name}
                </div>
                <span
                  className={`inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded border ${
                    roleConfigs[currentUser.role]?.badgeClass || ''
                  }`}
                >
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-0.5" />
            </button>

            {showRoleMenu && (
              <div className="fixed sm:absolute top-16 sm:top-auto right-3 sm:right-0 sm:mt-2 w-[calc(100vw-1.5rem)] sm:w-72 max-w-sm bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                  <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5 font-medium">
                    {currentUser.organizationName}
                  </p>
                </div>

                <div className="p-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Switch Operational Role
                  </div>
                  {(['farmer', 'farm_manager', 'technician', 'admin'] as UserRole[]).map(
                    (role) => {
                      const cfg = roleConfigs[role];
                      const isCurrent = currentUser.role === role;
                      return (
                        <button
                          key={role}
                          onClick={() => {
                            onSelectRole(role);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                            isCurrent
                              ? 'bg-emerald-50 text-emerald-950 font-semibold'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-stone-900">{cfg.label}</div>
                            <div className="text-[10px] text-stone-500">{cfg.desc}</div>
                          </div>
                          {isCurrent && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="border-t border-stone-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-stone-600 hover:bg-stone-50 font-medium"
                  >
                    Manage Account & Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
