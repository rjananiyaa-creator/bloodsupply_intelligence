import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup, BloodStock } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  Boxes,
  Plus,
  Sliders,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Droplet,
  Send,
  X,
} from 'lucide-react';
import { BLOOD_COMPATIBILITY } from '../../data/initialData';

interface InventoryPageProps {
  onOpenAddModal: (type: 'stock' | 'donor' | 'request', bloodGroup?: BloodGroup) => void;
  onOpenUpdateModal: (bloodGroup: BloodGroup) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  onOpenAddModal,
  onOpenUpdateModal,
}) => {
  const {
    inventory,
    settings,
    getStockStatus,
    triggerEmergencyBroadcast,
    searchQuery,
    setSearchQuery,
    totalUnits,
    totalReservedUnits,
    totalExpiringUnits,
  } = useBloodSupply();

  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'group' | 'units_desc' | 'units_asc' | 'expiring'>('units_asc');
  const [detailModalGroup, setDetailModalGroup] = useState<BloodStock | null>(null);

  // Filter logic
  const filtered = inventory.filter((item) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchGroup = item.bloodGroup.toLowerCase().includes(q);
      const matchStatus = getStockStatus(item.bloodGroup).toLowerCase().includes(q);
      if (!matchGroup && !matchStatus) return false;
    }

    // Blood group filter
    if (selectedGroupFilter !== 'ALL' && item.bloodGroup !== selectedGroupFilter) {
      return false;
    }

    // Stock status filter
    if (selectedStatusFilter !== 'ALL') {
      const status = getStockStatus(item.bloodGroup);
      if (status !== selectedStatusFilter) return false;
    }

    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'units_desc') return b.availableUnits - a.availableUnits;
    if (sortBy === 'units_asc') return a.availableUnits - b.availableUnits;
    if (sortBy === 'expiring') return b.expiringUnits - a.expiringUnits;
    return a.bloodGroup.localeCompare(b.bloodGroup);
  });

  return (
    <div className="p-4 sm:p-5 max-w-[1400px] mx-auto space-y-4">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#B91C1C]" />
            <span>Blood Inventory Management</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Real-time cold-chain stock levels, safety thresholds, and reserve allocations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenUpdateModal('A+')}
            className="px-3 py-1.5 text-xs font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] border border-[#E5E7EB] rounded-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Reconcile / Adjust</span>
          </button>
          <button
            onClick={() => onOpenAddModal('stock')}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Stats Mini Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Total Available Stock</p>
            <h3 className="text-2xl font-bold text-[#B91C1C] font-mono mt-0.5">{totalUnits} Units</h3>
          </div>
          <div className="w-9 h-9 rounded-md bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center">
            <Droplet className="w-4 h-4 fill-[#B91C1C]" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Reserved for Surgeries</p>
            <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{totalReservedUnits} Units</h3>
          </div>
          <div className="w-9 h-9 rounded-md bg-[#F3F4F6] text-[#6B7280] flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#6B7280]" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wider">Expiring in &lt; 7 Days</p>
            <h3 className="text-2xl font-bold text-[#D97706] font-mono mt-0.5">{totalExpiringUnits} Units</h3>
          </div>
          <div className="w-9 h-9 rounded-md bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
        </div>
      </div>

      {/* Search, Filters, and Sort Controls Card */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search group or status..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] placeholder:text-[#6B7280] outline-hidden transition"
            />
          </div>

          {/* Blood Group Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="Critical">Critical Deficit Only</option>
              <option value="Low">Low Buffer Only</option>
              <option value="Good">Good / Optimal Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="units_asc">Sort: Lowest Stock First</option>
              <option value="units_desc">Sort: Highest Stock First</option>
              <option value="expiring">Sort: Expiring Soonest</option>
              <option value="group">Sort: Blood Group Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3.5">Blood Group</th>
                <th className="py-2.5 px-3.5">Available Units</th>
                <th className="py-2.5 px-3.5">Reserved</th>
                <th className="py-2.5 px-3.5">Expiring (&le;7d)</th>
                <th className="py-2.5 px-3.5">Min Safe Level</th>
                <th className="py-2.5 px-3.5">Optimal Target</th>
                <th className="py-2.5 px-3.5">Stock Status</th>
                <th className="py-2.5 px-3.5">Last Updated</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6B7280] text-xs">
                    No blood groups match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const min = settings.minThresholds[item.bloodGroup] || item.minimumRequired;
                  const optimal = settings.optimalThresholds[item.bloodGroup] || item.optimalLevel;
                  const status = getStockStatus(item.bloodGroup);

                  return (
                    <tr
                      key={item.bloodGroup}
                      className={`hover:bg-[#F3F4F6]/60 transition ${
                        status === 'Critical' ? 'bg-[#FEE2E2]/30' : ''
                      }`}
                    >
                      {/* Blood Group */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <BloodGroupBadge bloodGroup={item.bloodGroup} size="md" />
                          {item.bloodGroup === 'O-' && (
                            <span className="text-[9px] bg-[#FEE2E2] text-[#991B1B] font-bold px-1.5 py-0.2 rounded border border-[#FECACA]">
                              Universal
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Available Units with Gauge bar */}
                      <td className="py-2.5 px-3.5">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#111827] font-mono">
                            {item.availableUnits} <span className="text-[10px] font-normal text-[#6B7280]">Units</span>
                          </span>
                          <div className="w-24 bg-[#F3F4F6] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                status === 'Critical'
                                  ? 'bg-[#DC2626]'
                                  : status === 'Low'
                                  ? 'bg-[#D97706]'
                                  : 'bg-[#059669]'
                              }`}
                              style={{ width: `${Math.min(100, (item.availableUnits / optimal) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Reserved */}
                      <td className="py-2.5 px-3.5 font-mono font-semibold text-[#111827]">
                        {item.reservedUnits}
                      </td>

                      {/* Expiring */}
                      <td className="py-2.5 px-3.5 font-mono font-semibold">
                        <span
                          className={
                            item.expiringUnits > 0
                              ? 'text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded text-[10px]'
                              : 'text-[#6B7280]'
                          }
                        >
                          {item.expiringUnits} Units
                        </span>
                      </td>

                      {/* Minimum Required */}
                      <td className="py-2.5 px-3.5 font-mono text-[#6B7280] font-semibold">
                        {min} Units
                      </td>

                      {/* Optimal Target */}
                      <td className="py-2.5 px-3.5 font-mono text-[#6B7280]">
                        {optimal} Units
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            status === 'Critical'
                              ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                              : status === 'Low'
                              ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                              : 'bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]'
                          }`}
                        >
                          {status === 'Critical' && <AlertTriangle className="w-3 h-3 text-[#DC2626]" />}
                          {status === 'Low' && <Clock className="w-3 h-3 text-[#D97706]" />}
                          {status === 'Good' && <CheckCircle2 className="w-3 h-3 text-[#059669]" />}
                          <span>{status}</span>
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-2.5 px-3.5 text-[#6B7280] text-[10px] whitespace-nowrap">
                        {item.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailModalGroup(item)}
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition cursor-pointer"
                            title="View Group Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenUpdateModal(item.bloodGroup)}
                            className="px-2 py-1 text-[11px] font-semibold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] rounded transition cursor-pointer"
                            title="Adjust Units"
                          >
                            Adjust
                          </button>
                          <button
                            onClick={() => onOpenAddModal('stock', item.bloodGroup)}
                            className="px-2 py-1 text-[11px] font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded transition cursor-pointer"
                            title="Add Stock Units"
                          >
                            + Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal for Selected Blood Group */}
      {detailModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BloodGroupBadge bloodGroup={detailModalGroup.bloodGroup} size="lg" />
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    {detailModalGroup.bloodGroup} Detailed Vault Profile
                  </h3>
                  <p className="text-xs text-[#6B7280]">Storage shelf-life, antigens, and dispatch rules</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalGroup(null)}
                className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-[#E5E7EB] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 bg-[#FEE2E2]/60 rounded-md border border-[#FECACA]">
                  <span className="text-[#6B7280] font-semibold text-[11px]">Available Units</span>
                  <p className="text-xl font-extrabold text-[#B91C1C] font-mono mt-0.5">
                    {detailModalGroup.availableUnits}
                  </p>
                </div>
                <div className="p-2.5 bg-[#DBEAFE]/60 rounded-md border border-[#BFDBFE]">
                  <span className="text-[#6B7280] font-semibold text-[11px]">Reserved Units</span>
                  <p className="text-xl font-extrabold text-[#1E40AF] font-mono mt-0.5">
                    {detailModalGroup.reservedUnits}
                  </p>
                </div>
                <div className="p-2.5 bg-[#FEF3C7]/60 rounded-md border border-[#FDE68A]">
                  <span className="text-[#6B7280] font-semibold text-[11px]">Expiring &lt;7d</span>
                  <p className="text-xl font-extrabold text-[#92400E] font-mono mt-0.5">
                    {detailModalGroup.expiringUnits}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F3F4F6] rounded-md border border-[#E5E7EB] space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-[#6B7280]">Average Shelf Life:</span>
                  <span className="font-mono text-[#111827] font-bold">{detailModalGroup.shelfLifeAvgDays} Days (CPDA-1)</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-[#6B7280]">Recommended Storage Temp:</span>
                  <span className="font-mono text-[#111827] font-bold">2°C - 6°C Refrigerator</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-[#6B7280]">Clinical Safety Baseline:</span>
                  <span className="font-mono text-[#111827] font-bold">
                    {settings.minThresholds[detailModalGroup.bloodGroup]} Units Min
                  </span>
                </div>
              </div>

              {/* Compatibility summary */}
              <div>
                <h5 className="font-bold text-[#111827] uppercase tracking-wider text-[10px] mb-1.5">
                  Compatible Recipients
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {BLOOD_COMPATIBILITY[detailModalGroup.bloodGroup].canGiveTo.map((target) => (
                    <span
                      key={target}
                      className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] rounded font-mono font-bold text-xs"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fast Emergency Broadcast button */}
              <button
                onClick={() => {
                  triggerEmergencyBroadcast(detailModalGroup.bloodGroup);
                  setDetailModalGroup(null);
                }}
                className="w-full py-2 px-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded-md transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notify All Eligible {detailModalGroup.bloodGroup} Donors</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
