/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface SafetyDisclaimerProps {
  compact?: boolean;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-lg text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="leading-tight">
          <strong>Hardware Safety Protocol:</strong> Acknowledged commands require limit-switch confirmation. Software E-Stop dispatches logic halt; on-field rotary isolator takes mechanical precedence.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 space-y-2">
      <div className="flex items-center gap-2 font-semibold text-stone-900">
        <ShieldAlert className="w-4 h-4 text-emerald-700" />
        <span>HailShield Agricultural Canopy Safety Architecture</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-stone-600">
        <div className="bg-white p-3 rounded-lg border border-stone-200">
          <strong className="block text-stone-800 mb-1">1. Motion vs Command State</strong>
          Command receipt does not guarantee physical shaft rotation. Positions are strictly validated against optocoupled open/closed limit switches.
        </div>
        <div className="bg-white p-3 rounded-lg border border-stone-200">
          <strong className="block text-stone-800 mb-1">2. Wind Force Interlock</strong>
          Deploying canopies in winds &gt; 35 km/h causes immense aerodynamic lift. HailShield controller auto-aborts deployment during storm gusts.
        </div>
        <div className="bg-white p-3 rounded-lg border border-stone-200">
          <strong className="block text-stone-800 mb-1">3. Physical Emergency Stop</strong>
          Software emergency stops trip actuator relay drivers. Certified field safety mandates a physical lockable rotary isolator at each headpost.
        </div>
      </div>
    </div>
  );
};
