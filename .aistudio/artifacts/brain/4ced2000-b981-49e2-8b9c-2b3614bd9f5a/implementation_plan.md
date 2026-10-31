# KHETKAVACH – HailShield: Technical Architecture & Product Blueprint

**Author:** Chief Technology Officer & Principal Systems Architect  
**Platform:** KHETKAVACH  
**Core Product:** HailShield – Retractable Agricultural Canopy Protection System  
**Tagline:** *Smart Canopies. Safer Harvests.*  
**Initial Deployment Market:** Nashik Horticultural Belt, Maharashtra, India (Grapes, Pomegranates, Tomatoes, High-Value Cash Crops)

---

## 1. Executive Summary & CTO Architectural Thesis

Agricultural technology platforms fail when software architects treat an outdoor, dirty, weather-beaten, power-fluctuating farm like an air-conditioned datacenter. 

Hail storms in the Nashik region (Dindori, Niphad, Peth, Chandwad) are violent, short-warning convective events occurring predominantly in the pre-monsoon (March–May) and post-monsoon (October–November) windows. A single 15-minute hail event can cause 100% loss of export table grapes at the veraison/harvest stage, representing a financial wipeout of ₹4,00,000 to ₹10,00,000 per acre.

**HailShield cannot be a software toy.** It is an industrial cyber-physical automation platform. The software system must adhere to three non-negotiable architectural axioms:

1. **Local Autonomous Safety (Zero-Cloud Dependence for Survival):** The physical field controller must be capable of detecting a storm, assessing wind danger, and safely deploying or aborting canopy deployment even if 4G cellular connectivity, cloud servers, or the mobile app are completely dead.
2. **Explicit Verification of Physical Reality:** The software state `COMMAND_ACKNOWLEDGED` must never be conflated with `CANOPY_DEPLOYED`. Physical travel must be validated through hardware limit switches, motor current draw profiles, or rotary encoder counts.
3. **Hardware Abstraction Layer (HAL):** Mechanical canopy mechanisms vary across crops (grape trellis Y-angle cable-pulley vs. pomegranate high-arch overhead bows). The software must decouple motor control primitives from the physical kinematics.

---

## 2. System Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            FARMER & OPERATOR CLIENTS                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐ │
│  │ Mobile PWA (Marathi)  │  │ Field Tech Diagnostic │  │ Central SaaS Web App  │ │
│  │ Low-bandwidth, High-UI│  │ Modbus / Bluetooth BLE│  │ Fleet Admin & Billing │ │
│  └───────────┬───────────┘  └───────────┬───────────┘  └───────────┬───────────┘ │
└──────────────┼──────────────────────────┼──────────────────────────┼─────────────┘
               │ HTTPS / WSS              │ Direct Link              │ HTTPS / WSS
┌──────────────▼──────────────────────────┴──────────────────────────▼─────────────┐
│                            KHETKAVACH CORE CLOUD API                             │
│                                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────────────┐  │
│  │ Multi-Tenant Auth  │  │ Agronomic Engine   │  │ Canopy Command Orchestrator│  │
│  │ JWT / OTP Gateway  │  │ Phenology & Weather│  │ State Machine & Audit Log  │  │
│  └─────────┬──────────┘  └─────────┬──────────┘  └─────────────┬──────────────┘  │
│            │                       │                           │                 │
│  ┌─────────▼───────────────────────▼───────────────────────────▼──────────────┐  │
│  │          Database Layer: PostgreSQL (Relational) + TimescaleDB             │  │
│  │   Tenant Isolation | Polygons | Motor States | Telemetry Partitions        │  │
│  └─────────────────────────────────┬──────────────────────────────────────────┘  │
└────────────────────────────────────┼─────────────────────────────────────────────┘
                                     │ Secure MQTT over TLS (AWS IoT / EMQX)
┌────────────────────────────────────▼─────────────────────────────────────────────┐
│                       FIELD HARDWARE ARCHITECTURE (EDGE)                         │
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │               KHETKAVACH ESP32 INDUSTRIAL GATEWAY (EDGE NODE)            │   │
│   │                                                                          │   │
│   │   [Local Rules Engine]          [FreeRTOS Task Manager]                  │   │
│   │   - Wind abort threshold        - Sub-second motor current sampling      │   │
│   │   - Rain sensor edge trigger    - Limit-switch interrupt handling        │   │
│   │   - Nonce command verification  - Local SD card incident blacklist       │   │
│   └───────────────┬─────────────────────────────┬────────────────────────────┘   │
│                   │ RS-485 Modbus RTU Bus       │ Opto-Isolated GPIO             │
│       ┌───────────┴───────────┐                 ├────────────────────────────┐   │
│       │                       │                 │                            │   │
│ ┌─────▼──────┐         ┌──────▼──────┐   ┌──────▼──────┐              ┌──────▼─┐ │
│ │ 24V/48V DC │         │ Microclimate│   │ Optical Rain│              │ Rotary │ │
│ │ Motor Node │ ...     │ Weather Node│   │ Hail Sensor │              │ E-Stop │ │
│ │ Limit Sw 1 │         │ Ultrasonic  │   │  (RG-11)    │              │Isolator│ │
│ │ Limit Sw 2 │         │ Anemometer  │   └─────────────┘              │(Hard)  │ │
│ └────────────┘         └─────────────┘                                └────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Review of the 10 Focus Areas

### 3.1 Real Farmer Workflows & Usability

* **Field Reality:** Farmers operate under harsh sunlight with mud-covered fingers, wearing protective gloves during spraying operations, frequently in areas with intermittent 2G/3G/4G connectivity.
* **UX Principles:**
  * **Zero Ambiguity & High Contrast:** Buttons must be oversized (>48px minimum touch target), using high-contrast industrial colors. Avoid low-contrast subtle grays.
  * **Multilingual Localization First:** Full localization in **Marathi (मराठी)** and **Hindi (हिंदी)** alongside English. Agricultural terminology must reflect colloquial local usage (e.g., *'द्राक्ष बाग'* for vineyard, *'मणी धारणा'* for fruit set, *'गारपीट'* for hail).
  * **Two-Tap Critical Actions:** A farmer facing dark cumulonimbus clouds must be able to deploy canopy protection in **two taps**: *Select Plot → Deploy Protection*. No deep menu navigation.
  * **Offline-First Optimistic UI:** App must cache the last known state locally. If offline, the app queues commands, displays clear offline warning badges, and offers fallback to direct **GSM SMS Command Fallback** (`DEPLOY PLOT1`) or local **Bluetooth BLE direct control** at the field edge.

### 3.2 Multi-Farm, Multi-Plot Architecture

* **Hierarchical Tenancy Model:**
  $$\text{Organization} \longrightarrow \text{Farm} \longrightarrow \text{Plot} \longrightarrow \text{Row Zone} \longrightarrow \text{Individual Row}$$
* **Geographical Boundary Mapping:** Farms and Plots are defined not just by a single GPS point, but by **GeoJSON polygon boundaries**. This enables:
  * Spatial query of local microclimate weather models.
  * Plot-specific canopy area calculation.
  * Drone multispectral overlay support in future releases.
* **Independent Plot Operation:** Plot 1 (Thompson Seedless Grapes) may require canopy closed for hail protection, while Plot 2 (Pomegranate) remains open for pollination. Canopy systems must never be forced into global monolithic operation.

### 3.3 Crop-Specific Configurations

Canopy design is structurally governed by crop horticulture and trellis architecture:

| Crop | Trellis / Training System | Canopy Mechanical Type | Light Transmission Req. | Wind Sensitivity |
| :--- | :--- | :--- | :--- | :--- |
| **Table Grapes** | Y-Trellis / Overhead Bower (Pandal) | Cable-pulley longitudinal draw wire | High (80–90% PAR); UV needed for coloring | High (canopy creates massive sail area above trellis) |
| **Pomegranate** | Bush / High Density Arch | Structural curved hoop netting | Medium (prevents fruit sunburn / *telia*) | Moderate (lower profile, wind deflects over arch) |
| **Tomato / Chili**| Staked Wire Trellis | Scissor-arm / Roll-up net | High; humidity control critical | Low-Moderate |

* **Configuration Schema:** The software abstracts canopy geometry into configurable properties: `strokeLengthMeters`, `travelTimeSeconds`, `cableTensionRatingKg`, `windSafetyLockoutKmh`, and `lightTransmissionPercent`.

### 3.4 IoT Device Architecture

* **Edge Compute (ESP32-S3 / ESP32-WROOM-32U):**
  * Dual-core Xtensa 32-bit: Core 0 dedicated to RS-485 Modbus RTU communication and limit-switch hardware interrupts; Core 1 dedicated to WiFi/4G MQTT network stack and TLS encryption.
  * **Communication Protocol:** Primary via **MQTT over TLS 1.3** to cloud broker; secondary via **RS-485 Modbus RTU** inside the field for up to 32 motor relay controllers over 500 meters of twisted-pair wire.
* **Power Budget & Solar MPPT:**
  * Rural power in Maharashtra (*MSEDCL*) is subject to scheduled 8-hour load shedding and phase drops.
  * HailShield Field Gateways **must be solar-powered with dedicated LiFePO4 battery packs** (12V/24V, 50Ah minimum) paired with an MPPT charge controller providing battery telemetry (voltage, temperature, charging state).
* **Heartbeat & Telemetry Ingestion:**
  * Routine heartbeat: Every 60 seconds (ping, battery, RSSI, nominal sensors).
  * Storm Mode (accelerated): Every 5 seconds upon rain detection or rapid barometric drop (>2 hPa/15 min).

### 3.5 Retractable Canopy & Motor-Control Architecture

* **Drive Mechanics:** 24V DC / 48V DC planetary gear motors or low-speed worm gear drives. DC motors are chosen over AC induction motors because:
  * Safe extra-low voltage (SELV) in outdoor wet environments.
  * Native operation from 24V solar battery banks during grid blackouts.
  * Bidirectional H-bridge control with straightforward current sensing for jam detection.
* **Safety Pipeline & State Machine:**
  ```
  [IDLE_OPEN] ──(Deploy Cmd)──► [VALIDATING_SAFETY]
                                       │ (Wind < 35 km/h && E-Stop OK)
                                       ▼
                                [DISPATCHING_EDGE]
                                       │ (Edge Gateway Ack)
                                       ▼
                                [MOTOR_ENERGIZED]
                                       │ (Current Draw Nominal 2-4A)
                                       ▼
                                [TRAVELING_CLOSING]
                                  │             │
                    (Current > 9A)│             │ (Limit Switch 2 Engaged)
                                  ▼             ▼
                           [MOTOR_JAM_TRIP]   [DEPLOYED_CLOSED]
  ```
* **Wind Safety Interlock Calculation:**
  Deploying a 100m $\times$ 3m fabric sheet under 40 km/h wind generates over $1,200 \text{ N}$ of uplift force, capable of snapping trellis end-posts. If local anemometer detects wind $> 35 \text{ km/h}$, deployment is aborted and locked out unless overridden by emergency authorized code.

### 3.6 Hardware-Independent Software Design (HAL)

* To prevent vendor lock-in to specific motor drivers or Chinese sensor modules, KHETKAVACH implements an abstract **Hardware Abstraction Layer (HAL)**:
  * `ICanopyActuator`: Methods `executeMove(direction, targetPercent)`, `emergencyHalt()`, `getTelemetry()`.
  * `IWeatherSensorNode`: Methods `readWindVector()`, `readPrecipitationRate()`, `getDeviceHealth()`.
  * Implementations include `ModbusRelayActuator`, `VirtualSimulatedActuator`, `ShellyProActuator`, `MqttGenericActuator`.
* **The frontend and cloud API interact ONLY with the HAL interface**, never with raw pin states or Modbus registers.

### 3.7 Database Relationships & Entity Schema (PostgreSQL/TimescaleDB)

```sql
-- Multi-Tenant & Identity
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    subscription_tier VARCHAR(50) DEFAULT 'pro',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('farmer', 'farm_manager', 'technician', 'admin')),
    preferred_lang VARCHAR(10) DEFAULT 'mr',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farm & Agronomic Hierarchy
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Maharashtra',
    boundary_polygon GEOMETRY(POLYGON, 4326),
    centroid_lat DOUBLE PRECISION NOT NULL,
    centroid_lng DOUBLE PRECISION NOT NULL,
    total_area_acres NUMERIC(6, 2) NOT NULL,
    soil_classification VARCHAR(100),
    water_source VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    plot_number VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    area_acres NUMERIC(6, 2) NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    crop_variety VARCHAR(100) NOT NULL,
    planting_date DATE,
    growth_stage VARCHAR(50) NOT NULL,
    row_count INT NOT NULL,
    row_spacing_meters NUMERIC(4, 2) NOT NULL,
    canopy_installed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canopy Hardware Kinematics
CREATE TABLE canopy_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    system_name VARCHAR(100) NOT NULL,
    mechanical_type VARCHAR(50) NOT NULL,
    motor_specs VARCHAR(255) NOT NULL,
    actuator_voltage VARCHAR(20) DEFAULT '24V_DC',
    wind_lockout_kmh NUMERIC(4, 1) DEFAULT 35.0,
    emergency_stop_tripped BOOLEAN DEFAULT FALSE,
    operating_mode VARCHAR(20) DEFAULT 'manual',
    is_simulation BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE canopy_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID REFERENCES canopy_installations(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    length_meters NUMERIC(6, 2) NOT NULL,
    position_percent INT DEFAULT 0 CHECK (position_percent BETWEEN 0 AND 100),
    motion_state VARCHAR(20) DEFAULT 'open',
    limit_sw_open_active BOOLEAN DEFAULT TRUE,
    limit_sw_closed_active BOOLEAN DEFAULT FALSE,
    motor_current_amps NUMERIC(4, 2) DEFAULT 0.0,
    last_actuation TIMESTAMPTZ
);

-- IoT & Telemetry (TimescaleDB Hypertable)
CREATE TABLE iot_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_uid VARCHAR(100) UNIQUE NOT NULL,
    farm_id UUID REFERENCES farms(id),
    plot_id UUID REFERENCES plots(id),
    device_type VARCHAR(50) NOT NULL,
    hardware_version VARCHAR(50),
    firmware_version VARCHAR(50),
    is_online BOOLEAN DEFAULT FALSE,
    battery_voltage NUMERIC(4, 2),
    signal_rssi INT,
    last_seen TIMESTAMPTZ
);

CREATE TABLE sensor_telemetry (
    time TIMESTAMPTZ NOT NULL,
    device_id UUID NOT NULL,
    plot_id UUID,
    sensor_type VARCHAR(50) NOT NULL,
    reading_value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    is_demo BOOLEAN DEFAULT FALSE
);
-- Converted to TimescaleDB hypertable in production:
-- SELECT create_hypertable('sensor_telemetry', 'time');

-- Commands & Incident Auditing
CREATE TABLE canopy_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID REFERENCES canopy_installations(id),
    target_rows INT[],
    action VARCHAR(30) NOT NULL,
    state VARCHAR(30) NOT NULL, -- created, dispatched, acked, moving, completed, failed
    initiated_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT
);
```

### 3.8 Authentication & Multi-Tenant Security

* **Multi-Tenant Isolation:** Enforce PostgreSQL Row-Level Security (RLS) on all core tables using `tenant_id` (`org_id`). A farmer in Niphad can never access query plans or telemetry belonging to an estate in Dindori.
* **Cryptographic Command Authentication:**
  * Hardware actuation is safety-critical. A compromised cloud token must not be able to send arbitrary raw motor pulses.
  * Commands sent to Edge Gateways carry a **cryptographic HMAC-SHA256 signature** generated using a per-farm hardware private key paired with a monotonic incrementing nonce to prevent packet replay attacks.
* **OTP Phone Authentication:** Mobile number is primary identity (`+91 98XXX XXXXX`). Integration with Indian DLT-registered SMS routes (MSG91 / Fast2SMS) using short 6-digit expiring tokens (3-minute TTL).

### 3.9 Scalability & Future Commercial Deployment

* **Edge Message Broker:** EMQX or AWS IoT Core clustered broker capable of supporting 10,000+ simultaneous persistent MQTT connections with low latency.
* **Data Ingestion Tier:** Telemetry messages from IoT nodes ingest into Kafka or RabbitMQ before batch insertion into TimescaleDB, decoupling real-time ingestion from database write spikes.
* **API Gateway & Microservices:**
  * *Auth & Identity Service*
  * *Plot & Farm Management Service*
  * *Telemetry Ingestion Service*
  * *Canopy Actuation & Interlock Service*
  * *Meteorological Radar Grounding Service*

### 3.10 Operational Costs & Maintainability

* **Hardware Bill of Materials (BOM) Target:**
  * Central ESP32 Gateway Node with 4G Quectel LTE modem + RS485 + Solar MPPT: **₹8,500 – ₹11,000**.
  * Optical Rain & Hail Sensor (RG-11 solid-state): **₹4,500 – ₹6,000**.
  * Ultrasonic 2-Axis Wind Sensor: **₹6,500 – ₹9,000**.
  * 24V DC 120W Planetary Gear Motor with IP66 sealed enclosure: **₹5,500 per row**.
* **Recurring SaaS Cost Structure:**
  * Cellular IoT M2M SIM (Airtel/Jio IoT 50MB/mo pooling): **₹35 / device / month**.
  * Cloud Server & TimescaleDB storage: **~₹15 / acre / month**.
  * Field Technician Preventive Service Contract (bi-monthly cable grease, turnbuckle tension check): Built into Annual Maintenance Contract (AMC).

---

## 4. Critical Engineering Audit: Risks, Gaps & Assumptions

### 4.1 Missing Requirements (Gaps to Address Before Manufacturing)

1. **Fabric Water-Ponding & Ice Loading Deflection:**
   * Hail is invariably accompanied by intense rain. If the canopy net does not have an engineered drainage slope or relief drop, water and hail stones accumulate in the center, causing thousands of kilograms of deadweight that snaps the high-tensile trellis wires.
   * *Requirement:* Automatic inverted-V ridge geometry and weight-relief tension release points.
2. **Rodent & Termite Cable Damage:**
   * Rural Nashik orchards experience field rodents chewing through low-voltage signal wiring.
   * *Requirement:* Steel-braided flexible conduits for all limit switch and power wiring.
3. **Motor Thermal Cycling & Duty Cycle Limits:**
   * Standard 24V DC planetary gear motors have a 25–30% duty cycle. Continuous deployment across a 150-meter row can overheat motor brushes if geared too fast.
   * *Requirement:* Software motor runtime counters and thermal overload cutoffs.

### 4.2 Technical Risks & Mitigation

| Identified Risk | Severity | Root Cause | Engineering Mitigation |
| :--- | :--- | :--- | :--- |
| **Mechanical Rack Warping in Gusts** | **CRITICAL** | Extending fabric net while crosswind $> 35 \text{ km/h}$ creates aerodynamic lift. | Hardware wind interlock; local ultrasonic anemometer directly halts motor relay without waiting for cloud round-trip. |
| **Grid Power Dropout During Storm** | **HIGH** | MSEDCL rural feeders trip within seconds of thunderstorm lightning. | System operates 100% on dedicated 24V solar LiFePO4 battery banks. No AC mains dependency for actuation. |
| **Cellular Blackout During Squall** | **HIGH** | Heavy rain cells attenuate 4G cellular signals (*rain fade*). | Gateway runs local edge logic: if optical rain sensor triggers AND cloud is unreachable, gateway proceeds with autonomous protective closure. |
| **Motor Relay Welding (Sticky Contacts)**| **HIGH** | High inrush current of DC inductive motors welds relay contacts shut, driving past limit switches. | Dual-redundant safety: Software current cut-off + Physical limit switches wired in series with coil power, mechanically breaking circuit. |

### 4.3 Unrealistic Assumptions to Eliminate

1. **Unrealistic:** *"The canopy can close automatically based purely on satellite weather forecasts."*
   * *Why it fails:* Satellite/NWP forecasts have spatial resolutions of 1–4 km and temporal uncertainty of 30–60 minutes. Closing a canopy unnecessarily starves grapes of sunlight and traps humidity (fostering downy mildew / *karpa*).
   * *Correction:* Forecasts only **prime** the system into *Pre-Alert Standby*; physical closure requires **local optical sensor confirmation** or direct farmer authorization.
2. **Unrealistic:** *"A web UI button is an Emergency Stop."*
   * *Why it fails:* A browser button depends on DOM event loops, WebSocket latency, cellular carriers, and cloud routing. An emergency stop during mechanical entanglement must be physical.
   * *Correction:* Software provides a *Logic Halt*; physical field installations must feature a hardwired, lockable rotary isolator at each headpost that cuts actuator DC bus power.
3. **Unrealistic:** *"All grape varieties need the same protection regime."*
   * *Why it fails:* White table grapes (Thompson Seedless, Manik Chaman) burn easily under direct hail or midday solar heat, while colored grapes (Sharad Seedless, Fantasy) require specific UV wavelengths for anthocyanin skin pigmentation. Canopy schedules must be variety-aware.

### 4.4 Decisions Requiring Urgent Field Validation

* [ ] **Field Test 1: Wind Tunnel / Field Lift Measurement:** Measure actual cable tension and end-post deflection on a 100m row in Dindori at 25 km/h, 35 km/h, and 45 km/h crosswinds.
* [ ] **Field Test 2: Optical Rain Sensor vs. Hail Impact:** Validate whether RG-11 optical sensors reliably discriminate between light rain mist (dew) and actual hail sleet pellets within 15 seconds.
* [ ] **Field Test 3: Motor Speed vs. Vine Snagging:** Test 60-second vs. 120-second row deployment speeds to ensure moving hem cables do not snag tender young vine shoots (*viti*).

---

## 5. Phased Implementation Roadmap

```
PHASE 1: ESSENTIAL MVP (Current Sprint)
├── Multi-farm & Multi-plot Relational Hierarchy
├── Role-Based Access Control (Farmer / Manager / Tech / Admin)
├── Interactive Overhead Plot Trellis Studio
├── Real Open-Meteo Satellite Integration (Nashik GPS Grounded)
├── 5-Stage Safety Motor Control Pipeline (SIMULATION MODE)
├── High-Wind Interlock Guard & Hardware E-Stop Disclaimer
└── IoT Sensor Registry with explicit DEMO DATA badges

PHASE 2: COMMERCIAL PILOT (Next Release - Q2 2027)
├── Physical ESP32 Hardware Firmware Validation (RS-485 Modbus)
├── DLT-Compliant SMS / WhatsApp OTP Authentication
├── Offline-First Local Gateway Cache & BLE Direct Diagnostics
├── TimescaleDB Telemetry Partitioning & Alert Notification Engine
└── Razorpay / Stripe Billing Integration for ₹/acre/year Tariffs

PHASE 3: ENTERPRISE & AUTOMATION (Long-Term - Q4 2027+)
├── Autonomous Multi-Sensor Fusion (Radar + In-Field Sensor)
├── Drone NDVI Multispectral Layer Integration
├── Microclimate Disease Prediction Models (Downy & Powdery Mildew)
└── Cooperative Fleet Management for Large Agro-Processors (Sula, Sahyadri Farms)
```

---

## 6. Implementation Plan Artifact Confirmation

This blueprint governs all subsequent development on KHETKAVACH. The corresponding operational code foundation has been structured to honor these exact safety constraints, HAL abstractions, and agronomic workflows.
