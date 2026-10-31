/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Shield,
  HelpCircle,
  FileText,
  Send,
  AlertCircle,
  Sparkles,
  PhoneCall,
  Check,
} from 'lucide-react';
import { Farm } from '../../types';

interface SubscriptionBillingProps {
  activeFarm: Farm | undefined;
}

export const SubscriptionBilling: React.FC<SubscriptionBillingProps> = ({ activeFarm }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Smallholder Grower',
      badge: 'Individual Farmers',
      priceInrPerAcre: '₹4,500',
      period: 'per acre / year',
      recommended: '1 - 4 Acres (Small Orchards)',
      popular: false,
      features: [
        'Up to 2 Farms & 4 Plots',
        'Manual motorized canopy controls',
        'Open-Meteo local weather forecasts',
        'In-app storm notifications',
        'Field technician support (48h SLA)',
        'Basic activity logging',
      ],
    },
    {
      id: 'pro',
      name: 'Commercial Vineyard Pro',
      badge: 'RECOMMENDED FOR EXPORT TABLE GRAPES',
      priceInrPerAcre: '₹7,800',
      period: 'per acre / year',
      recommended: '5 - 25 Acres (Export Vineyards)',
      popular: true,
      features: [
        'Unlimited Farms & Plots under account',
        'Automated Convective Storm & Hail Auto-Deployment',
        'High-resolution microclimate telemetry',
        'Priority SMS & WhatsApp squall alerts',
        '24/7 Emergency Storm Dispatch Hotline',
        'Quarterly cable tensioning & winch motor service',
        'Crop insurance certification export',
      ],
    },
    {
      id: 'enterprise',
      name: 'Estate & Corporate Agro',
      badge: 'Wineries & Producer Companies',
      priceInrPerAcre: '₹11,500',
      period: 'per acre / year',
      recommended: '25+ Acres (Multi-Cluster Estates)',
      popular: false,
      features: [
        'All Pro Tier capabilities included',
        'Custom RS485 Modbus & SCADA field integration',
        'Dedicated On-Call Field Agricultural Engineer',
        'Annual anti-hail net integrity inspection & replacement guarantee',
        'Multi-user role access (Manager, Technician, Agronomist)',
        'SLA 2-hour onsite response time in Nashik district',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Transparent Commercial Protection
              </span>
              <span className="text-xs text-stone-500">
                Billing linked to active landholding: {activeFarm?.totalAreaAcres || 12.5} Acres
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-800" />
              <span>Subscription & Protection Plans</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Annual crop protection and motorized canopy maintenance plans designed specifically for Maharashtra vineyard and horticulture economics.
            </p>
          </div>

          <div className="p-3 bg-[#f8faf7] rounded-xl border border-stone-200 text-xs">
            <span className="block text-stone-500 text-[10px] uppercase font-bold">Active Plan</span>
            <strong className="text-stone-900 font-extrabold text-sm">Commercial Vineyard Pro</strong>
            <span className="block text-[11px] text-emerald-800 font-semibold mt-0.5">Renews Nov 2027</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all cursor-pointer relative ${
                plan.popular
                  ? 'border-emerald-700 shadow-md ring-2 ring-emerald-700/10'
                  : 'border-stone-200 shadow-2xs hover:border-stone-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-emerald-800 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                    Most Popular in Nashik
                  </span>
                </div>
              )}

              <div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  {plan.badge}
                </div>
                <h3 className="text-lg font-black text-stone-900 mt-1">{plan.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{plan.recommended}</p>

                <div className="my-5 pb-5 border-b border-stone-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-stone-900">{plan.priceInrPerAcre}</span>
                    <span className="text-xs text-stone-500">{plan.period}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    GST applicable as per Indian agricultural equipment norms (nil/5%)
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-2.5">
                  <span className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Included Capabilities:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <button
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {isSelected ? 'Active Selected Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              Government Subsidy & Agricultural Bank Compliance
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              KHETKAVACH HailShield is eligible for state agricultural department shade-net subsidy documentation and NABARD loan certifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <a
            href="tel:18004197233"
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>Speak to Commercial Advisor</span>
          </a>
        </div>
      </div>
    </div>
  );
};
