export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type RequestStatus = 'active' | 'fulfilled' | 'expired';
export type UserRole = 'donor' | 'admin';

export interface Donation {
  id: string;
  userId: string;
  date: string;
  location: string;
  notes?: string;
  status: 'pending' | 'verified';
  verifiedBy?: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  bloodGroup: BloodGroup;
  city?: string;
  lastDonationDate?: string;
  totalDonations?: number;
  role?: UserRole;
}

export interface UrgentRequest {
  id: string;
  patientName?: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  urgencyLevel: UrgencyLevel;
  contactPhone: string;
  location?: { lat: number; lng: number };
  createdAt: any; // Firestore Timestamp
  createdBy: string;
  status: RequestStatus;
}

export interface DonationCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  openingHours?: string;
  location?: { lat: number; lng: number };
}
