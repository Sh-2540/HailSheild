/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Shield,
  CloudLightning,
  Trees,
  Menu,
} from 'lucide-react';
import { NavTab } from '../../types';
import { TRANSLATIONS } from '../../services/i18n';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeHailAlert?: boolean;
  isCanopyMoving?: boolean;
  onOpenMobileMenu: () => void;
  currentLang: 'en' | 'mr' | 'hi';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeHailAlert = false,
  isCanopyMoving = false,
  onOpenMobileMenu,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];

  const tabs: {
    id: NavTab | 'more';
    label: string;
    icon: React.ElementType;
    badge?: boolean;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: currentLang === 'en' ? 'Overview' : t.dashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'canopy',
      label: currentLang === 'en' ? 'Canopy' : t.canopyControl,
      icon: Shield,
      badge: isCanopyMoving,
      badgeColor: 'bg-emerald-500 animate-ping',
    },
    {
      id: 'weather',
      label: currentLang === 'en' ? 'Weather' : t.weatherAlerts,
      icon: CloudLightning,
      badge: activeHailAlert,
      badgeColor: 'bg-rose-500 animate-pulse',
    },
    {
      id: 'farms',
      label: currentLang === 'en' ? 'Farms' : t.myFarms,
      icon: Trees,
    },
    {
      id: 'more',
      label: currentLang === 'en' ? 'Menu' : 'मेनू',
      icon: Menu,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation Bar"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = tab.id === currentTab;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'more') {
                  onOpenMobileMenu();
                } else {
                  onSelectTab(tab.id as NavTab);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative min-h-[50px] touch-manipulation select-none active:scale-95 ${
                isSelected
                  ? 'text-emerald-950 font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isSelected ? 'bg-emerald-100 text-emerald-900' : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {tab.badge && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                      tab.badgeColor || 'bg-rose-500'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
