import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Send,
  Check,
  Sparkles,
} from 'lucide-react';

interface AlertsPageProps {
  onOpenCreateRequest: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    triggerEmergencyBroadcast,
  } = useBloodSupply();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (typeFilter !== 'ALL' && alert.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
    return true;
  });

  const activeCount = alerts.filter((a) => a.status === 'Active').length;
  const criticalCount = alerts.filter((a) => a.priority === 'Critical' && a.status === 'Active').length;
  const acknowledgedCount = alerts.filter((a) => a.status === 'Acknowledged').length;
  const resolvedCount = alerts.filter((a) => a.status === 'Resolved').length;

  const handleSimulateAlert = () => {
    const randomGroups: BloodGroup[] = ['O-', 'A-', 'B-', 'AB-'];
    const chosenGroup = randomGroups[Math.floor(Math.random() * randomGroups.length)];
    triggerEmergencyBroadcast(chosenGroup, 'Simulated Emergency Code Red Alert triggered.');
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#B91C1C]" />
            <span>Emergency Alert Center & Crisis Response</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Automated threshold monitors, expiring unit queues, and emergency donor broadcast triggers
          </p>
        </div>

        <button
          onClick={handleSimulateAlert}
          className="px-3.5 py-2 text-xs font-bold bg-[#111827] hover:bg-black text-white rounded-md shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Simulate Emergency Alert</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Active Alerts</p>
          <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{activeCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#DC2626] uppercase tracking-wider">Critical Priority</p>
          <h3 className="text-2xl font-bold text-[#DC2626] font-mono mt-0.5">{criticalCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wider">Acknowledged</p>
          <h3 className="text-2xl font-bold text-[#D97706] font-mono mt-0.5">{acknowledgedCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#059669] uppercase tracking-wider">Resolved</p>
          <h3 className="text-2xl font-bold text-[#059669] font-mono mt-0.5">{resolvedCount}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
              Filter by Alert Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Alert Classifications</option>
              <option value="CRITICAL_STOCK">Critical Blood Stock Shortage</option>
              <option value="LOW_STOCK">Low Stock Warning</option>
              <option value="EXPIRING_UNITS">Expiring Units (&lt; 7 Days)</option>
              <option value="URGENT_REQUEST">Urgent Hospital Request</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Statuses (Active, Acknowledged, Resolved)</option>
              <option value="Active">Active Alerts Only</option>
              <option value="Acknowledged">Acknowledged Only</option>
              <option value="Resolved">Resolved Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 bg-white rounded-lg border border-[#E5E7EB] text-center text-xs text-[#6B7280] space-y-2">
            <CheckCircle2 className="w-7 h-7 text-[#059669] mx-auto" />
            <p className="font-bold text-[#111827]">No Alerts Matching Selected Filters</p>
            <p>All monitored thresholds are operating within safe clinical tolerances.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.priority === 'Critical';
            const isHigh = alert.priority === 'High';
            const isActive = alert.status === 'Active';

            return (
              <div
                key={alert.id}
                className={`p-3.5 sm:p-4 rounded-lg border transition duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  alert.status === 'Resolved'
                    ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-70'
                    : isCrit
                    ? 'bg-[#FEE2E2]/50 border-[#FECACA]'
                    : isHigh
                    ? 'bg-[#FEF3C7]/50 border-[#FDE68A]'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                {/* Left side info */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                      alert.status === 'Resolved'
                        ? 'bg-[#E5E7EB] text-[#6B7280]'
                        : isCrit
                        ? 'bg-[#DC2626] text-white animate-pulse-subtle'
                        : isHigh
                        ? 'bg-[#D97706] text-white'
                        : 'bg-[#DBEAFE] text-[#1E40AF]'
                    }`}
                  >
                    {isCrit ? (
                      <AlertOctagon className="w-4 h-4" />
                    ) : isHigh ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-xs text-[#111827]">{alert.title}</span>
                      {alert.bloodGroup && (
                        <BloodGroupBadge bloodGroup={alert.bloodGroup} size="sm" />
                      )}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          isCrit
                            ? 'bg-[#DC2626] text-white'
                            : isHigh
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                        }`}
                      >
                        {alert.priority} Priority
                      </span>
                      <span className="text-[10px] text-[#6B7280] font-medium">
                        • {alert.date}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280] max-w-2xl leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  {alert.bloodGroup && isActive && (
                    <button
                      onClick={() => triggerEmergencyBroadcast(alert.bloodGroup!)}
                      className="px-2.5 py-1 text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Notify Donors</span>
                    </button>
                  )}

                  {alert.status === 'Active' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] border border-[#E5E7EB] rounded transition cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1 text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white rounded transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Resolve</span>
                    </button>
                  )}

                  {alert.status === 'Resolved' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#065F46] bg-[#D1FAE5] border border-[#A7F3D0] px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
