/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from './services/storage';
import { fetchLiveWeather } from './services/weatherService';
import { canopyControlEngine } from './services/canopyControlEngine';
import {
  User,
  Farm,
  Plot,
  CropRow,
  CanopySystem,
  CanopyCommand,
  IoTDevice,
  SensorTelemetry,
  AlertItem,
  ActivityRecord,
  MaintenanceRecord,
  SupportTicket,
  LiveWeatherData,
  UserRole,
  NavTab,
} from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { FarmPlotManager } from './components/farms/FarmPlotManager';
import { CanopyControlPanel } from './components/canopy/CanopyControlPanel';
import { WeatherModule } from './components/weather/WeatherModule';
import { IotDeviceManager } from './components/iot/IotDeviceManager';
import { ActivityTimeline } from './components/activity/ActivityTimeline';
import { MaintenanceRecords } from './components/maintenance/MaintenanceRecords';
import { ReportsView } from './components/reports/ReportsView';
import { SubscriptionBilling } from './components/subscription/SubscriptionBilling';
import { SettingsPage } from './components/settings/SettingsPage';
import { SupportHelpPage } from './components/support/SupportHelpPage';
import { AuthModal } from './components/auth/AuthModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

export default function App() {
  // Database reactive state
  const [currentUser, setCurrentUser] = useState<User>(() => db.getCurrentUser());
  const [activeFarmId, setActiveFarmId] = useState<string>(() => db.getActiveFarmId());
  const [farms, setFarms] = useState<Farm[]>(() => db.getFarms());
  const [plots, setPlots] = useState<Plot[]>(() => db.getPlots());
  const [rows, setRows] = useState<CropRow[]>(() => db.getRows());
  const [canopySystems, setCanopySystems] = useState<CanopySystem[]>(() => db.getCanopySystems());
  const [commands, setCommands] = useState<CanopyCommand[]>(() => db.getCommands());
  const [devices, setDevices] = useState<IoTDevice[]>(() => db.getDevices());
  const [telemetry, setTelemetry] = useState<SensorTelemetry[]>(() => db.getTelemetry());
  const [alerts, setAlerts] = useState<AlertItem[]>(() => db.getAlerts());
  const [activities, setActivities] = useState<ActivityRecord[]>(() => db.getActivities());
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => db.getMaintenance());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => db.getTickets());

  // Navigation and UI state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'mr' | 'hi'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subscribe to database changes
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setCurrentUser(db.getCurrentUser());
      setActiveFarmId(db.getActiveFarmId());
      setFarms(db.getFarms());
      setPlots(db.getPlots());
      setRows(db.getRows());
      setCanopySystems(db.getCanopySystems());
      setCommands(db.getCommands());
      setDevices(db.getDevices());
      setTelemetry(db.getTelemetry());
      setAlerts(db.getAlerts());
      setActivities(db.getActivities());
      setMaintenance(db.getMaintenance());
      setTickets(db.getTickets());
    });
    return unsubscribe;
  }, []);

  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0];

  // Fetch live weather when active farm changes
  const loadWeather = async () => {
    if (!activeFarm) return;
    const data = await fetchLiveWeather(
      activeFarm.gpsLat,
      activeFarm.gpsLng,
      `${activeFarm.name} (${activeFarm.taluka}, Nashik)`
    );
    setWeather(data);
  };

  useEffect(() => {
    loadWeather();
  }, [activeFarmId]);

  const handleSelectFarm = (farmId: string) => {
    db.setActiveFarmId(farmId);
  };

  const handleSelectRole = (role: UserRole) => {
    db.switchUserRole(role);
  };

  const handleExecuteCommand = async (params: {
    canopySystemId: string;
    plotId: string;
    targetSectionIds?: string[];
    targetRowNumbers?: number[];
    action: 'open' | 'close' | 'stop' | 'emergency_stop';
    reason: string;
    bypassWindLockout?: boolean;
    currentWindSpeedKmh?: number;
  }) => {
    return await canopyControlEngine.executeCommand(params);
  };

  const handleTriggerEmergencyStop = (canopySystemId: string, plotId: string) => {
    canopyControlEngine.executeCommand({
      canopySystemId,
      plotId,
      targetRowNumbers: [],
      action: 'emergency_stop',
      reason: 'Software Emergency Halt from UI',
    });
  };

  const handleResetEmergencyStop = (canopySystemId: string, plotId: string) => {
    canopyControlEngine.resetEmergencyStop(canopySystemId, plotId);
  };

  const handleUpdateSystemMode = (systemId: string, mode: 'manual' | 'automatic') => {
    const sys = canopySystems.find((s) => s.id === systemId);
    if (sys) {
      db.saveCanopySystem({ ...sys, operatingMode: mode });
      db.logActivity({
        farmId: activeFarm?.id,
        plotId: sys.plotId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        actionType: 'MODE_CHANGE',
        description: `Switched ${sys.name} to ${mode.toUpperCase()} mode.`,
      });
    }
  };

  // Quick action from dashboard
  const handleQuickDeploy = () => {
    const primaryPlot = plots.find((p) => p.farmId === activeFarm?.id && p.canopyInstalled);
    const primarySys = canopySystems.find((s) => s.plotId === primaryPlot?.id) || canopySystems[0];
    if (primarySys && primaryPlot) {
      canopyControlEngine.executeCommand({
        canopySystemId: primarySys.id,
        plotId: primaryPlot.id,
        action: 'close',
        reason: 'Dashboard Quick Deploy All initiated by farmer',
        currentWindSpeedKmh: weather?.windSpeedKmh,
      });
    } else {
      setCurrentTab('canopy');
    }
  };

  const handleQuickRetract = () => {
    const primaryPlot = plots.find((p) => p.farmId === activeFarm?.id && p.canopyInstalled);
    const primarySys = canopySystems.find((s) => s.plotId === primaryPlot?.id) || canopySystems[0];
    if (primarySys && primaryPlot) {
      canopyControlEngine.executeCommand({
        canopySystemId: primarySys.id,
        plotId: primaryPlot.id,
        action: 'open',
        reason: 'Dashboard Quick Retract All for sunlight exposure',
        currentWindSpeedKmh: weather?.windSpeedKmh,
      });
    } else {
      setCurrentTab('canopy');
    }
  };

  const activeHailAlert = alerts.some(
    (a) => !a.isRead && (a.title.toLowerCase().includes('hail') || a.severity === 'critical')
  );

  const isCanopyMoving = canopySystems.some(
    (sys) =>
      sys.status === 'moving' ||
      sys.sections?.some((sec) => sec.motionState === 'deploying' || sec.motionState === 'retracting')
  );

  return (
    <div className="h-screen h-[100dvh] w-full bg-[#f8faf7] text-stone-900 flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeFarm={activeFarm}
        allFarms={farms}
        onSelectFarm={handleSelectFarm}
        onSelectRole={handleSelectRole}
        weather={weather}
        onOpenAlerts={() => setCurrentTab('activity')}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex overflow-hidden min-w-0 relative">
        {/* Responsive Sidebar for desktop, tablet, and mobile drawer */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          canopySimulationMode={true}
          activeHailAlert={activeHailAlert}
          userRole={currentUser.role}
          currentLang={currentLang}
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          activeFarm={activeFarm}
          allFarms={farms}
          onSelectFarm={handleSelectFarm}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 pb-28 md:pb-8">
          {/* OVERVIEW: Dashboard */}
          {currentTab === 'dashboard' && (
            <OverviewDashboard
              activeFarm={activeFarm}
              allFarms={farms}
              plots={plots}
              rows={rows}
              devices={devices.filter((d) => d.farmId === activeFarm?.id)}
              alerts={alerts.filter((a) => !a.farmId || a.farmId === activeFarm?.id)}
              activities={activities.filter((a) => !a.farmId || a.farmId === activeFarm?.id)}
              canopySystems={canopySystems}
              weather={weather}
              onNavigate={(tab) => setCurrentTab(tab)}
              onExecuteDeployCanopy={handleQuickDeploy}
              onExecuteRetractCanopy={handleQuickRetract}
              currentLang={currentLang}
            />
          )}

          {/* FARM MANAGEMENT: My Farms */}
          {currentTab === 'farms' && (
            <FarmPlotManager
              farms={farms}
              plots={plots}
              rows={rows}
              activeFarmId={activeFarmId}
              initialSubTab="farms"
              onSelectFarm={handleSelectFarm}
              onSaveFarm={(f) => db.saveFarm(f)}
              onDeleteFarm={(id) => db.deleteFarm(id)}
              onSavePlot={(p) => db.savePlot(p)}
              onDeletePlot={(id) => db.deletePlot(id)}
              onNavigateToCanopy={() => setCurrentTab('canopy')}
            />
          )}

          {/* FARM MANAGEMENT: My Plots */}
          {currentTab === 'plots' && (
            <FarmPlotManager
              farms={farms}
              plots={plots}
              rows={rows}
              activeFarmId={activeFarmId}
              initialSubTab="plots"
              onSelectFarm={handleSelectFarm}
              onSaveFarm={(f) => db.saveFarm(f)}
              onDeleteFarm={(id) => db.deleteFarm(id)}
              onSavePlot={(p) => db.savePlot(p)}
              onDeletePlot={(id) => db.deletePlot(id)}
              onNavigateToCanopy={() => setCurrentTab('canopy')}
            />
          )}

          {/* FARM MANAGEMENT: Crop & Row Management */}
          {currentTab === 'rows' && (
            <FarmPlotManager
              farms={farms}
              plots={plots}
              rows={rows}
              activeFarmId={activeFarmId}
              initialSubTab="rows"
              onSelectFarm={handleSelectFarm}
              onSaveFarm={(f) => db.saveFarm(f)}
              onDeleteFarm={(id) => db.deleteFarm(id)}
              onSavePlot={(p) => db.savePlot(p)}
              onDeletePlot={(id) => db.deletePlot(id)}
              onNavigateToCanopy={() => setCurrentTab('canopy')}
            />
          )}

          {/* PROTECTION: Canopy Control */}
          {currentTab === 'canopy' && (
            <CanopyControlPanel
              canopySystems={canopySystems}
              plots={plots.filter((p) => p.farmId === activeFarm?.id)}
              rows={rows}
              commands={commands}
              weather={weather}
              currentUser={currentUser}
              onExecuteCommand={handleExecuteCommand}
              onResetEmergencyStop={handleResetEmergencyStop}
              onUpdateSystemMode={handleUpdateSystemMode}
              currentLang={currentLang}
            />
          )}

          {/* PROTECTION: Weather & Hail Alerts */}
          {currentTab === 'weather' && (
            <WeatherModule
              weather={weather}
              activeFarm={activeFarm}
              telemetry={telemetry}
              onRefreshWeather={loadWeather}
              onDeployCanopy={() => setCurrentTab('canopy')}
            />
          )}

          {/* PROTECTION: Sensor Monitoring */}
          {currentTab === 'sensors' && (
            <IotDeviceManager
              devices={devices.filter((d) => d.farmId === activeFarm?.id)}
              farms={farms}
              plots={plots}
              telemetry={telemetry}
              userRole={currentUser.role}
              onSaveDevice={(dev) => db.saveDevice(dev)}
              onDeleteDevice={(id) => db.deleteDevice(id)}
            />
          )}

          {/* OPERATIONS: Activity History */}
          {currentTab === 'activity' && (
            <ActivityTimeline
              activities={activities.filter((a) => !a.farmId || a.farmId === activeFarm?.id)}
              activeFarm={activeFarm}
            />
          )}

          {/* OPERATIONS: Maintenance */}
          {currentTab === 'maintenance' && (
            <MaintenanceRecords
              records={maintenance}
              plots={plots.filter((p) => p.farmId === activeFarm?.id)}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
              onSaveRecord={(rec) => db.saveMaintenance(rec)}
            />
          )}

          {/* INSIGHTS: Analytics & Reports */}
          {currentTab === 'reports' && (
            <ReportsView
              plots={plots.filter((p) => p.farmId === activeFarm?.id)}
              rows={rows}
              activities={activities.filter((a) => !a.farmId || a.farmId === activeFarm?.id)}
              maintenance={maintenance}
              weather={weather}
              activeFarm={activeFarm}
            />
          )}

          {/* ACCOUNT: Subscription & Plans */}
          {currentTab === 'subscription' && (
            <SubscriptionBilling activeFarm={activeFarm} />
          )}

          {/* ACCOUNT: Settings (Restricted Tech/Admin tools inside!) */}
          {currentTab === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              activeFarm={activeFarm}
              devices={devices}
              currentLang={currentLang}
              onSelectLang={setCurrentLang}
              onSelectRole={handleSelectRole}
            />
          )}

          {/* ACCOUNT: Help & Support */}
          {currentTab === 'support' && (
            <SupportHelpPage
              tickets={tickets}
              activeFarm={activeFarm}
              onSubmitTicket={(t) => db.saveTicket(t)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb access for field operations) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeHailAlert={activeHailAlert}
        isCanopyMoving={isCanopyMoving}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        currentLang={currentLang}
      />
      {/* Profile & Security Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(u) => db.setCurrentUser(u)}
        onSwitchRole={handleSelectRole}
      />
    </div>
  );
}
