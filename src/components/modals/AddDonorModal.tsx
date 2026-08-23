import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup, DonorStatus } from '../../types';
import { HeartHandshake, X } from 'lucide-react';

interface AddDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AddDonorModal: React.FC<AddDonorModalProps> = ({ isOpen, onClose }) => {
  const { addDonor } = useBloodSupply();

  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [lastDonationDate, setLastDonationDate] = useState('2026-08-23');
  const [status, setStatus] = useState<DonorStatus>('Eligible');
  const [healthNotes, setHealthNotes] = useState('Healthy volunteer, passed vitals pre-screening (Hb 14.5 g/dL, BP 120/80).');
  const [hasConsented, setHasConsented] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    addDonor({
      name,
      bloodGroup,
      age,
      gender,
      contact,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: address || '123 Health Ave',
      city,
      lastDonationDate,
      status,
      healthNotes,
      isUniversalDonor: bloodGroup === 'O-',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#B91C1C] text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Register New Blood Donor</h3>
              <p className="text-[11px] text-[#6B7280]">Enroll voluntary donor into intelligent registry</p>
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
          {/* Full Name & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Henderson"
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden transition"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Blood Group *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] font-bold text-[#B91C1C] outline-hidden"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} {bg === 'O-' ? '(Universal)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Age, Gender, Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Age (Yrs) *
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] outline-hidden"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                required
              />
            </div>
          </div>

          {/* Email & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.h@email.com"
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                City / Region *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 452 Medical Center Way, Apt 3"
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
            />
          </div>

          {/* Last Donation Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Last Donation Date
              </label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                Eligibility Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DonorStatus)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] outline-hidden"
              >
                <option value="Eligible">Eligible (Ready for donation)</option>
                <option value="Deferred">Deferred (Temporary cool-off/travel)</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Medical & Screening Notes */}
          <div>
            <label className="block font-bold text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Health & Screening Notes
            </label>
            <textarea
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] outline-hidden resize-none"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="donorConsent"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
              className="mt-0.5 rounded text-[#B91C1C] accent-[#B91C1C]"
              required
            />
            <label htmlFor="donorConsent" className="text-[11px] text-[#6B7280]">
              Donor consents to emergency automated SMS/email alerts when blood group shortages occur.
            </label>
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
              disabled={!hasConsented}
              className="px-3.5 py-1.5 text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              Enroll & Save Donor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
