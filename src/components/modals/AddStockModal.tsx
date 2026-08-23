import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup } from '../../types';
import { Droplet, X, PlusCircle } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBloodGroup?: BloodGroup;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  defaultBloodGroup = 'A+',
}) => {
  const { addStock } = useBloodSupply();
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(defaultBloodGroup);
  const [units, setUnits] = useState<number>(5);
  const [source, setSource] = useState<string>('Voluntary Blood Donation Drive');
  const [batchNumber, setBatchNumber] = useState<string>(`BCH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [facility, setFacility] = useState<string>('Main Center Blood Intake Lab');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (units <= 0) return;
    addStock(bloodGroup, units, `${facility} (Batch: ${batchNumber})`, source);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-[#E5E7EB]">
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#B91C1C] text-white flex items-center justify-center shadow-xs">
              <Droplet className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Add Blood Stock to Vault</h3>
              <p className="text-[11px] text-[#6B7280]">Record incoming verified blood units</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-[#E5E7EB] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Blood Group Selection */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1.5">
              Blood Group *
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`py-1.5 px-2 rounded-md border text-center font-bold text-xs transition cursor-pointer ${
                    bloodGroup === bg
                      ? 'bg-[#B91C1C] border-[#B91C1C] text-white shadow-xs'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Units */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Number of Units (Bags / 450ml) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={units}
                onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-semibold text-xs outline-hidden"
                required
              />
              <div className="flex gap-1">
                {[1, 5, 10, 20].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setUnits(quick)}
                    className="px-2 py-1 text-[11px] font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded text-[#111827] transition cursor-pointer"
                  >
                    +{quick}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Collection Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-xs text-[#111827] outline-hidden"
            >
              <option value="Voluntary Blood Donation Drive">Voluntary Blood Donation Drive</option>
              <option value="Mobile Blood Bus Camp">Mobile Blood Bus Camp</option>
              <option value="Replacement Donor Intake">Replacement Donor Intake</option>
              <option value="External Regional Blood Bank Transfer">External Regional Blood Bank Transfer</option>
              <option value="Apheresis Platelet / Red Cell Inflow">Apheresis Component Extraction</option>
            </select>
          </div>

          {/* Batch & Lab Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Batch Barcode / ID
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs font-mono outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Storage Vault
              </label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs outline-hidden"
                required
              />
            </div>
          </div>

          {/* Safety disclaimer */}
          <div className="p-2.5 bg-[#D1FAE5] rounded-md border border-[#A7F3D0] text-[11px] text-[#065F46] flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-[#059669] shrink-0" />
            <span>Pre-screened for viral pathogens. Crossmatched & verified.</span>
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
              className="px-3.5 py-1.5 text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md shadow-xs transition cursor-pointer"
            >
              Confirm & Deposit Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
