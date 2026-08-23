import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { Hospital } from '../../types';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit2,
  X,
} from 'lucide-react';

interface HospitalsPageProps {
  onOpenAddModal: () => void;
  onOpenCreateRequest: () => void;
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({
  onOpenAddModal,
}) => {
  const { hospitals, requests, updateHospital, showToast, searchQuery, setSearchQuery } = useBloodSupply();

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  const filteredHospitals = hospitals.filter((h) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchCity = h.city.toLowerCase().includes(q);
      const matchLoc = h.location.toLowerCase().includes(q);
      const matchId = h.id.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchLoc && !matchId) return false;
    }

    if (tierFilter !== 'ALL' && h.tier !== tierFilter) {
      return false;
    }

    return true;
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;
    updateHospital(editingHospital.id, editingHospital);
    setEditingHospital(null);
  };

  const handleQuickContact = (h: Hospital) => {
    showToast('Hospital Contact Triggered', `Direct emergency radio/telephone link connected to ${h.name} (${h.contact}).`, 'info');
  };

  // Hospital active requests
  const getHospitalActiveRequests = (hospitalId: string, hospitalName: string) => {
    return requests.filter((r) => (r.hospitalId === hospitalId || r.hospitalName === hospitalName) && r.status !== 'Fulfilled' && r.status !== 'Rejected');
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#B91C1C]" />
            <span>Partner Hospital Network</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Trauma centers, regional medical centers, surgery suites, and emergency blood banks
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-3.5 py-2 text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner Hospital</span>
        </button>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Connected Hospitals</p>
          <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{hospitals.length}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#DC2626] uppercase tracking-wider">Level 1 Trauma Centers</p>
          <h3 className="text-2xl font-bold text-[#DC2626] font-mono mt-0.5">
            {hospitals.filter((h) => h.tier === 'Level 1 Trauma').length}
          </h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wider">Active Demands</p>
          <h3 className="text-2xl font-bold text-[#D97706] font-mono mt-0.5">
            {hospitals.reduce((acc, h) => acc + h.activeRequests, 0)}
          </h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#059669] uppercase tracking-wider">Total Dispatches</p>
          <h3 className="text-2xl font-bold text-[#059669] font-mono mt-0.5">
            {hospitals.reduce((acc, h) => acc + h.totalRequests, 0)}
          </h3>
        </div>
      </div>

      {/* Search & Tier Filter */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital name, city, location, or provider ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] placeholder:text-[#6B7280] outline-hidden transition"
            />
          </div>

          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Hospital Tiers & Classifications</option>
              <option value="Level 1 Trauma">Level 1 Trauma Centers</option>
              <option value="General Hospital">General Hospitals</option>
              <option value="Specialty Center">Specialty & Pediatric Centers</option>
              <option value="Clinic">Day Clinics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredHospitals.map((hospital) => {
          const activeReqs = getHospitalActiveRequests(hospital.id, hospital.name);

          return (
            <div
              key={hospital.id}
              className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#B91C1C]/40 transition flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase">
                      {hospital.id} • {hospital.licenseNumber}
                    </span>
                    <h3 className="text-sm font-bold text-[#111827] tracking-tight leading-snug">
                      {hospital.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      hospital.tier === 'Level 1 Trauma'
                        ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
                        : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                    }`}
                  >
                    {hospital.tier}
                  </span>
                </div>

                {/* Location & Contact details */}
                <div className="space-y-1 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#6B7280] shrink-0" />
                    <span className="truncate">{hospital.location}, {hospital.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#6B7280] shrink-0" />
                    <span className="font-mono text-[#111827]">{hospital.contact}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#6B7280] shrink-0" />
                    <span className="truncate text-[10px] text-[#6B7280]">{hospital.email}</span>
                  </div>
                </div>

                {/* Active Requests Pill */}
                <div className="mt-3 p-2 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <span className="text-[#6B7280] font-medium text-[11px]">Active Blood Demands:</span>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                      activeReqs.length > 0 ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#E5E7EB] text-[#6B7280]'
                    }`}
                  >
                    {activeReqs.length} Active
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleQuickContact(hospital)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#111827] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded transition flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-[#6B7280]" />
                  <span>Call Desk</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingHospital(hospital)}
                    className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition cursor-pointer"
                    title="Edit Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedHospital(hospital)}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#111827] hover:bg-black text-white rounded transition cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Hospital Details Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between sticky top-0 bg-white/95 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#7F1D1D] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">{selectedHospital.name}</h3>
                  <p className="text-xs text-[#6B7280]">{selectedHospital.tier} • {selectedHospital.city}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHospital(null)}
                className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-[#E5E7EB] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">License / ID</span>
                  <p className="text-[#111827] font-mono font-bold mt-0.5">{selectedHospital.licenseNumber}</p>
                </div>
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">Classification</span>
                  <p className="text-[#111827] font-bold mt-0.5">{selectedHospital.tier}</p>
                </div>
              </div>

              {/* Active Requisitions under this Hospital */}
              <div>
                <h4 className="font-bold text-[#111827] uppercase tracking-wider text-[11px] mb-2">
                  Active Requisitions for this Facility
                </h4>
                {getHospitalActiveRequests(selectedHospital.id, selectedHospital.name).length === 0 ? (
                  <div className="p-3 rounded-md bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] text-center font-medium">
                    No open pending requests for this hospital. All dispatches up to date.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {getHospitalActiveRequests(selectedHospital.id, selectedHospital.name).map((req) => (
                      <div
                        key={req.id}
                        className="p-2.5 rounded-md border border-[#E5E7EB] bg-[#F3F4F6] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[#111827]">
                            {req.id} — {req.unitsRequired} Units of {req.bloodGroup}
                          </div>
                          <div className="text-[10px] text-[#6B7280]">
                            Priority: {req.priority} • Required: {req.requiredDate}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] font-bold rounded text-[10px]">
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    handleQuickContact(selectedHospital);
                    setSelectedHospital(null);
                  }}
                  className="flex-1 py-2 bg-[#111827] hover:bg-black text-white font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Emergency Desk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hospital Modal */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827]">Edit Hospital Profile</h3>
              <button
                onClick={() => setEditingHospital(null)}
                className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-[#E5E7EB] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={editingHospital.name}
                  onChange={(e) => setEditingHospital({ ...editingHospital, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Classification Tier</label>
                  <select
                    value={editingHospital.tier}
                    onChange={(e) => setEditingHospital({ ...editingHospital, tier: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] outline-hidden"
                  >
                    <option value="Level 1 Trauma">Level 1 Trauma</option>
                    <option value="General Hospital">General Hospital</option>
                    <option value="Specialty Center">Specialty Center</option>
                    <option value="Clinic">Clinic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">City</label>
                  <input
                    type="text"
                    value={editingHospital.city}
                    onChange={(e) => setEditingHospital({ ...editingHospital, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={editingHospital.contact}
                    onChange={(e) => setEditingHospital({ ...editingHospital, contact: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Official Email</label>
                  <input
                    type="email"
                    value={editingHospital.email}
                    onChange={(e) => setEditingHospital({ ...editingHospital, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">Address / Street</label>
                <input
                  type="text"
                  value={editingHospital.location}
                  onChange={(e) => setEditingHospital({ ...editingHospital, location: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setEditingHospital(null)}
                  className="px-3 py-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-md font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#111827] text-white font-bold rounded-md hover:bg-black text-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
