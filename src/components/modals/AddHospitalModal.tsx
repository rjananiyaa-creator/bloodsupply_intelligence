import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { Building2, X } from 'lucide-react';

interface AddHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHospitalModal: React.FC<AddHospitalModalProps> = ({ isOpen, onClose }) => {
  const { addHospital } = useBloodSupply();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Metro City');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<'Level 1 Trauma' | 'General Hospital' | 'Specialty Center' | 'Clinic'>('General Hospital');
  const [licenseNumber, setLicenseNumber] = useState(`MD-HSP-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    addHospital({
      name,
      location: location || '100 Medical Center Way',
      city,
      contact,
      email: email || `blooddesk@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,
      tier,
      licenseNumber,
      status: 'Active',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-[#E5E7EB]">
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#7F1D1D] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Add Partner Hospital</h3>
              <p className="text-[11px] text-[#6B7280]">Connect a new healthcare facility</p>
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
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Hospital / Health Center Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. St. Luke Emergency & Trauma Center"
              className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs font-semibold outline-hidden transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Classification / Tier *
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-xs text-[#111827] outline-hidden"
              >
                <option value="Level 1 Trauma">Level 1 Trauma Center</option>
                <option value="General Hospital">General Hospital</option>
                <option value="Specialty Center">Specialty & Pediatric Center</option>
                <option value="Clinic">Emergency Day Clinic</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                License / Provider #
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs font-mono outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Blood Desk Hotline *
              </label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bloodsupply@hospital.org"
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Address / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 500 Medical Boulevard"
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] text-xs outline-hidden"
                required
              />
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
              Add Hospital Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
