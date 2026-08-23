import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup, RequestPriority } from '../../types';
import { GitPullRequest, X, AlertTriangle, Flame, Clock } from 'lucide-react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBloodGroup?: BloodGroup;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  defaultBloodGroup = 'O-',
}) => {
  const { hospitals, inventory, createRequest } = useBloodSupply();

  const [hospitalId, setHospitalId] = useState(hospitals[0]?.id || 'HOSP-01');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(defaultBloodGroup);
  const [unitsRequired, setUnitsRequired] = useState<number>(4);
  const [priority, setPriority] = useState<RequestPriority>('Urgent');
  const [requiredDate, setRequiredDate] = useState('Today, 02:00 PM');
  const [patientId, setPatientId] = useState(`PT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [patientCondition, setPatientCondition] = useState('Emergency Surgical Crossmatch');
  const [notes, setNotes] = useState('High priority cold-courier delivery requested.');

  if (!isOpen) return null;

  const selectedHospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];
  const currentStock = inventory.find((i) => i.bloodGroup === bloodGroup)?.availableUnits || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unitsRequired <= 0) return;

    createRequest({
      hospitalName: selectedHospital?.name || 'Partner Hospital',
      hospitalId: selectedHospital?.id || 'HOSP-01',
      bloodGroup,
      unitsRequired,
      priority,
      requiredDate,
      patientId,
      patientCondition,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
        {/* Header with Priority color indicator */}
        <div
          className={`flex items-center justify-between p-4 border-b sticky top-0 bg-white/95 backdrop-blur-xs z-10 ${
            priority === 'Critical'
              ? 'border-[#FECACA] bg-[#FEE2E2]'
              : priority === 'Urgent'
              ? 'border-[#FDE68A] bg-[#FEF3C7]'
              : 'border-[#E5E7EB] bg-[#F9FAFB]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center text-white shadow-xs ${
                priority === 'Critical'
                  ? 'bg-[#DC2626] animate-pulse-subtle'
                  : priority === 'Urgent'
                  ? 'bg-[#D97706]'
                  : 'bg-[#111827]'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Create Hospital Blood Request</h3>
              <p className="text-[11px] text-[#6B7280]">Initiate requisition order and inventory check</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-black/5 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          {/* Priority Selector */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1.5">
              Requisition Priority Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Normal', label: 'Normal', icon: Clock, desc: 'Elective / Routine' },
                { id: 'Urgent', label: 'Urgent', icon: AlertTriangle, desc: '< 6 Hours' },
                { id: 'Critical', label: 'Critical', icon: Flame, desc: 'Immediate Code Red' },
              ].map((lvl) => {
                const isSelected = priority === lvl.id;
                const Icon = lvl.icon;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setPriority(lvl.id as RequestPriority)}
                    className={`p-2 rounded-md border text-left transition cursor-pointer ${
                      isSelected
                        ? lvl.id === 'Critical'
                          ? 'bg-[#DC2626] text-white border-[#DC2626]'
                          : lvl.id === 'Urgent'
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-[#111827] text-white border-[#111827]'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{lvl.label}</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#6B7280]'}`}>
                      {lvl.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hospital Selection */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Requesting Hospital *
            </label>
            <select
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] font-medium text-[#111827] outline-hidden"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.tier} ({h.location}, {h.city})
                </option>
              ))}
            </select>
          </div>

          {/* Blood Group & Required Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Blood Group Required *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] font-bold text-[#B91C1C] outline-hidden"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} {bg === 'O-' ? '(Universal Donor)' : ''}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-[10px] text-[#6B7280] flex items-center justify-between">
                <span>Vault stock available:</span>
                <span className={`font-mono font-bold ${currentStock < unitsRequired ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                  {currentStock} units
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Units Required (Bags) *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-semibold outline-hidden"
                required
              />
            </div>
          </div>

          {/* Required Date / Time & Patient ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Required By (Date / Time) *
              </label>
              <input
                type="text"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                placeholder="e.g. Today, 04:00 PM"
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Patient Medical Record #
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-mono outline-hidden"
              />
            </div>
          </div>

          {/* Patient Clinical Indication */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Clinical Indication / Diagnosis
            </label>
            <input
              type="text"
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
              placeholder="e.g. Severe Trauma Hemorrhage, Post-Partum Care, Cardiac Surgery"
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Special Handling Notes & Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:bg-[#F3F4F6] rounded-md transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3.5 py-1.5 text-xs font-bold text-white rounded-md shadow-xs transition cursor-pointer ${
                priority === 'Critical'
                  ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                  : 'bg-[#B91C1C] hover:bg-[#991B1B]'
              }`}
            >
              Submit Blood Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
