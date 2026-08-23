import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup, AppSettings } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  Settings,
  Sliders,
  Bell,
  Save,
  RotateCcw,
  Building,
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData } = useBloodSupply();

  const [formSettings, setFormSettings] = useState<AppSettings>(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleThresholdChange = (group: BloodGroup, value: number) => {
    setFormSettings((prev) => ({
      ...prev,
      minThresholds: {
        ...prev.minThresholds,
        [group]: Math.max(1, value),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1100px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#B91C1C]" />
            <span>System Configuration & Thresholds</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Customize facility metadata, safety buffer margins, and automated notification triggers
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-3 py-1.5 text-xs font-semibold text-[#DC2626] bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FECACA] rounded-md transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Sample Data Baseline</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Facility & Administrative Identity */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F3F4F6]">
            <Building className="w-4 h-4 text-[#B91C1C]" />
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Facility & Administrator Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                Blood Transfusion Center Name
              </label>
              <input
                type="text"
                value={formSettings.bloodBankName}
                onChange={(e) => setFormSettings({ ...formSettings, bloodBankName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden transition"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                Facility License Code
              </label>
              <input
                type="text"
                value={formSettings.facilityCode}
                onChange={(e) => setFormSettings({ ...formSettings, facilityCode: e.target.value })}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-mono outline-hidden transition"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                Chief Logistics Officer / Director
              </label>
              <input
                type="text"
                value={formSettings.adminName}
                onChange={(e) => setFormSettings({ ...formSettings, adminName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden transition"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                Official Alert Dispatch Email
              </label>
              <input
                type="email"
                value={formSettings.adminEmail}
                onChange={(e) => setFormSettings({ ...formSettings, adminEmail: e.target.value })}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Minimum Safe Stock Thresholds */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#B91C1C]" />
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Minimum Safe Stock Margins (Units)</h3>
                <p className="text-[11px] text-[#6B7280]">
                  When vault inventory dips below these numbers, critical deficit alarms trigger automatically
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BLOOD_GROUPS.map((bg) => (
              <div
                key={bg}
                className="p-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <BloodGroupBadge bloodGroup={bg} size="sm" />
                  <span className="font-mono font-bold text-[#111827] text-xs">
                    {formSettings.minThresholds[bg]} Units
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={formSettings.minThresholds[bg]}
                  onChange={(e) => handleThresholdChange(bg, parseInt(e.target.value))}
                  className="w-full accent-[#B91C1C] cursor-pointer h-1.5 bg-[#E5E7EB] rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notification Channels & Automation Rules */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F3F4F6]">
            <Bell className="w-4 h-4 text-[#B91C1C]" />
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Emergency Broadcast & Notification Rules</h3>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] transition cursor-pointer">
              <div>
                <span className="font-bold text-[#111827]">In-App Live Alert Banners</span>
                <p className="text-[#6B7280] text-[11px]">Show visual emergency badges when blood groups fall into Critical deficit.</p>
              </div>
              <input
                type="checkbox"
                checked={formSettings.notificationsEnabled}
                onChange={(e) => setFormSettings({ ...formSettings, notificationsEnabled: e.target.checked })}
                className="h-4 w-4 rounded text-[#B91C1C] accent-[#B91C1C]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] transition cursor-pointer">
              <div>
                <span className="font-bold text-[#111827]">Automated SMS Broadcast to Registered Donors</span>
                <p className="text-[#6B7280] text-[11px]">Automatically broadcast urgent requests to eligible matching donors when code red is activated.</p>
              </div>
              <input
                type="checkbox"
                checked={formSettings.autoEmergencyDonorAlert}
                onChange={(e) => setFormSettings({ ...formSettings, autoEmergencyDonorAlert: e.target.checked })}
                className="h-4 w-4 rounded text-[#B91C1C] accent-[#B91C1C]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] transition cursor-pointer">
              <div>
                <span className="font-bold text-[#111827]">SMS Hotline Gateway</span>
                <p className="text-[#6B7280] text-[11px]">Send dispatch notifications directly to partner hospital ambulance desks.</p>
              </div>
              <input
                type="checkbox"
                checked={formSettings.smsAlertsEnabled}
                onChange={(e) => setFormSettings({ ...formSettings, smsAlertsEnabled: e.target.checked })}
                className="h-4 w-4 rounded text-[#B91C1C] accent-[#B91C1C]"
              />
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-md shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Reset Baseline Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 space-y-3.5 text-center border border-[#E5E7EB]">
            <div className="w-10 h-10 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#111827]">Reset Demo Data Baseline?</h3>
            <p className="text-xs text-[#6B7280]">
              This will restore all inventory counts, donor registries, and hospital requests back to the default realistic demonstration state.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-1.5 text-xs font-semibold bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-1.5 text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] rounded-md cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
