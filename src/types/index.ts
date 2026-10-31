/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'farmer' | 'farm_manager' | 'admin' | 'technician';

export type NavTab = 
  | 'dashboard'
  | 'farms'
  | 'plots'
  | 'rows'
  | 'canopy'
  | 'weather'
  | 'sensors'
  | 'activity'
  | 'maintenance'
  | 'reports'
  | 'subscription'
  | 'settings'
  | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationName?: string;
  avatarUrl?: string;
  createdAt: string;
  preferredLanguage?: 'en' | 'mr' | 'hi';
}

export interface Farm {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  location: string;
  taluka: string;
  district: string;
  state: string;
  gpsLat: number;
  gpsLng: number;
  totalAreaAcres: number;
  soilType: string;
  waterSource: string;
  notes: string;
  createdAt: string;
  imageUrl?: string;
}

export type CropType = 'Grapes' | 'Pomegranate' | 'Tomato' | 'Onion' | 'Capsicum' | 'Guava' | 'Other';

export interface Plot {
  id: string;
  farmId: string;
  name: string;
  plotNumber: string;
  areaAcres: number;
  cropType: CropType;
  cropVariety: string;
  plantingDate: string;
  growthStage: 'Dormant' | 'Bud Break' | 'Flowering' | 'Fruit Set' | 'Veraison' | 'Ripening' | 'Harvest';
  rowCount: number;
  rowSpacingMeters: number;
  canopyInstalled: boolean;
  canopySystemId?: string;
  notes?: string;
}

export type RowCanopyState = 'closed' | 'open' | 'opening' | 'closing' | 'stopped' | 'fault';

export interface CropRow {
  id: string;
  plotId: string;
  rowNumber: number;
  lengthMeters: number;
  canopyState: RowCanopyState;
  positionPercent: number; // 0 = fully open (uncovered), 100 = fully closed (covered/protected)
  motorId: string;
  limitSwitchOpenActive: boolean; // physical limit switch 1
  limitSwitchClosedActive: boolean; // physical limit switch 2
  lastOperationTime: string;
  motorCurrentAmps?: number;
}

export type CanopyMechanicalType = 'parallel_cable_pulley' | 'overhead_drum_winch' | 'traverse_rack_pinion' | 'lead_cable_slider';
export type CanopyOperatingMode = 'manual' | 'automatic';

/**
 * PARALLEL COLUMN-WISE RETRACTABLE OVERHEAD NET SYSTEM
 * Overhead framework suspended above crops on pole-and-cable grid.
 * Divides the field into long retractable sections running parallel to crop rows.
 */
export interface LongitudinalSection {
  id: string;
  canopySystemId: string;
  plotId: string;
  sectionNumber: number; // e.g. 1, 2, 3
  name: string; // e.g. "Section 1 – Row Group 1 (Rows 1–4)"
  assignedRowNumbers: number[]; // e.g. [1, 2, 3, 4]
  spanWidthMeters: number; // width across the row group (e.g. 11.0m for 4 rows)
  lengthMeters: number; // longitudinal length along crop rows (e.g. 110m)
  overheadClearanceMeters: number; // height of overhead cable framework above vines (e.g. 3.2m)
  positionPercent: number; // 0 = fully retracted to headpost parking line, 100 = fully deployed along rows
  motionState: 'retracted' | 'deployed' | 'deploying' | 'retracting' | 'stopped' | 'fault';
  motorId: string;
  motorCurrentAmps: number;
  limitSwRetractedActive: boolean; // physical limit switch 1 at headpost parking end
  limitSwDeployedActive: boolean; // physical limit switch 2 at far anchor tailpost
  lastOperationTime: string;
  cableTensionRatingKg: number; // e.g. 320 kg
  driveMechanismConfigurable: {
    winchDrumDiameterMm: number;
    cableDiameterMm: number;
    sliderSpacingMeters: number;
    engineerSignOffPending: boolean;
    notes: string;
  };
}

export interface CanopySystem {
  id: string;
  plotId: string;
  name: string;
  mechanicalType: CanopyMechanicalType;
  motorModel: string;
  actuatorVoltage: '24V_DC' | '48V_DC' | '230V_AC';
  operatingMode: CanopyOperatingMode;
  windSpeedLockoutKmh: number; // if wind exceeds this, safety lockout or auto-retract occurs
  emergencyStopEngaged: boolean;
  emergencyStopSource?: 'software_ui' | 'hardware_relay' | 'limit_switch_override';
  status: 'operational' | 'moving' | 'fault' | 'locked_high_wind';
  simulationMode: boolean; // TRUE until actual physical ESP32 gateway is paired
  lastSafetyCheck: string;
  overheadPoleHeightMeters: number;
  longitudinalTraverseSpeedMetersPerMin: number;
  sections?: LongitudinalSection[];
}

export type CommandState = 
  | 'created' 
  | 'dispatched' 
  | 'acknowledged' 
  | 'motor_moving' 
  | 'completed' 
  | 'failed';

export interface CanopyCommand {
  id: string;
  canopySystemId: string;
  plotId: string;
  targetSectionIds?: string[];
  targetSectionNames?: string[];
  targetRowNumbers: number[];
  action: 'open' | 'close' | 'stop' | 'emergency_stop'; // 'open' = retract netting, 'close' = deploy netting
  state: CommandState;
  issuedByUserId: string;
  issuedByName: string;
  issuedByRole: UserRole;
  reason: string;
  createdAt: string;
  dispatchedAt?: string;
  acknowledgedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  isSimulated: boolean;
}

export type DeviceType = 
  | 'esp32_canopy_gateway' 
  | 'rain_sensor_node' 
  | 'anemometer_wind_node' 
  | 'ambient_weather_station' 
  | 'soil_sensor_node';

export interface IoTDevice {
  id: string;
  deviceUid: string; // e.g. "ESP32-KK-NSK-092"
  name: string;
  deviceType: DeviceType;
  farmId: string;
  plotId?: string;
  isOnline: boolean;
  lastPing: string;
  batteryPercent?: number; // null if solar / grid mains
  signalRssi: number; // e.g. -68 dBm
  firmwareVersion: string;
  hardwareModel: string;
  calibrationDate: string;
  isDemoData: boolean;
  ipAddress?: string;
}

export interface SensorTelemetry {
  id: string;
  deviceUid: string;
  plotId?: string;
  sensorType: 'rain_optical' | 'temperature' | 'humidity' | 'wind_speed' | 'solar_radiation' | 'soil_moisture';
  value: number;
  unit: string;
  timestamp: string;
  isDemoData: boolean;
}

export interface LiveWeatherData {
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  rainMm: number;
  rainProbabilityPercent: number;
  weatherCode: number;
  weatherDescription: string;
  uvIndex: number;
  hailRiskScore: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  locationName: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  isLiveApi: boolean;
  forecastDaily: Array<{
    date: string;
    dayName: string;
    tempMaxC: number;
    tempMinC: number;
    rainProbabilityPercent: number;
    precipitationMm: number;
    windSpeedMaxKmh: number;
    weatherCode: number;
    conditionText: string;
  }>;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'weather' | 'canopy' | 'device' | 'maintenance';

export interface AlertItem {
  id: string;
  farmId: string;
  plotId?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  isRead: boolean;
  recommendedAction?: string;
}

export interface ActivityRecord {
  id: string;
  farmId: string;
  plotId?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  actionType: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MaintenanceRecord {
  id: string;
  plotId: string;
  canopySystemId?: string;
  technicianId: string;
  technicianName: string;
  title: string;
  category: 'preventive' | 'breakdown' | 'cable_tensioning' | 'motor_service' | 'limit_switch_check';
  notes: string;
  date: string;
  partsReplaced?: string[];
  status: 'completed' | 'pending_parts' | 'scheduled';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  badge: string;
  pricePerAcreYearInr: number;
  maxFarms: number;
  maxPlots: number;
  maxDevices: number;
  features: string[];
  recommendedCrop: string;
}

export interface SupportTicket {
  id: string;
  farmId: string;
  subject: string;
  category: 'hardware' | 'app' | 'billing' | 'emergency';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  message: string;
}
