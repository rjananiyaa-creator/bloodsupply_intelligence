import React, { useState } from 'react';
import { BloodGroup } from '../../types';
import { BLOOD_COMPATIBILITY } from '../../data/initialData';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { X, ArrowRight, CheckCircle2, Info } from 'lucide-react';

interface CompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBloodGroup?: BloodGroup;
}

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CompatibilityModal: React.FC<CompatibilityModalProps> = ({
  isOpen,
  onClose,
  initialBloodGroup = 'O-',
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(initialBloodGroup);

  if (!isOpen) return null;

  const compatibility = BLOOD_COMPATIBILITY[selectedGroup];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#FEE2E2] flex items-center justify-center text-[#B91C1C] font-bold text-xs">
              Rh
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Blood Type Compatibility Matrix</h3>
              <p className="text-[11px] text-[#6B7280]">Transfusion and cross-match suitability rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] rounded transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Blood group selector pills */}
          <div>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
              Select Blood Group to Check
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {ALL_BLOOD_GROUPS.map((bg) => {
                const isSelected = selectedGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`py-1.5 px-2 rounded-md border text-center font-bold text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#B91C1C] border-[#B91C1C] text-white shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Group Highlight Card */}
          <div className="p-3.5 rounded-md bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-3">
            <BloodGroupBadge bloodGroup={selectedGroup} size="md" />
            <div>
              <h4 className="text-xs font-bold text-[#991B1B]">
                {selectedGroup === 'O-'
                  ? 'Universal Red Blood Cell Donor'
                  : selectedGroup === 'AB+'
                  ? 'Universal Red Blood Cell Recipient'
                  : `${selectedGroup} Blood Type`}
              </h4>
              <p className="text-[11px] text-[#7F1D1D] mt-0.5">
                {selectedGroup === 'O-'
                  ? 'Can be given to ANY recipient in emergency trauma before crossmatch!'
                  : selectedGroup === 'AB+'
                  ? 'Can safely receive red cells from ALL blood types.'
                  : `Compatible with specific antigens and Rh factor requirements.`}
              </p>
            </div>
          </div>

          {/* Dual Columns: Can Give To & Can Receive From */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* CAN GIVE TO */}
            <div className="p-3 rounded-md border border-[#E5E7EB] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  Can Donate To ({compatibility.canGiveTo.length})
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {compatibility.canGiveTo.map((target) => (
                  <div
                    key={target}
                    className="px-2.5 py-1 bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] rounded text-xs font-bold"
                  >
                    {target}
                  </div>
                ))}
              </div>
            </div>

            {/* CAN RECEIVE FROM */}
            <div className="p-3 rounded-md border border-[#E5E7EB] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E40AF] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  Can Receive From ({compatibility.canReceiveFrom.length})
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] rotate-180" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {compatibility.canReceiveFrom.map((source) => (
                  <div
                    key={source}
                    className="px-2.5 py-1 bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] rounded text-xs font-bold"
                  >
                    {source}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transfusion Guideline Notes */}
          <div className="p-3 bg-[#F9FAFB] rounded-md border border-[#E5E7EB] text-[11px] text-[#6B7280] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#6B7280] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#111827]">Clinical Protocol:</strong> Whole blood and packed red blood cells (PRBC) must be matched for ABO and Rh(D) antigens. In emergency trauma when type is unknown, uncrossmatched O-Negative is utilized.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-md transition cursor-pointer"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
