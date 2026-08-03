export type Role = 'admin' | 'staff';

export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'| 'PH';

export interface CategoryFee {
  category: CasteCategory;
  governmentFee: number;
  convenienceFee: number;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  eligibility: string;
  documentsRequired: string;
  fees: CategoryFee[];
  createdAt: string;
}

export interface Application {
  _id: string;
  applicantName: string;
  address: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  casteCategory: CasteCategory;
  governmentFee: number;
  convenienceFee: number;
  totalFee: number;
  notes: string;
  status: string;
  statusNote?: string;
  paymentVerified: boolean;
  paidAmount: number;
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  experience: string;
  acceptedTerms: boolean;
  feePaid: boolean;
  status: string;
  paymentVerified: boolean;
  paidAmount: number;
  createdAt: string;
}

export interface Staff {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Stats {
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  paymentVerifiedApps: number;
  totalTeamApplications: number;
  pendingTeamApplications: number;
  applicationRevenue: number;
  teamRevenue: number;
  totalRevenue: number;
}

export interface AuthUser {
  role: Role;
  name: string;
  email: string;
  _id: string;
}

export const CASTE_CATEGORIES: CasteCategory[] = ['General', 'OBC', 'SC', 'ST', 'EWS','PH'];
