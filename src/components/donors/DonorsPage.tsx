import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { Donor, BloodGroup, DonorStatus } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Heart,
  Send,
  X,
} from 'lucide-react';

interface DonorsPageProps {
  onOpenAddModal: () => void;
}

export const DonorsPage: React.FC<DonorsPageProps> = ({ onOpenAddModal }) => {
  const {
    donors,
    updateDonor,
    deleteDonor,
    showToast,
    searchQuery,
    setSearchQuery,
  } = useBloodSupply();

  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filters
  const filteredDonors = donors.filter((donor) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = donor.name.toLowerCase().includes(q);
      const matchId = donor.id.toLowerCase().includes(q);
      const matchContact = donor.contact.toLowerCase().includes(q);
      const matchEmail = donor.email.toLowerCase().includes(q);
      const matchGroup = donor.bloodGroup.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchContact && !matchEmail && !matchGroup) {
        return false;
      }
    }

    if (selectedGroupFilter !== 'ALL' && donor.bloodGroup !== selectedGroupFilter) {
      return false;
    }

    if (selectedStatusFilter !== 'ALL' && donor.status !== selectedStatusFilter) {
      return false;
    }

    return true;
  });

  // Calculate stats
  const totalDonors = donors.length;
  const eligibleCount = donors.filter((d) => d.status === 'Eligible').length;
  const universalCount = donors.filter((d) => d.bloodGroup === 'O-').length;
  const deferredCount = donors.filter((d) => d.status === 'Deferred').length;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;
    updateDonor(editingDonor.id, editingDonor);
    setEditingDonor(null);
  };

  const handleSendReminder = (donor: Donor) => {
    showToast(
      'Donation Appointment Ping Sent',
      `Sent SMS invitation & app reminder to ${donor.name} (${donor.contact}).`,
      'success'
    );
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#B91C1C]" />
            <span>Donor Management Registry</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Registered volunteer donors, contact roster, and appointment eligibility tracking
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-3.5 py-2 text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Donor</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Total Donors</p>
          <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{totalDonors}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#059669] uppercase tracking-wider">Eligible Today</p>
          <h3 className="text-2xl font-bold text-[#059669] font-mono mt-0.5">{eligibleCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#B91C1C] uppercase tracking-wider">O- Universal Donors</p>
          <h3 className="text-2xl font-bold text-[#B91C1C] font-mono mt-0.5">{universalCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wider">Deferred (Cool-off)</p>
          <h3 className="text-2xl font-bold text-[#D97706] font-mono mt-0.5">{deferredCount}</h3>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donor name, phone, email or ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] placeholder:text-[#6B7280] outline-hidden transition"
            />
          </div>

          {/* Blood Group Filter */}
          <div className="sm:col-span-4 flex items-center gap-2">
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

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Eligibility Statuses</option>
              <option value="Eligible">Eligible Donors Only</option>
              <option value="Deferred">Deferred (Interval Cooldown)</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3.5">Donor ID</th>
                <th className="py-2.5 px-3.5">Name</th>
                <th className="py-2.5 px-3.5">Blood Group</th>
                <th className="py-2.5 px-3.5">Age / Gender</th>
                <th className="py-2.5 px-3.5">Contact Info</th>
                <th className="py-2.5 px-3.5">Last Donation</th>
                <th className="py-2.5 px-3.5">Total Donations</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6B7280] text-xs">
                    No donors found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-[#F3F4F6]/60 transition">
                    <td className="py-2.5 px-3.5 font-mono text-[11px] font-semibold text-[#6B7280]">
                      {donor.id}
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="font-bold text-[#111827]">{donor.name}</div>
                      <div className="text-[10px] text-[#6B7280]">{donor.city}</div>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
                    </td>

                    <td className="py-2.5 px-3.5 text-[#111827] text-xs">
                      {donor.age} yrs • {donor.gender}
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="font-mono text-xs text-[#111827]">{donor.contact}</div>
                      <div className="text-[10px] text-[#6B7280] truncate max-w-[150px]">
                        {donor.email}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-[#6B7280] whitespace-nowrap text-xs">
                      {donor.lastDonationDate || 'First Time'}
                    </td>

                    <td className="py-2.5 px-3.5 font-mono font-bold text-[#111827]">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#B91C1C] fill-[#B91C1C]" />
                        {donor.donationCount}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          donor.status === 'Eligible'
                            ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]'
                            : donor.status === 'Deferred'
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                        }`}
                      >
                        {donor.status === 'Eligible' && <CheckCircle2 className="w-3 h-3 text-[#059669]" />}
                        {donor.status === 'Deferred' && <Clock className="w-3 h-3 text-[#D97706]" />}
                        <span>{donor.status}</span>
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleSendReminder(donor)}
                          className="p-1.5 text-[#2563EB] hover:bg-[#EFF6FF] rounded transition cursor-pointer"
                          title="Send Donation Reminder"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedDonor(donor)}
                          className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition cursor-pointer"
                          title="View Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingDonor(donor)}
                          className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition cursor-pointer"
                          title="Edit Donor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(donor.id)}
                          className="p-1.5 text-[#DC2626] hover:text-[#991B1B] hover:bg-[#FEE2E2] rounded transition cursor-pointer"
                          title="Delete Donor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Donor Profile Detail Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BloodGroupBadge bloodGroup={selectedDonor.bloodGroup} size="lg" />
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">{selectedDonor.name}</h3>
                  <p className="text-xs text-[#6B7280] font-mono">ID: {selectedDonor.id} • {selectedDonor.city}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDonor(null)}
                className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-[#E5E7EB] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">Contact</span>
                  <p className="text-[#111827] font-semibold mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#6B7280]" />
                    {selectedDonor.contact}
                  </p>
                </div>
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">Email</span>
                  <p className="text-[#111827] font-semibold mt-0.5 truncate flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#6B7280]" />
                    {selectedDonor.email}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                <span className="text-[#6B7280] font-bold uppercase text-[10px]">Residential Address</span>
                <p className="text-[#111827] font-medium mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#6B7280]" />
                  {selectedDonor.address}, {selectedDonor.city}
                </p>
              </div>

              <div className="p-3 bg-[#FEE2E2]/50 rounded-md border border-[#FECACA] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total Lifetime Donations:</span>
                  <strong className="text-[#B91C1C] font-mono text-xs">{selectedDonor.donationCount} Units</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Last Donation Date:</span>
                  <strong className="text-[#111827]">{selectedDonor.lastDonationDate || 'N/A'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Screening Status:</span>
                  <strong className="text-[#059669]">{selectedDonor.status}</strong>
                </div>
              </div>

              {selectedDonor.healthNotes && (
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">Medical Notes & Clearance</span>
                  <p className="text-[#111827] mt-1 leading-relaxed">{selectedDonor.healthNotes}</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    handleSendReminder(selectedDonor);
                    setSelectedDonor(null);
                  }}
                  className="flex-1 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Immediate Callout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Donor Modal */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between sticky top-0 bg-white/95 z-10">
              <h3 className="text-sm font-bold text-[#111827]">Edit Donor Record ({editingDonor.id})</h3>
              <button
                onClick={() => setEditingDonor(null)}
                className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-[#E5E7EB] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Donor Name</label>
                <input
                  type="text"
                  value={editingDonor.name}
                  onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Blood Group</label>
                  <select
                    value={editingDonor.bloodGroup}
                    onChange={(e) => setEditingDonor({ ...editingDonor, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] font-bold text-[#B91C1C] outline-hidden"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Status</label>
                  <select
                    value={editingDonor.status}
                    onChange={(e) => setEditingDonor({ ...editingDonor, status: e.target.value as DonorStatus })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] outline-hidden"
                  >
                    <option value="Eligible">Eligible</option>
                    <option value="Deferred">Deferred</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingDonor.contact}
                    onChange={(e) => setEditingDonor({ ...editingDonor, contact: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Email</label>
                  <input
                    type="email"
                    value={editingDonor.email}
                    onChange={(e) => setEditingDonor({ ...editingDonor, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Address</label>
                  <input
                    type="text"
                    value={editingDonor.address}
                    onChange={(e) => setEditingDonor({ ...editingDonor, address: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">City</label>
                  <input
                    type="text"
                    value={editingDonor.city}
                    onChange={(e) => setEditingDonor({ ...editingDonor, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Health Notes</label>
                <textarea
                  value={editingDonor.healthNotes || ''}
                  onChange={(e) => setEditingDonor({ ...editingDonor, healthNotes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="px-3 py-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-md font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#B91C1C] text-white font-bold rounded-md hover:bg-[#991B1B] text-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 space-y-3 text-center border border-[#E5E7EB]">
            <div className="w-10 h-10 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#111827]">Remove Donor Record?</h3>
            <p className="text-xs text-[#6B7280]">
              Are you sure you want to remove donor #{confirmDeleteId}? This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-1.5 text-xs font-semibold bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteDonor(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-1.5 text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] rounded-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
