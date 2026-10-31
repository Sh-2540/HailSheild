/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Trees,
  Grid,
  Columns3,
  Shield,
  CloudLightning,
  Activity,
  History,
  Wrench,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  X,
  PhoneCall,
} from 'lucide-react';
import { NavTab, UserRole, Farm } from '../../types';
import { TRANSLATIONS } from '../../services/i18n';

export type { NavTab };

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  canopySimulationMode?: boolean;
  activeHailAlert?: boolean;
  userRole?: UserRole;
  currentLang?: 'en' | 'mr' | 'hi';
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  activeFarm?: Farm;
  allFarms?: Farm[];
  onSelectFarm?: (farmId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  canopySimulationMode = true,
  activeHailAlert = false,
  userRole = 'farmer',
  currentLang = 'en',
  isMobileOpen = false,
  onCloseMobile,
  activeFarm,
  allFarms = [],
  onSelectFarm,
}) => {
  const t = TRANSLATIONS[currentLang];

  interface NavItem {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
      ],
    },
    {
      title: 'Farm Management',
      items: [
        { id: 'farms', label: t.myFarms, icon: Trees },
        { id: 'plots', label: t.myPlots, icon: Grid },
        { id: 'rows', label: t.cropRowManagement, icon: Columns3 },
      ],
    },
    {
      title: 'Protection',
      items: [
        {
          id: 'canopy',
          label: t.canopyControl,
          icon: Shield,
          badge: canopySimulationMode ? 'Sim Ready' : 'Active',
          badgeColor: canopySimulationMode
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-emerald-100 text-emerald-900 border-emerald-300',
        },
        {
          id: 'weather',
          label: t.weatherAlerts,
          icon: CloudLightning,
          badge: activeHailAlert ? 'Hail Alert' : undefined,
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
        },
        { id: 'sensors', label: t.sensorMonitoring, icon: Activity },
      ],
    },
    {
      title: 'Operations',
      items: [
        { id: 'activity', label: t.activityHistory, icon: History },
        { id: 'maintenance', label: t.maintenance, icon: Wrench },
      ],
    },
    {
      title: 'Insights',
      items: [
        { id: 'reports', label: t.analyticsReports, icon: BarChart3 },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'subscription', label: t.subscriptionPlans, icon: CreditCard },
        {
          id: 'settings',
          label: t.settings,
          icon: Settings,
          badge: userRole === 'technician' || userRole === 'admin' ? 'Tech Mode' : undefined,
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        },
        { id: 'support', label: t.helpSupport, icon: HelpCircle },
      ],
    },
  ];

  const handleItemClick = (id: NavTab) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-[#fbfcf9] text-stone-800 border-r border-stone-200 w-64 shrink-0 select-none">
      {/* Mobile close button header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-10-30_at_8.59.20_AM_bf57edc3.jpeg"
            alt="KhetKavach Logo"
            className="w-7 h-7 object-contain rounded-md border border-stone-200 p-0.5"
          />
          <span className="font-bold text-sm text-emerald-950">KhetKavach</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1 text-stone-500 hover:text-stone-900 rounded-lg"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Active Farm Quick Switcher */}
      {allFarms.length > 0 && (
        <div className="md:hidden p-3 bg-[#f3f7f0] border-b border-stone-200">
          <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Selected Farm</span>
            <span className="text-[10px] text-stone-500 font-normal">
              {activeFarm?.totalAreaAcres || 0} {t.acres}
            </span>
          </div>
          <select
            value={activeFarm?.id || ''}
            onChange={(e) => {
              if (onSelectFarm) onSelectFarm(e.target.value);
            }}
            className="w-full text-xs font-semibold text-stone-900 bg-white border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-700 outline-none"
          >
            {allFarms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} • {f.taluka}, {f.district}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Brand Header */}
      <div className="hidden md:flex items-center gap-3 px-4 py-3.5 border-b border-stone-200/80 bg-white">
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-10-30_at_8.59.20_AM_bf57edc3.jpeg"
          alt="KhetKavach"
          className="w-10 h-10 object-contain rounded-lg border border-stone-200/80 p-0.5 shrink-0"
        />
        <div className="min-w-0">
          <div className="font-extrabold text-sm text-emerald-950 leading-tight truncate">
            KhetKavach
          </div>
          <div className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
            Powered by HailShield™
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-3 pb-1.5 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                        : 'text-stone-700 hover:text-emerald-950 hover:bg-stone-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-emerald-200' : 'text-stone-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${
                          item.badgeColor || 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Farmer Help Footer */}
      <div className="p-3 border-t border-stone-200 bg-white text-xs text-stone-600">
        <div className="flex items-center gap-2 text-emerald-900 font-semibold mb-1">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
          <span>Field Support Hotline</span>
        </div>
        <p className="text-[11px] text-stone-700 leading-tight">
          24/7 Storm Response: <strong className="text-stone-900">1800-419-7233</strong>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
