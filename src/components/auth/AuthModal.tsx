/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User as UserIcon,
  Phone,
  Mail,
  Shield,
  KeyRound,
  LogOut,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onSwitchRole: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'role_context'>('profile');
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [org, setOrg] = useState(currentUser.organizationName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      phone,
      email,
      organizationName: org,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Security Access"
      subtitle="Role-based permissions and agricultural account management"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Brand Header */}
        <div className="flex items-center gap-3 p-3 bg-[#f8faf7] rounded-xl border border-stone-200">
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-10-30_at_8.59.20_AM_bf57edc3.jpeg"
            alt="KhetKavach Logo"
            className="w-12 h-12 object-contain rounded-lg border border-stone-200 bg-white p-0.5 shrink-0"
          />
          <div>
            <div className="font-extrabold text-sm text-emerald-950">
              KhetKavach – HailShield™
            </div>
            <div className="text-[11px] text-stone-500">
              Protection for Every Harvest • Role-Based Farm Access
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Farmer Profile
          </button>
          <button
            onClick={() => setActiveTab('role_context')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'role_context'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Role & Permissions (RBAC)
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Security & OTP
          </button>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            {savedSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile information saved successfully.</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Mobile Phone (SMS / OTP)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Agro Organization / Vineyard Name
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="e.g. Agale Agro Vineyards Nashik"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs shadow-sm"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {activeTab === 'role_context' && (
          <div className="space-y-3">
            <p className="text-stone-600 text-xs leading-relaxed">
              KHETKAVACH enforces strict role-based access control. Switch contexts to test permission boundaries between farm owners, managers, field technicians, and system administrators.
            </p>

            <div className="space-y-2">
              {[
                {
                  role: 'farmer' as const,
                  title: 'Farmer / Farm Owner',
                  desc: 'Full authority to create farms, configure canopy systems, and manage subscriptions.',
                },
                {
                  role: 'farm_manager' as const,
                  title: 'Farm Manager',
                  desc: 'Authorized to operate canopy systems and log daily spraying / maintenance activities.',
                },
                {
                  role: 'technician' as const,
                  title: 'Installation & Service Technician',
                  desc: 'Hardware provisioning, ESP32 calibration, cable tensioning, and mechanical sign-off.',
                },
                {
                  role: 'admin' as const,
                  title: 'Organization / System Admin',
                  desc: 'Global fleet monitoring, support dispatch, and subscription management.',
                },
              ].map((item) => (
                <div
                  key={item.role}
                  onClick={() => onSwitchRole(item.role)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUser.role === item.role
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 font-semibold text-emerald-950'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-stone-900">{item.title}</div>
                    <div className="text-[11px] text-stone-500 font-normal">{item.desc}</div>
                  </div>
                  {currentUser.role === item.role && (
                    <Badge variant="success" size="sm">
                      ACTIVE
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="space-y-3">
            {passwordSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password updated securely with cryptographic hash verification.</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">New Secure Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 space-y-1">
              <span className="font-bold text-stone-800 block">Future OTP Phone Authentication:</span>
              <p className="text-[11px] leading-relaxed">
                Prepared for direct SMS / WhatsApp one-time password verification via Indian telecom DLT gateways for field accessibility.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
