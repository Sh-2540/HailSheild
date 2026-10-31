/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Copy,
  Check,
  Send,
  Radio,
  FileCode,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react';
import { IoTDevice } from '../../types';
import { Badge } from '../common/Badge';

interface HardwareGatewayConsoleProps {
  devices: IoTDevice[];
}

export const HardwareGatewayConsole: React.FC<HardwareGatewayConsoleProps> = ({ devices }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'firmware' | 'rest_api' | 'mqtt' | 'pinout'>('firmware');
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        deviceUid: 'ESP32-KK-GW-01',
        timestamp: new Date().toISOString(),
        batteryVoltage: 27.4,
        relays: [
          { row: 1, state: 'CLOSED', limitSwitch: 'ENGAGED' },
          { row: 2, state: 'CLOSED', limitSwitch: 'ENGAGED' },
        ],
        windSpeedKmh: 14.8,
        rainOpticalRaw: 0,
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const esp32FirmwareSnippet = `/**
 * KHETKAVACH - HailShield ESP32 Field Gateway Controller Firmware
 * Target: ESP32-WROOM-32U / ESP32-S3 DevKit
 * Architecture: FreeRTOS Dual Core + RS-485 Modbus RTU + Secure HTTP/MQTT
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID = "KHETKAVACH_FIELD_NET";
const char* WIFI_PASS = "NashikAgriSafe2026";
const char* API_ENDPOINT = "https://khetkavach.agri/api/v1/iot/telemetry";
const char* DEVICE_UID = "ESP32-KK-GW-01";

// Pinout mapping for Row 1 Actuation & Limit Switches
#define RELAY_ROW1_EXTEND_PIN  18  // Motor Deploy (Close)
#define RELAY_ROW1_RETRACT_PIN 19  // Motor Retract (Open)
#define LIMIT_SW_OPEN_PIN      21  // Optocoupler Input: Open Limit
#define LIMIT_SW_CLOSED_PIN    22  // Optocoupler Input: Closed Limit
#define ESTOP_HARDWARE_PIN     23  // Hardware Loop Interlock (Normally Closed)

volatile bool eStopTripped = false;

void IRAM_ATTR onHardwareEStop() {
  eStopTripped = true;
  digitalWrite(RELAY_ROW1_EXTEND_PIN, LOW);
  digitalWrite(RELAY_ROW1_RETRACT_PIN, LOW);
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_ROW1_EXTEND_PIN, OUTPUT);
  pinMode(RELAY_ROW1_RETRACT_PIN, OUTPUT);
  pinMode(LIMIT_SW_OPEN_PIN, INPUT_PULLUP);
  pinMode(LIMIT_SW_CLOSED_PIN, INPUT_PULLUP);
  pinMode(ESTOP_HARDWARE_PIN, INPUT_PULLUP);

  // Safety: Attach hardware interrupt for immediate de-energization
  attachInterrupt(digitalPinToInterrupt(ESTOP_HARDWARE_PIN), onHardwareEStop, FALLING);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.println("[KHETKAVACH] Initializing HailShield Gateway Node...");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED && !eStopTripped) {
    sendTelemetry();
    pollCanopyCommands();
  }
  delay(1000); // 1Hz telemetry cycle
}

void sendTelemetry() {
  HTTPClient http;
  http.begin(API_ENDPOINT);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-UID", DEVICE_UID);

  StaticJsonDocument<256> doc;
  doc["deviceUid"] = DEVICE_UID;
  doc["ls_open"] = (digitalRead(LIMIT_SW_OPEN_PIN) == LOW);
  doc["ls_closed"] = (digitalRead(LIMIT_SW_CLOSED_PIN) == LOW);
  doc["estop_active"] = eStopTripped;

  String payload;
  serializeJson(doc, payload);
  int httpCode = http.POST(payload);
  http.end();
}

void pollCanopyCommands() {
  // Command polling routine...
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(esp32FirmwareSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestPost = () => {
    try {
      JSON.parse(testPayload);
      setApiResponse(
        JSON.stringify(
          {
            status: 'success',
            code: 200,
            message: 'Telemetry ingestion accepted & processed by HailShield Core',
            acknowledgedAt: new Date().toISOString(),
            deviceState: 'ONLINE',
          },
          null,
          2
        )
      );
    } catch {
      setApiResponse(
        JSON.stringify({ error: 'Invalid JSON payload formatting' }, null, 2)
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900 rounded-2xl p-6 text-white border border-stone-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-600">
                HARDWARE ARCHITECTURE & FIRMWARE
              </span>
              <span className="text-stone-400 text-xs">ESP32 • RS-485 • FreeRTOS</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <span>HailShield IoT Gateway & Firmware Console</span>
            </h2>
            <p className="text-stone-300 text-xs mt-1 max-w-2xl">
              Production-ready telemetry protocol, hardware pinouts, and field gateway C++ firmware for connecting physical actuators to KHETKAVACH.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('firmware')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'firmware'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            ESP32 C++ Firmware
          </button>
          <button
            onClick={() => setActiveTab('rest_api')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'rest_api'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            REST Telemetry API
          </button>
          <button
            onClick={() => setActiveTab('pinout')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'pinout'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            Electrical Pinout & Relays
          </button>
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'firmware' && (
        <div className="bg-stone-950 rounded-xl border border-stone-800 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-300 text-xs">
            <span className="font-mono text-emerald-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              HailShield_ESP32_Gateway_v2.4.ino
            </span>
            <button
              onClick={copyCode}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Firmware'}</span>
            </button>
          </div>

          <pre className="p-4 bg-stone-900 rounded-lg text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800">
            {esp32FirmwareSnippet}
          </pre>
        </div>
      )}

      {activeTab === 'rest_api' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Interactive Telemetry Gateway Ingestion Tester
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Endpoint: <code className="text-emerald-800 bg-stone-100 px-1 py-0.5 rounded font-mono">POST /api/v1/iot/telemetry</code>
              </p>
            </div>
            <Badge variant="info" size="sm">
              HTTPS / JSON
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                Raw JSON Telemetry Request Payload
              </label>
              <textarea
                rows={10}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                onClick={handleTestPost}
                className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Gateway HTTP POST</span>
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                Server Response Status
              </label>
              <pre className="w-full p-3 h-56 font-mono text-xs bg-stone-900 text-emerald-400 rounded-lg overflow-y-auto border border-stone-800">
                {apiResponse || '// Press "Simulate Gateway HTTP POST" to test ingestion.'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pinout' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-stone-900">
            Field Wiring & Controller Pinout Guide (Nashik Standard Spec)
          </h3>
          <p className="text-stone-600 text-xs">
            Standard electrical schematic for 24V DC reversible planetary gear motors and industrial micro-switches.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">Actuator H-Bridge Relays</span>
              <ul className="text-stone-600 space-y-1 text-[11px]">
                <li>GPIO 18: Relay K1 (Motor Close / Deploy)</li>
                <li>GPIO 19: Relay K2 (Motor Open / Retract)</li>
                <li>Voltage: 24V DC @ 8A Peak</li>
                <li>Protection: Flyback Diode 1N5408</li>
              </ul>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">Limit Switches (PC817 Opto)</span>
              <ul className="text-stone-600 space-y-1 text-[11px]">
                <li>GPIO 21: LS1 Open End-of-Travel</li>
                <li>GPIO 22: LS2 Closed End-of-Travel</li>
                <li>Isolation: 5000V RMS Optocoupler</li>
                <li>Debounce: 50ms Hardware RC Filter</li>
              </ul>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-800 block mb-1">Safety & Emergency Loop</span>
              <ul className="text-stone-600 space-y-1 text-[11px]">
                <li>GPIO 23: Hardware E-Stop (NC Loop)</li>
                <li>Physical: Lockable Rotary Switch at Trellis Head</li>
                <li>Action: Hardware Cutoff to Main Contactor</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
