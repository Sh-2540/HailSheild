/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  UserRole,
  LongitudinalSection,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'khetkavach_current_user',
  FARMS: 'khetkavach_farms',
  PLOTS: 'khetkavach_plots',
  ROWS: 'khetkavach_rows',
  SECTIONS: 'khetkavach_canopy_sections',
  CANOPY_SYSTEMS: 'khetkavach_canopy_systems',
  COMMANDS: 'khetkavach_commands',
  DEVICES: 'khetkavach_devices',
  TELEMETRY: 'khetkavach_telemetry',
  ALERTS: 'khetkavach_alerts',
  ACTIVITIES: 'khetkavach_activities',
  MAINTENANCE: 'khetkavach_maintenance',
  TICKETS: 'khetkavach_tickets',
  ACTIVE_FARM_ID: 'khetkavach_active_farm_id',
};

// Seed users representing real agricultural stakeholders
export const SEED_USERS: User[] = [
  {
    id: 'user-farmer-1',
    name: 'Shivam Agale',
    email: 'shivamagale17@gmail.com',
    phone: '+91 98220 14829',
    role: 'farmer',
    organizationName: 'Agale Agro Vineyards',
    avatarUrl: '/src/assets/images/farmer_portrait_avatar_1793376499951.jpg',
    createdAt: '2026-01-15T08:00:00Z',
    preferredLanguage: 'en',
  },
  {
    id: 'user-manager-1',
    name: 'Ganesh Patil',
    email: 'ganesh.patil@agaleagro.in',
    phone: '+91 94231 88472',
    role: 'farm_manager',
    organizationName: 'Agale Agro Vineyards',
    avatarUrl: '/src/assets/images/farmer_portrait_avatar_1793376499951.jpg',
    createdAt: '2026-02-01T10:00:00Z',
    preferredLanguage: 'mr',
  },
  {
    id: 'user-tech-1',
    name: 'Rahul Shinde',
    email: 'rahul.service@khetkavach.in',
    phone: '+91 98902 55319',
    role: 'technician',
    organizationName: 'HailShield Field Engineering Nashik',
    avatarUrl: '/src/assets/images/farmer_portrait_avatar_1793376499951.jpg',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-admin-1',
    name: 'Archana Deshmukh',
    email: 'admin@khetkavach.in',
    phone: '+91 98224 99120',
    role: 'admin',
    organizationName: 'KHETKAVACH Systems HQ',
    avatarUrl: '/src/assets/images/farmer_portrait_avatar_1793376499951.jpg',
    createdAt: '2025-11-01T06:00:00Z',
  },
];

// Seed farms in Nashik & Dindori region
export const SEED_FARMS: Farm[] = [
  {
    id: 'farm-nashik-1',
    name: 'Sahyadri Valley Vineyard',
    ownerId: 'user-farmer-1',
    ownerName: 'Shivam Agale',
    location: 'Dindori Road, Near Gangapur Dam Backwaters',
    taluka: 'Dindori',
    district: 'Nashik',
    state: 'Maharashtra',
    gpsLat: 20.0894,
    gpsLng: 73.7431,
    totalAreaAcres: 12.5,
    soilType: 'Black Basaltic Clay Loam (Rich Kali Clay)',
    waterSource: 'Drip Irrigation via Gangapur Dam canal + 2 Farm Ponds (Shet tale)',
    notes: 'Premium export table grapes & wine varieties with trellis installation. Hail prone zone during March-May pre-monsoon squalls.',
    createdAt: '2026-01-16T10:00:00Z',
    imageUrl: '/src/assets/images/vineyard_canopy_hero_1793376498145.jpg',
  },
  {
    id: 'farm-nashik-2',
    name: 'Panchavati Agro Orchards',
    ownerId: 'user-farmer-1',
    ownerName: 'Shivam Agale',
    location: 'Makhmalabad Shiwar, Peth Road',
    taluka: 'Nashik Rural',
    district: 'Nashik',
    state: 'Maharashtra',
    gpsLat: 20.0435,
    gpsLng: 73.7932,
    totalAreaAcres: 8.0,
    soilType: 'Medium Red Sandy Loam (Tambad Mati)',
    waterSource: 'Solar Powered Open Well & Borewell with Sand Filter',
    notes: 'Pomegranate orchard and seasonal cash crops. Heavy monsoon drainage channel installed.',
    createdAt: '2026-02-10T14:30:00Z',
    imageUrl: '/src/assets/images/pomegranate_orchard_1793376499633.jpg',
  },
];

// Seed plots
export const SEED_PLOTS: Plot[] = [
  {
    id: 'plot-nsk-1-1',
    farmId: 'farm-nashik-1',
    name: 'North Block – Thompson Seedless',
    plotNumber: 'Plot 1A',
    areaAcres: 4.5,
    cropType: 'Grapes',
    cropVariety: 'Thompson Seedless (Export Grade)',
    plantingDate: '2023-10-12',
    growthStage: 'Veraison',
    rowCount: 12,
    rowSpacingMeters: 2.75, // 9 feet spacing standard for Y-trellis in Maharashtra
    canopyInstalled: true,
    canopySystemId: 'canopy-sys-01',
    notes: 'Trellis Y-type system with HailShield motorized overhead retractable anti-hail net.',
  },
  {
    id: 'plot-nsk-1-2',
    farmId: 'farm-nashik-1',
    name: 'South Block – Manik Chaman Grapes',
    plotNumber: 'Plot 1B',
    areaAcres: 3.5,
    cropType: 'Grapes',
    cropVariety: 'Manik Chaman (Late Season)',
    plantingDate: '2024-02-18',
    growthStage: 'Fruit Set',
    rowCount: 8,
    rowSpacingMeters: 2.75,
    canopyInstalled: true,
    canopySystemId: 'canopy-sys-02',
    notes: 'Cable-pulley 24V motorized canopy. Fitted with optical rain sensor on row 1.',
  },
  {
    id: 'plot-nsk-1-3',
    farmId: 'farm-nashik-1',
    name: 'East Block – Nashik Red Onion',
    plotNumber: 'Plot 1C',
    areaAcres: 4.5,
    cropType: 'Onion',
    cropVariety: 'Nashik Red / Agrifound Light Red',
    plantingDate: '2026-01-05',
    growthStage: 'Ripening',
    rowCount: 18,
    rowSpacingMeters: 0.6,
    canopyInstalled: false,
    notes: 'Open field cultivation. Scheduled for drip line inspection.',
  },
  {
    id: 'plot-nsk-2-1',
    farmId: 'farm-nashik-2',
    name: 'Main Bhagwa Pomegranate Block',
    plotNumber: 'Plot 2A',
    areaAcres: 5.0,
    cropType: 'Pomegranate',
    cropVariety: 'Super Bhagwa (Sindhuri)',
    plantingDate: '2022-08-15',
    growthStage: 'Fruit Set',
    rowCount: 10,
    rowSpacingMeters: 4.0, // standard 14x10 ft spacing
    canopyInstalled: true,
    canopySystemId: 'canopy-sys-03',
    notes: 'High yield block. Hail protection canopy covers tree crowns with automated wind release.',
  },
  {
    id: 'plot-nsk-2-2',
    farmId: 'farm-nashik-2',
    name: 'West Block – Hybrid Tomato',
    plotNumber: 'Plot 2B',
    areaAcres: 3.0,
    cropType: 'Tomato',
    cropVariety: 'Abhinav Hybrid F1',
    plantingDate: '2026-02-20',
    growthStage: 'Flowering',
    rowCount: 14,
    rowSpacingMeters: 1.2,
    canopyInstalled: false,
    notes: 'Staked tomato with silver reflective mulch. Currently non-protected.',
  },
];

// Seed Canopy Systems - PARALLEL COLUMN-WISE RETRACTABLE OVERHEAD NET SYSTEM
export const SEED_CANOPY_SYSTEMS: CanopySystem[] = [
  {
    id: 'canopy-sys-01',
    plotId: 'plot-nsk-1-1',
    name: 'HailShield Alpha-12 (Parallel Overhead Net Framework)',
    mechanicalType: 'parallel_cable_pulley',
    motorModel: 'Bafang 24V DC 120W Planetary Winch Drive (Longitudinal)',
    actuatorVoltage: '24V_DC',
    operatingMode: 'manual',
    windSpeedLockoutKmh: 35.0, // Safety: above 35 km/h, prevent motion to avoid aerodynamic lift
    emergencyStopEngaged: false,
    status: 'operational',
    simulationMode: true, // Marked SIMULATION MODE until real ESP32 gateway hardware connected
    lastSafetyCheck: '2026-10-25T11:00:00Z',
    overheadPoleHeightMeters: 4.2,
    longitudinalTraverseSpeedMetersPerMin: 12.0,
  },
  {
    id: 'canopy-sys-02',
    plotId: 'plot-nsk-1-2',
    name: 'HailShield Bravo-8 (Parallel Overhead Cable Grid)',
    mechanicalType: 'parallel_cable_pulley',
    motorModel: 'Transtecno 24V DC 90W Right-Angle Drum Drive',
    actuatorVoltage: '24V_DC',
    operatingMode: 'automatic',
    windSpeedLockoutKmh: 32.0,
    emergencyStopEngaged: false,
    status: 'operational',
    simulationMode: true,
    lastSafetyCheck: '2026-10-24T14:15:00Z',
    overheadPoleHeightMeters: 4.0,
    longitudinalTraverseSpeedMetersPerMin: 10.5,
  },
  {
    id: 'canopy-sys-03',
    plotId: 'plot-nsk-2-1',
    name: 'HailShield AgroCrown-10 (High Arch Overhead Cable Net)',
    mechanicalType: 'overhead_drum_winch',
    motorModel: 'Bonfiglioli 48V DC 180W High-Torque Driver',
    actuatorVoltage: '48V_DC',
    operatingMode: 'manual',
    windSpeedLockoutKmh: 30.0,
    emergencyStopEngaged: false,
    status: 'operational',
    simulationMode: true,
    lastSafetyCheck: '2026-10-20T09:30:00Z',
    overheadPoleHeightMeters: 4.8,
    longitudinalTraverseSpeedMetersPerMin: 14.0,
  },
];

// Seed Longitudinal Net Sections - Independent Column-Wise Control Units
export const SEED_LONGITUDINAL_SECTIONS: LongitudinalSection[] = [
  // Plot 1: 12 rows divided into 3 Parallel Column-Wise Sections (4 rows each)
  {
    id: 'sec-nsk-1-1-1',
    canopySystemId: 'canopy-sys-01',
    plotId: 'plot-nsk-1-1',
    sectionNumber: 1,
    name: 'Section 1 – Row Group 1 (Rows 1–4)',
    assignedRowNumbers: [1, 2, 3, 4],
    spanWidthMeters: 11.0,
    lengthMeters: 110,
    overheadClearanceMeters: 3.2,
    positionPercent: 100, // fully deployed along longitudinal crop rows
    motionState: 'deployed',
    motorId: 'MTR-SEC-01A (24V DC Winch)',
    motorCurrentAmps: 0.0,
    limitSwRetractedActive: false,
    limitSwDeployedActive: true,
    lastOperationTime: '2026-10-30T04:15:00Z',
    cableTensionRatingKg: 320,
    driveMechanismConfigurable: {
      winchDrumDiameterMm: 160,
      cableDiameterMm: 6,
      sliderSpacingMeters: 2.5,
      engineerSignOffPending: true,
      notes: 'Parallel longitudinal overhead traverse cable system. Roller & cable tension pending field engineer sign-off.'
    }
  },
  {
    id: 'sec-nsk-1-1-2',
    canopySystemId: 'canopy-sys-01',
    plotId: 'plot-nsk-1-1',
    sectionNumber: 2,
    name: 'Section 2 – Row Group 2 (Rows 5–8)',
    assignedRowNumbers: [5, 6, 7, 8],
    spanWidthMeters: 11.0,
    lengthMeters: 110,
    overheadClearanceMeters: 3.2,
    positionPercent: 100, // fully deployed
    motionState: 'deployed',
    motorId: 'MTR-SEC-01B (24V DC Winch)',
    motorCurrentAmps: 0.0,
    limitSwRetractedActive: false,
    limitSwDeployedActive: true,
    lastOperationTime: '2026-10-30T04:15:00Z',
    cableTensionRatingKg: 320,
    driveMechanismConfigurable: {
      winchDrumDiameterMm: 160,
      cableDiameterMm: 6,
      sliderSpacingMeters: 2.5,
      engineerSignOffPending: true,
      notes: 'Dual traverse cable with stainless carrier rings sliding longitudinally above crop canopy.'
    }
  },
  {
    id: 'sec-nsk-1-1-3',
    canopySystemId: 'canopy-sys-01',
    plotId: 'plot-nsk-1-1',
    sectionNumber: 3,
    name: 'Section 3 – Row Group 3 (Rows 9–12)',
    assignedRowNumbers: [9, 10, 11, 12],
    spanWidthMeters: 11.0,
    lengthMeters: 110,
    overheadClearanceMeters: 3.2,
    positionPercent: 0, // fully retracted to headpost parking line
    motionState: 'retracted',
    motorId: 'MTR-SEC-01C (24V DC Winch)',
    motorCurrentAmps: 0.0,
    limitSwRetractedActive: true,
    limitSwDeployedActive: false,
    lastOperationTime: '2026-10-29T07:20:00Z',
    cableTensionRatingKg: 320,
    driveMechanismConfigurable: {
      winchDrumDiameterMm: 160,
      cableDiameterMm: 6,
      sliderSpacingMeters: 2.5,
      engineerSignOffPending: true,
      notes: 'Headpost cable tensioner verified. Net parked in accordion concertina folds at headpost.'
    }
  },

  // Plot 2: 8 rows divided into 2 Longitudinal Sections (4 rows each)
  {
    id: 'sec-nsk-1-2-1',
    canopySystemId: 'canopy-sys-02',
    plotId: 'plot-nsk-1-2',
    sectionNumber: 1,
    name: 'Section 1 – Row Group 1 (Rows 1–4)',
    assignedRowNumbers: [1, 2, 3, 4],
    spanWidthMeters: 11.0,
    lengthMeters: 95,
    overheadClearanceMeters: 3.2,
    positionPercent: 0,
    motionState: 'retracted',
    motorId: 'MTR-SEC-02A (24V DC Winch)',
    motorCurrentAmps: 0.0,
    limitSwRetractedActive: true,
    limitSwDeployedActive: false,
    lastOperationTime: '2026-10-29T06:45:00Z',
    cableTensionRatingKg: 280,
    driveMechanismConfigurable: {
      winchDrumDiameterMm: 150,
      cableDiameterMm: 5,
      sliderSpacingMeters: 2.5,
      engineerSignOffPending: true,
      notes: 'Parallel longitudinal overhead cable framework.'
    }
  },
  {
    id: 'sec-nsk-1-2-2',
    canopySystemId: 'canopy-sys-02',
    plotId: 'plot-nsk-1-2',
    sectionNumber: 2,
    name: 'Section 2 – Row Group 2 (Rows 5–8)',
    assignedRowNumbers: [5, 6, 7, 8],
    spanWidthMeters: 11.0,
    lengthMeters: 95,
    overheadClearanceMeters: 3.2,
    positionPercent: 0,
    motionState: 'retracted',
    motorId: 'MTR-SEC-02B (24V DC Winch)',
    motorCurrentAmps: 0.0,
    limitSwRetractedActive: true,
    limitSwDeployedActive: false,
    lastOperationTime: '2026-10-29T06:45:00Z',
    cableTensionRatingKg: 280,
    driveMechanismConfigurable: {
      winchDrumDiameterMm: 150,
      cableDiameterMm: 5,
      sliderSpacingMeters: 2.5,
      engineerSignOffPending: true,
      notes: 'Parallel longitudinal overhead cable framework.'
    }
  },

  // Plot 4 (Pomegranate 10 rows): 2 Longitudinal Sections (5 rows each)
  {
    id: 'sec-nsk-2-1-1',
    canopySystemId: 'canopy-sys-03',
    plotId: 'plot-nsk-2-1',
    sectionNumber: 1,
    name: 'Section 1 – Row Group 1 (Rows 1–5)',
    assignedRowNumbers: [1, 2, 3, 4, 5],
    spanWidthMeters: 20.0,
    lengthMeters: 140,
    overheadClearanceMeters: 4.5,
    positionPercent: 100,
    motionState: 'deployed',
    motorId: 'MTR-SEC-03A (48V DC Winch)',
    motorCurrentAmps: 0.0,
    limitSwRetractedActive: false,
    limitSwDeployedActive: true,
    lastOperationTime: '2026-10-28T15:30:00Z',
    cableTensionRatingKg: 450,
    driveMechanismConfigurable: {
      winchDrumDiameterMm: 200,
      cableDiameterMm: 8,
      sliderSpacingMeters: 3.0,
      engineerSignOffPending: true,
      notes: 'High clearance overhead pole and longitudinal traverse cable for pomegranate tree crown.'
    }
  },
  {
    id: 'sec-nsk-2-1-2',
    canopySystemId: 'canopy-sys-03',
    plotId: 'plot-nsk-2-1',
    sectionNumber: 2,
    name: 'Section 2 – Row Group 2 (Rows 6–10)',
    assignedRowNumbers: [6, 7, 8, 9, 10],
    spanWidthMeters: 20.0,
    lengthMeters: 140,
    overheadClearanceMeters: 4.5,
    positionPercent: 0,
    motionState: 'retracted',
    motorId: 'MTR-SEC-03B (48V DC Winch)',
    motorCurrentAmps: 0.0,
    limitSwRetractedActive: true,
    limitSwDeployedActive: false,
    lastOperationTime: '2026-10-27T16:20:00Z',
    cableTensionRatingKg: 450,
    driveMechanismConfigurable: {
      winchDrumDiameterMm: 200,
      cableDiameterMm: 8,
      sliderSpacingMeters: 3.0,
      engineerSignOffPending: true,
      notes: 'High clearance overhead pole and longitudinal traverse cable.'
    }
  }
];

// Generate crop rows for plots
export const generateSeedRows = (): CropRow[] => {
  const rows: CropRow[] = [];

  // Plot 1: 12 rows (Protected, mix of open/closed)
  for (let i = 1; i <= 12; i++) {
    // Let rows 1-6 be closed (protected against sun/rain) and 7-12 be open (for ventilation/sunlight)
    const isClosed = i <= 6;
    rows.push({
      id: `row-nsk-1-1-${i}`,
      plotId: 'plot-nsk-1-1',
      rowNumber: i,
      lengthMeters: 110,
      canopyState: isClosed ? 'closed' : 'open',
      positionPercent: isClosed ? 100 : 0,
      motorId: `MTR-1A-R${i.toString().padStart(2, '0')}`,
      limitSwitchOpenActive: !isClosed,
      limitSwitchClosedActive: isClosed,
      lastOperationTime: '2026-10-28T07:30:00Z',
      motorCurrentAmps: 1.8,
    });
  }

  // Plot 2: 8 rows (All open for morning sunlight)
  for (let i = 1; i <= 8; i++) {
    rows.push({
      id: `row-nsk-1-2-${i}`,
      plotId: 'plot-nsk-1-2',
      rowNumber: i,
      lengthMeters: 95,
      canopyState: 'open',
      positionPercent: 0,
      motorId: `MTR-1B-R${i.toString().padStart(2, '0')}`,
      limitSwitchOpenActive: true,
      limitSwitchClosedActive: false,
      lastOperationTime: '2026-10-29T06:45:00Z',
      motorCurrentAmps: 0.0,
    });
  }

  // Plot 4 (Pomegranate): 10 rows
  for (let i = 1; i <= 10; i++) {
    const isClosed = i % 2 === 0;
    rows.push({
      id: `row-nsk-2-1-${i}`,
      plotId: 'plot-nsk-2-1',
      rowNumber: i,
      lengthMeters: 140,
      canopyState: isClosed ? 'closed' : 'open',
      positionPercent: isClosed ? 100 : 0,
      motorId: `MTR-2A-R${i.toString().padStart(2, '0')}`,
      limitSwitchOpenActive: !isClosed,
      limitSwitchClosedActive: isClosed,
      lastOperationTime: '2026-10-27T16:20:00Z',
      motorCurrentAmps: 2.1,
    });
  }

  return rows;
};

// Seed IoT Devices
export const SEED_DEVICES: IoTDevice[] = [
  {
    id: 'dev-001',
    deviceUid: 'ESP32-KK-GW-01',
    name: 'HailShield Central Gateway Node 1',
    deviceType: 'esp32_canopy_gateway',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-1',
    isOnline: true,
    lastPing: new Date().toISOString(),
    batteryPercent: 96,
    signalRssi: -58,
    firmwareVersion: 'v2.4.1-esp-idf',
    hardwareModel: 'ESP32-WROOM-32U + RS485 Modbus + 8-Channel Relay',
    calibrationDate: '2026-01-18',
    isDemoData: true,
    ipAddress: '192.168.1.142',
  },
  {
    id: 'dev-002',
    deviceUid: 'ESP32-KK-RAIN-02',
    name: 'Optical Hail & Rain Detector',
    deviceType: 'rain_sensor_node',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-1',
    isOnline: true,
    lastPing: new Date().toISOString(),
    batteryPercent: 88,
    signalRssi: -64,
    firmwareVersion: 'v1.8.0',
    hardwareModel: 'RG-11 Optical Rain & Sleet Sensor',
    calibrationDate: '2026-02-10',
    isDemoData: true,
  },
  {
    id: 'dev-003',
    deviceUid: 'ESP32-KK-WIND-03',
    name: 'Ultrasonic 2-Axis Anemometer',
    deviceType: 'anemometer_wind_node',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-2',
    isOnline: true,
    lastPing: new Date().toISOString(),
    batteryPercent: 92,
    signalRssi: -69,
    firmwareVersion: 'v2.1.2',
    hardwareModel: 'Pulse-Modulated Wind Vector Node',
    calibrationDate: '2026-01-20',
    isDemoData: true,
  },
  {
    id: 'dev-004',
    deviceUid: 'ESP32-KK-SOIL-04',
    name: 'Trellis Microclimate & Moisture Station',
    deviceType: 'ambient_weather_station',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-1',
    isOnline: true,
    lastPing: new Date().toISOString(),
    batteryPercent: 74,
    signalRssi: -72,
    firmwareVersion: 'v1.9.4',
    hardwareModel: 'Sensirion SHT35 + FDR Soil Probe',
    calibrationDate: '2026-01-15',
    isDemoData: true,
  },
  {
    id: 'dev-005',
    deviceUid: 'ESP32-KK-GW-PANCH-05',
    name: 'Panchavati Orchard Gateway',
    deviceType: 'esp32_canopy_gateway',
    farmId: 'farm-nashik-2',
    plotId: 'plot-nsk-2-1',
    isOnline: false, // Intentionally offline to showcase disconnected device handling
    lastPing: '2026-10-29T19:40:00Z',
    batteryPercent: 12,
    signalRssi: -88,
    firmwareVersion: 'v2.3.0',
    hardwareModel: 'ESP32-S3 + Solar Charger MPPT',
    calibrationDate: '2025-12-05',
    isDemoData: true,
  },
];

// Seed Sensor Telemetry
export const SEED_TELEMETRY: SensorTelemetry[] = [
  {
    id: 'tel-1',
    deviceUid: 'ESP32-KK-RAIN-02',
    plotId: 'plot-nsk-1-1',
    sensorType: 'rain_optical',
    value: 0.0,
    unit: 'mm/hr',
    timestamp: new Date().toISOString(),
    isDemoData: true,
  },
  {
    id: 'tel-2',
    deviceUid: 'ESP32-KK-WIND-03',
    plotId: 'plot-nsk-1-2',
    sensorType: 'wind_speed',
    value: 14.8,
    unit: 'km/h',
    timestamp: new Date().toISOString(),
    isDemoData: true,
  },
  {
    id: 'tel-3',
    deviceUid: 'ESP32-KK-SOIL-04',
    plotId: 'plot-nsk-1-1',
    sensorType: 'temperature',
    value: 29.4,
    unit: '°C',
    timestamp: new Date().toISOString(),
    isDemoData: true,
  },
  {
    id: 'tel-4',
    deviceUid: 'ESP32-KK-SOIL-04',
    plotId: 'plot-nsk-1-1',
    sensorType: 'humidity',
    value: 52,
    unit: '%',
    timestamp: new Date().toISOString(),
    isDemoData: true,
  },
  {
    id: 'tel-5',
    deviceUid: 'ESP32-KK-SOIL-04',
    plotId: 'plot-nsk-1-1',
    sensorType: 'solar_radiation',
    value: 780,
    unit: 'W/m²',
    timestamp: new Date().toISOString(),
    isDemoData: true,
  },
];

// Seed Alerts
export const SEED_ALERTS: AlertItem[] = [
  {
    id: 'alert-1',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-1',
    title: 'Pre-Monsoon Hail Watch – High Convective Clouds',
    description: 'Regional radar detects developing cumulonimbus cell 18 km NW of Dindori. Potential hailstorm risk within 90 minutes.',
    severity: 'warning',
    category: 'weather',
    timestamp: '2026-10-30T06:15:00Z',
    isRead: false,
    recommendedAction: 'Verify HailShield row canopies are primed for immediate closure. Inspect wind safety lockout threshold.',
  },
  {
    id: 'alert-2',
    farmId: 'farm-nashik-2',
    plotId: 'plot-nsk-2-1',
    title: 'IoT Gateway Disconnected – Panchavati Orchard',
    description: 'ESP32-KK-GW-PANCH-05 missed 6 consecutive heartbeat intervals. Solar battery reported 12% before disconnection.',
    severity: 'critical',
    category: 'device',
    timestamp: '2026-10-29T19:45:00Z',
    isRead: false,
    recommendedAction: 'Dispatch field technician to inspect MPPT solar charge controller and check WiFi/LoRa link.',
  },
  {
    id: 'alert-3',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-1',
    title: 'Row 4 Limit Switch Verification Notice',
    description: 'Row 4 closed position limit switch engaged after 12.4s (standard is 10.5s). Possible tension slack on drive cable.',
    severity: 'info',
    category: 'maintenance',
    timestamp: '2026-10-28T08:00:00Z',
    isRead: true,
    recommendedAction: 'Check turnbuckle tension on Row 4 stainless steel guide wire.',
  },
];

// Seed Activity Records
export const SEED_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act-1',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-1',
    userId: 'user-farmer-1',
    userName: 'Shivam Agale',
    userRole: 'farmer',
    actionType: 'CANOPY_CLOSE',
    description: 'Closed Rows 1 to 6 on North Block – Thompson Seedless for intense midday sun / hail readiness.',
    timestamp: '2026-10-28T07:30:00Z',
    metadata: { rows: [1, 2, 3, 4, 5, 6], mode: 'manual' },
  },
  {
    id: 'act-2',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-2',
    userId: 'user-manager-1',
    userName: 'Ganesh Patil',
    userRole: 'farm_manager',
    actionType: 'CANOPY_OPEN',
    description: 'Opened all 8 rows on South Block – Manik Chaman for morning photosynthesis and dew evaporation.',
    timestamp: '2026-10-29T06:45:00Z',
    metadata: { rows: [1, 2, 3, 4, 5, 6, 7, 8], mode: 'manual' },
  },
  {
    id: 'act-3',
    farmId: 'farm-nashik-1',
    plotId: 'plot-nsk-1-1',
    userId: 'user-tech-1',
    userName: 'Rahul Shinde',
    userRole: 'technician',
    actionType: 'MAINTENANCE_LOG',
    description: 'Completed bi-weekly cable tensioning and greased bronze pillow block bearings on Alpha-12 system.',
    timestamp: '2026-10-25T11:00:00Z',
  },
];

// Seed Maintenance Records
export const SEED_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'maint-1',
    plotId: 'plot-nsk-1-1',
    canopySystemId: 'canopy-sys-01',
    technicianId: 'user-tech-1',
    technicianName: 'Rahul Shinde',
    title: 'Pre-Season Trellis Cable Tensioning & Limit Switch Test',
    category: 'preventive',
    notes: 'Checked all 12 rows. Verified torque on 24V motor planetary drive shafts. Re-calibrated optical rain sensor.',
    date: '2026-10-25',
    partsReplaced: ['Stainless Steel Turnbuckle M8 x2', 'Row 2 Limit Switch Micro-contact'],
    status: 'completed',
  },
  {
    id: 'maint-2',
    plotId: 'plot-nsk-2-1',
    canopySystemId: 'canopy-sys-03',
    technicianId: 'user-tech-1',
    technicianName: 'Rahul Shinde',
    title: 'Solar Inverter Battery Terminal Inspection',
    category: 'breakdown',
    notes: 'Gateway went offline. Found loose spade connector on 12V LiFePO4 battery pack.',
    date: '2026-10-30',
    partsReplaced: ['Terminal Lug 6mm²'],
    status: 'scheduled',
  },
];

// Seed Support Tickets
export const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    farmId: 'farm-nashik-1',
    subject: 'Request calibration for ultrasonic anemometer before storm season',
    category: 'hardware',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-10-26T10:15:00Z',
    message: 'We want our wind sensor calibrated against the IMD Nashik airport reference.',
  },
];

function safeGetItem(key: string): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch (e) {
    console.warn(`[Storage] Failed to read ${key}:`, e);
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`[Storage] Failed to write ${key}:`, e);
  }
}

function safeParseArray<T>(raw: string | null, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// Database class
class DatabaseService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const existingFarms = safeGetItem(STORAGE_KEYS.FARMS);
      if (!existingFarms || existingFarms === '[]' || existingFarms === 'null') {
        this.resetToDefaults();
        return;
      }

      if (existingFarms.includes('unsplash.com')) {
        safeSetItem(STORAGE_KEYS.FARMS, JSON.stringify(SEED_FARMS));
      }
      const rawUser = safeGetItem(STORAGE_KEYS.CURRENT_USER);
      if (rawUser && rawUser.includes('unsplash.com')) {
        safeSetItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
      }
      if (!safeGetItem(STORAGE_KEYS.SECTIONS)) {
        safeSetItem(STORAGE_KEYS.SECTIONS, JSON.stringify(SEED_LONGITUDINAL_SECTIONS));
      }
    } catch (e) {
      console.warn('[Storage] Error in init:', e);
      this.resetToDefaults();
    }
  }

  public resetToDefaults() {
    safeSetItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
    safeSetItem(STORAGE_KEYS.FARMS, JSON.stringify(SEED_FARMS));
    safeSetItem(STORAGE_KEYS.PLOTS, JSON.stringify(SEED_PLOTS));
    safeSetItem(STORAGE_KEYS.ROWS, JSON.stringify(generateSeedRows()));
    safeSetItem(STORAGE_KEYS.SECTIONS, JSON.stringify(SEED_LONGITUDINAL_SECTIONS));
    safeSetItem(STORAGE_KEYS.CANOPY_SYSTEMS, JSON.stringify(SEED_CANOPY_SYSTEMS));
    safeSetItem(STORAGE_KEYS.COMMANDS, JSON.stringify([]));
    safeSetItem(STORAGE_KEYS.DEVICES, JSON.stringify(SEED_DEVICES));
    safeSetItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(SEED_TELEMETRY));
    safeSetItem(STORAGE_KEYS.ALERTS, JSON.stringify(SEED_ALERTS));
    safeSetItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    safeSetItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(SEED_MAINTENANCE));
    safeSetItem(STORAGE_KEYS.TICKETS, JSON.stringify(SEED_TICKETS));
    safeSetItem(STORAGE_KEYS.ACTIVE_FARM_ID, SEED_FARMS[0].id);
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in database subscriber:', err);
      }
    });
  }

  // --- User / Auth ---
  public getCurrentUser(): User {
    const raw = safeGetItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return SEED_USERS[0];
    try {
      const user = JSON.parse(raw);
      return user && typeof user === 'object' && user.id ? user : SEED_USERS[0];
    } catch {
      return SEED_USERS[0];
    }
  }

  public setCurrentUser(user: User) {
    safeSetItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }

  public switchUserRole(role: UserRole) {
    const user = SEED_USERS.find((u) => u.role === role) || {
      ...this.getCurrentUser(),
      role,
    };
    this.setCurrentUser(user);
    this.logActivity({
      farmId: this.getActiveFarmId(),
      userId: user.id,
      userName: user.name,
      userRole: role,
      actionType: 'ROLE_SWITCH',
      description: `Switched operational context to ${role.toUpperCase()}`,
    });
  }

  // --- Active Farm ---
  public getActiveFarmId(): string {
    return safeGetItem(STORAGE_KEYS.ACTIVE_FARM_ID) || SEED_FARMS[0].id;
  }

  public setActiveFarmId(farmId: string) {
    safeSetItem(STORAGE_KEYS.ACTIVE_FARM_ID, farmId);
    this.notify();
  }

  // --- Farms CRUD ---
  public getFarms(): Farm[] {
    return safeParseArray<Farm>(safeGetItem(STORAGE_KEYS.FARMS), SEED_FARMS);
  }

  public getFarmById(id: string): Farm | undefined {
    return this.getFarms().find((f) => f.id === id);
  }

  public saveFarm(farm: Farm) {
    const farms = this.getFarms();
    const index = farms.findIndex((f) => f.id === farm.id);
    if (index >= 0) {
      farms[index] = farm;
    } else {
      farms.push(farm);
    }
    safeSetItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));
    this.notify();
  }

  public deleteFarm(farmId: string) {
    let farms = this.getFarms().filter((f) => f.id !== farmId);
    if (farms.length === 0) {
      farms = SEED_FARMS;
    }
    safeSetItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));

    // Also cascade remove its plots
    const plots = this.getPlots().filter((p) => p.farmId !== farmId);
    safeSetItem(STORAGE_KEYS.PLOTS, JSON.stringify(plots));

    if (this.getActiveFarmId() === farmId && farms.length > 0) {
      this.setActiveFarmId(farms[0].id);
    }
    this.notify();
  }

  // --- Plots CRUD ---
  public getPlots(farmId?: string): Plot[] {
    const plots = safeParseArray<Plot>(safeGetItem(STORAGE_KEYS.PLOTS), SEED_PLOTS);
    if (farmId) {
      return plots.filter((p) => p.farmId === farmId);
    }
    return plots;
  }

  public getPlotById(plotId: string): Plot | undefined {
    return this.getPlots().find((p) => p.id === plotId);
  }

  public savePlot(plot: Plot) {
    const plots = this.getPlots();
    const index = plots.findIndex((p) => p.id === plot.id);
    const isNew = index === -1;

    if (index >= 0) {
      plots[index] = plot;
    } else {
      plots.push(plot);
    }
    safeSetItem(STORAGE_KEYS.PLOTS, JSON.stringify(plots));

    // If new plot and has rows, generate default row records
    if (isNew) {
      const allRows = this.getRows();
      for (let r = 1; r <= plot.rowCount; r++) {
        allRows.push({
          id: `row-${plot.id}-${r}`,
          plotId: plot.id,
          rowNumber: r,
          lengthMeters: 100,
          canopyState: 'open',
          positionPercent: 0,
          motorId: `MTR-${plot.plotNumber.replace(/\s+/g, '')}-R${r}`,
          limitSwitchOpenActive: true,
          limitSwitchClosedActive: false,
          lastOperationTime: new Date().toISOString(),
          motorCurrentAmps: 0,
        });
      }
      safeSetItem(STORAGE_KEYS.ROWS, JSON.stringify(allRows));

      if (plot.canopyInstalled && !plot.canopySystemId) {
        const newSystemId = `canopy-sys-${plot.id}`;
        plot.canopySystemId = newSystemId;
        this.saveCanopySystem({
          id: newSystemId,
          plotId: plot.id,
          name: `HailShield System for ${plot.name}`,
          mechanicalType: 'parallel_cable_pulley',
          motorModel: '24V DC Industrial High Torque Planetary Drive',
          actuatorVoltage: '24V_DC',
          operatingMode: 'manual',
          windSpeedLockoutKmh: 35.0,
          emergencyStopEngaged: false,
          status: 'operational',
          simulationMode: true,
          lastSafetyCheck: new Date().toISOString(),
          overheadPoleHeightMeters: 3.5,
          longitudinalTraverseSpeedMetersPerMin: 12.0,
        });
      }
    }

    this.notify();
  }

  public deletePlot(plotId: string) {
    const plots = this.getPlots().filter((p) => p.id !== plotId);
    safeSetItem(STORAGE_KEYS.PLOTS, JSON.stringify(plots));

    const rows = this.getRows().filter((r) => r.plotId !== plotId);
    safeSetItem(STORAGE_KEYS.ROWS, JSON.stringify(rows));

    const systems = this.getCanopySystems().filter((s) => s.plotId !== plotId);
    safeSetItem(STORAGE_KEYS.CANOPY_SYSTEMS, JSON.stringify(systems));

    this.notify();
  }

  // --- Rows CRUD ---
  public getRows(plotId?: string): CropRow[] {
    const rows = safeParseArray<CropRow>(safeGetItem(STORAGE_KEYS.ROWS), generateSeedRows());
    if (plotId) {
      return rows.filter((r) => r.plotId === plotId);
    }
    return rows;
  }

  public updateRow(row: CropRow) {
    const rows = this.getRows();
    const index = rows.findIndex((r) => r.id === row.id);
    if (index >= 0) {
      rows[index] = row;
      safeSetItem(STORAGE_KEYS.ROWS, JSON.stringify(rows));
      this.notify();
    }
  }

  public updateRowsBulk(updatedRows: CropRow[]) {
    const rows = this.getRows();
    const map = new Map(updatedRows.map((r) => [r.id, r]));
    const nextRows = rows.map((r) => map.get(r.id) || r);
    safeSetItem(STORAGE_KEYS.ROWS, JSON.stringify(nextRows));
    this.notify();
  }

  // --- Canopy Systems ---
  public getCanopySystems(): CanopySystem[] {
    return safeParseArray<CanopySystem>(safeGetItem(STORAGE_KEYS.CANOPY_SYSTEMS), SEED_CANOPY_SYSTEMS);
  }

  public getCanopySystemByPlotId(plotId: string): CanopySystem | undefined {
    return this.getCanopySystems().find((s) => s.plotId === plotId);
  }

  public saveCanopySystem(system: CanopySystem) {
    const systems = this.getCanopySystems();
    const index = systems.findIndex((s) => s.id === system.id);
    if (index >= 0) {
      systems[index] = system;
    } else {
      systems.push(system);
    }
    safeSetItem(STORAGE_KEYS.CANOPY_SYSTEMS, JSON.stringify(systems));
    this.notify();
  }

  // --- Longitudinal Canopy Sections (Parallel Column-Wise Control Units) ---
  public getSections(plotId?: string): LongitudinalSection[] {
    const sections = safeParseArray<LongitudinalSection>(
      safeGetItem(STORAGE_KEYS.SECTIONS),
      SEED_LONGITUDINAL_SECTIONS
    );
    if (plotId) {
      return sections.filter((s) => s.plotId === plotId);
    }
    return sections;
  }

  public getSectionById(id: string): LongitudinalSection | undefined {
    return this.getSections().find((s) => s.id === id);
  }

  public saveSection(section: LongitudinalSection) {
    const sections = this.getSections();
    const index = sections.findIndex((s) => s.id === section.id);
    if (index >= 0) {
      sections[index] = section;
    } else {
      sections.push(section);
    }
    safeSetItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    this.notify();
  }

  public updateSectionsBulk(updatedSections: LongitudinalSection[]) {
    const sections = this.getSections();
    const map = new Map(updatedSections.map((s) => [s.id, s]));
    const nextSections = sections.map((s) => map.get(s.id) || s);
    safeSetItem(STORAGE_KEYS.SECTIONS, JSON.stringify(nextSections));
    this.notify();
  }

  // --- Canopy Commands ---
  public getCommands(): CanopyCommand[] {
    return safeParseArray<CanopyCommand>(safeGetItem(STORAGE_KEYS.COMMANDS), []);
  }

  public saveCommand(command: CanopyCommand) {
    const commands = this.getCommands();
    const index = commands.findIndex((c) => c.id === command.id);
    if (index >= 0) {
      commands[index] = command;
    } else {
      commands.unshift(command); // newest first
    }
    // keep latest 100 commands
    safeSetItem(STORAGE_KEYS.COMMANDS, JSON.stringify(commands.slice(0, 100)));
    this.notify();
  }

  // --- IoT Devices ---
  public getDevices(farmId?: string): IoTDevice[] {
    const devices = safeParseArray<IoTDevice>(safeGetItem(STORAGE_KEYS.DEVICES), SEED_DEVICES);
    if (farmId) {
      return devices.filter((d) => d.farmId === farmId);
    }
    return devices;
  }

  public saveDevice(device: IoTDevice) {
    const devices = this.getDevices();
    const index = devices.findIndex((d) => d.id === device.id || d.deviceUid === device.deviceUid);
    if (index >= 0) {
      devices[index] = device;
    } else {
      devices.push(device);
    }
    safeSetItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
    this.notify();
  }

  public deleteDevice(deviceId: string) {
    const devices = this.getDevices().filter((d) => d.id !== deviceId);
    safeSetItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
    this.notify();
  }

  // --- Telemetry ---
  public getTelemetry(): SensorTelemetry[] {
    return safeParseArray<SensorTelemetry>(safeGetItem(STORAGE_KEYS.TELEMETRY), SEED_TELEMETRY);
  }

  public addTelemetry(reading: SensorTelemetry) {
    const readings = this.getTelemetry();
    readings.unshift(reading);
    safeSetItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(readings.slice(0, 50)));
    this.notify();
  }

  // --- Alerts ---
  public getAlerts(farmId?: string): AlertItem[] {
    const alerts = safeParseArray<AlertItem>(safeGetItem(STORAGE_KEYS.ALERTS), SEED_ALERTS);
    if (farmId) {
      return alerts.filter((a) => !a.farmId || a.farmId === farmId);
    }
    return alerts;
  }

  public markAlertRead(alertId: string) {
    const alerts = this.getAlerts();
    const target = alerts.find((a) => a.id === alertId);
    if (target) {
      target.isRead = true;
      safeSetItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      this.notify();
    }
  }

  public addAlert(alert: AlertItem) {
    const alerts = this.getAlerts();
    alerts.unshift(alert);
    safeSetItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    this.notify();
  }

  // --- Activities ---
  public getActivities(farmId?: string): ActivityRecord[] {
    const activities = safeParseArray<ActivityRecord>(safeGetItem(STORAGE_KEYS.ACTIVITIES), SEED_ACTIVITIES);
    if (farmId) {
      return activities.filter((a) => !a.farmId || a.farmId === farmId);
    }
    return activities;
  }

  public logActivity(activity: Omit<ActivityRecord, 'id' | 'timestamp'>) {
    const fullActivity: ActivityRecord = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    const activities = this.getActivities();
    activities.unshift(fullActivity);
    safeSetItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 100)));
    this.notify();
    return fullActivity;
  }

  // --- Maintenance Records ---
  public getMaintenance(plotId?: string): MaintenanceRecord[] {
    const records = safeParseArray<MaintenanceRecord>(safeGetItem(STORAGE_KEYS.MAINTENANCE), SEED_MAINTENANCE);
    if (plotId) {
      return records.filter((m) => m.plotId === plotId);
    }
    return records;
  }

  public saveMaintenance(record: MaintenanceRecord) {
    const records = this.getMaintenance();
    const index = records.findIndex((r) => r.id === record.id);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.unshift(record);
    }
    safeSetItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(records));
    this.notify();
  }

  // --- Support Tickets ---
  public getTickets(): SupportTicket[] {
    return safeParseArray<SupportTicket>(safeGetItem(STORAGE_KEYS.TICKETS), SEED_TICKETS);
  }

  public saveTicket(ticket: SupportTicket) {
    const tickets = this.getTickets();
    tickets.unshift(ticket);
    safeSetItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    this.notify();
  }
}

export const db = new DatabaseService();
