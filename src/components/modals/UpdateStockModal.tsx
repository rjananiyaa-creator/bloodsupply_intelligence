import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup } from '../../types';
import { Sliders, X } from 'lucide-react';

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBloodGroup?: BloodGroup;
}

export const UpdateStockModal: React.FC<UpdateStockModalProps> = ({
  isOpen,
  onClose,
  initialBloodGroup = 'A+',
}) => {
  const { inventory, updateStock } = useBloodSupply();
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(initialBloodGroup);
  const [actionType, setActionType] = useState<'add' | 'subtract' | 'set'>('add');
  const [units, setUnits] = useState<number>(2);
  const [reason, setReason] = useState<string>('Routine Audit Re-count');

  if (!isOpen) return null;

  const currentStock = inventory.find((i) => i.bloodGroup === bloodGroup);
  const currentUnits = currentStock?.availableUnits || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (units < 0) return;
    updateStock(bloodGroup, units, actionType, reason);
    onClose();
  };

  const getResultingUnits = () => {
    if (actionType === 'add') return currentUnits + units;
    if (actionType === 'subtract') return Math.max(0, currentUnits - units);
    return units;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-[#E5E7EB]">
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#111827] text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Adjust / Reconcile Inventory</h3>
              <p className="text-[11px] text-[#6B7280]">Record stock corrections or audit findings</p>
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
          {/* Blood Group Select */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Select Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] font-semibold text-[#111827] outline-hidden"
            >
              {inventory.map((item) => (
                <option key={item.bloodGroup} value={item.bloodGroup}>
                  {item.bloodGroup} (Current: {item.availableUnits} units available)
                </option>
              ))}
            </select>
          </div>

          {/* Action Type */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Adjustment Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'add', label: '+ Add Stock' },
                { id: 'subtract', label: '- Deduct Units' },
                { id: 'set', label: '= Set Exact' },
              ].map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setActionType(type.id as any)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-md border transition cursor-pointer ${
                    actionType === type.id
                      ? 'bg-[#111827] text-white border-[#111827]'
                      : 'bg-[#F9FAFB] text-[#111827] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Units Input */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              {actionType === 'set' ? 'New Total Available Units' : 'Units to Adjust'}
            </label>
            <input
              type="number"
              min={actionType === 'set' ? '0' : '1'}
              max="200"
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-semibold outline-hidden"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Audit / Adjustment Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] outline-hidden"
            >
              <option value="Routine Audit Re-count">Routine Audit Re-count</option>
              <option value="Discarded due to Expiry / Hemolysis">Discarded due to Expiry / Hemolysis</option>
              <option value="Component Separation Extraction">Component Separation Extraction</option>
              <option value="Internal Quality Control Sampling">Internal Quality Control Sampling</option>
              <option value="Emergency Hospital Exchange Transfer">Emergency Hospital Exchange Transfer</option>
              <option value="Barcode Scan Error Correction">Barcode Scan Error Correction</option>
            </select>
          </div>

          {/* Stock Outcome Projection */}
          <div className="p-3 bg-[#F9FAFB] rounded-md border border-[#E5E7EB] text-xs flex items-center justify-between">
            <span className="text-[#6B7280]">Stock after adjustment:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#6B7280] line-through font-mono">{currentUnits}</span>
              <span className="text-[#6B7280]">→</span>
              <span className="font-bold text-xs text-[#111827] font-mono">
                {getResultingUnits()} units
              </span>
            </div>
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
              className="px-3.5 py-1.5 text-xs font-bold bg-[#111827] hover:bg-black text-white rounded-md shadow-xs transition cursor-pointer"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
