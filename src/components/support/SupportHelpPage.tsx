/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  PhoneCall,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  Shield,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { SupportTicket, Farm } from '../../types';
import { db } from '../../services/storage';

interface SupportHelpPageProps {
  tickets: SupportTicket[];
  activeFarm: Farm | undefined;
  onSubmitTicket: (ticket: SupportTicket) => void;
}

export const SupportHelpPage: React.FC<SupportHelpPageProps> = ({
  tickets,
  activeFarm,
  onSubmitTicket,
}) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('hardware');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      farmId: activeFarm?.id || 'farm-nashik-1',
      subject: subject.trim(),
      category,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      message: message.trim(),
    };

    onSubmitTicket(newTicket);
    setSubject('');
    setMessage('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const faqs = [
    {
      q: 'How quickly do the motorized canopies deploy over the vines?',
      a: 'The Bafang 24V planetary winch traverses the 110-meter longitudinal cable at approximately 12 meters per minute, covering a standard plot section in under 2 minutes.',
    },
    {
      q: 'What happens if wind exceeds 35 km/h during a storm?',
      a: 'Deploying anti-hail net in wind speeds above 35 km/h creates significant aerodynamic lift and risks structural cable stress. The HailShield safety controller will engage a wind-lockout to prevent net tearing.',
    },
    {
      q: 'Are the canopies certified for Maharashtra table grape trellis systems?',
      a: 'Yes, HailShield is custom-engineered for Y-trellis (9-ft row spacing) standard in Nashik, Dindori, and Niphad table grape vineyards, with high clearance above vine foliage.',
    },
    {
      q: 'How do I handle power failure during severe thunderstorms?',
      a: 'Each central gateway is equipped with a solar MPPT charger and 12V LiFePO4 battery buffer. In addition, each headpost includes a manual geared hand-crank override.',
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
                24/7 Field Support & Agronomy Assistance
              </span>
              <span className="text-xs text-stone-500">Nashik District Field Engineering Center</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-800" />
              <span>Help & Farmer Support</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Get immediate assistance from certified agricultural engineers, request onsite maintenance, or check system operation manuals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:18004197233"
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>Toll Free: 1800-419-7233</span>
            </a>
          </div>
        </div>

        {/* Emergency Contacts Strip */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8faf7] border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Nashik Field Center</span>
            <span className="text-stone-500 text-[11px] block">Gangapur Road, Near Ashok Stambh</span>
            <span className="text-emerald-800 font-semibold block mt-1">+91 (0253) 259-8812</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8faf7] border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Dindori Service Mobile Van</span>
            <span className="text-stone-500 text-[11px] block">Rapid response technician team</span>
            <span className="text-emerald-800 font-semibold block mt-1">+91 98902 55319</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8faf7] border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Agronomy Advice Hotline</span>
            <span className="text-stone-500 text-[11px] block">Viticulture & microclimate guidance</span>
            <span className="text-emerald-800 font-semibold block mt-1">agronomy@khetkavach.in</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Create Ticket & Active Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Submit Ticket Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-800" />
              <span>Submit Support Request or Service Ticket</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Certified technicians dispatched within 4 hours for high-priority operational emergencies
            </p>
          </div>

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Your support ticket has been submitted. A technician will contact you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Row 2 Limit Switch Calibration / Cable Tension Check"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                >
                  <option value="hardware">Motor or Cable Hardware</option>
                  <option value="emergency">Emergency Storm Assist</option>
                  <option value="app">Application & Weather Alerts</option>
                  <option value="billing">Subscription & Invoicing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Urgency</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                >
                  <option value="low">Low (General Query)</option>
                  <option value="medium">Medium (Next Maintenance)</option>
                  <option value="high">High (Impending Hail Season)</option>
                  <option value="urgent">Urgent (System Inoperable)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Description of Issue</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe symptoms, affected plot or row number, and physical observations..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Active Tickets */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900">
              Active Support Tickets ({tickets.length})
            </h2>
            <span className="text-xs text-stone-500">Updated Real-Time</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-[#fbfcf9] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 truncate max-w-[200px]">
                    {t.subject}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] line-clamp-2">{t.message}</p>
                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                  <span className="uppercase font-semibold text-stone-600">
                    Category: {t.category}
                  </span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {tickets.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-500">
                No open support requests. All farm systems are fully operational.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
          Frequently Asked Agricultural & Canopy Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#f8faf7] border border-stone-200 text-xs space-y-1.5">
              <strong className="text-stone-900 block font-bold text-xs">{faq.q}</strong>
              <p className="text-stone-600 text-[11px] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
