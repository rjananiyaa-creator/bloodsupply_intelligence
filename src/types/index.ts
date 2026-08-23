export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type StockStatus = 'Good' | 'Low' | 'Critical';

export type RequestStatus = 'Pending' | 'Approved' | 'Fulfilled' | 'Rejected';

export type RequestPriority = 'Normal' | 'Urgent' | 'Critical';

export type DonorStatus = 'Eligible' | 'Deferred' | 'Inactive';

export type AlertType = 'CRITICAL_STOCK' | 'LOW_STOCK' | 'EXPIRING_UNITS' | 'URGENT_REQUEST' | 'DONOR_APPOINTMENT';

export type AlertPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export type ActivityStatus = 'Completed' | 'Pending' | 'Warning' | 'Approved' | 'Issued' | 'Rejected';

export interface BloodStock {
  bloodGroup: BloodGroup;
  availableUnits: number;
  reservedUnits: number;
  expiringUnits: number; // expiring in next 7 days
  minimumRequired: number;
  optimalLevel: number;
  lastUpdated: string;
  shelfLifeAvgDays: number;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  email: string;
  address: string;
  city: string;
  lastDonationDate: string;
  donationCount: number;
  status: DonorStatus;
  healthNotes?: string;
  isUniversalDonor?: boolean;
}

export interface BloodRequest {
  id: string;
  hospitalName: string;
  hospitalId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  unitsAllocated?: number;
  priority: RequestPriority;
  requestDate: string;
  requiredDate: string;
  status: RequestStatus;
  patientId?: string;
  patientCondition?: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  city: string;
  contact: string;
  email: string;
  activeRequests: number;
  totalRequests: number;
  status: 'Active' | 'Verified' | 'Pending Review';
  tier: 'Level 1 Trauma' | 'General Hospital' | 'Specialty Center' | 'Clinic';
  licenseNumber: string;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  bloodGroup?: BloodGroup;
  priority: AlertPriority;
  date: string;
  status: AlertStatus;
  relatedId?: string;
}

export interface RecentActivity {
  id: string;
  date: string;
  timestamp: string;
  activity: string;
  bloodGroup: BloodGroup;
  units: number;
  status: ActivityStatus;
  facility?: string;
  actor: string;
}

export interface AppSettings {
  bloodBankName: string;
  facilityCode: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  expiryWarningDays: number;
  minThresholds: Record<BloodGroup, number>;
  optimalThresholds: Record<BloodGroup, number>;
  notificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
  autoEmergencyDonorAlert: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Medical Director' | 'Hospital Liaison' | 'Lab Technician';
  avatar?: string;
}
