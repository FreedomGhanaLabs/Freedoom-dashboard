// src/lib/types/application.ts

export interface Application {
  _id: string;
  applicationId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // In case fullName is used instead of firstName/lastName
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | string;
  address: string;
  city: string;
  region: string;
  workingModel: 'in-house' | 'external' | string;
  preferredWorkingHours: 'full-time' | 'part-time' | 'flexible' | string;
  hasMotorbike: boolean;

  motorbikeDetails?: {
    make: string;
    model: string;
    year: number;
    registrationNumber?: string;
    condition?: string;
  };

  interestedInOwnershipProgram: boolean;
  licenseNumber: string;
  licenseExpiryDate: string;
  yearsOfRidingExperience: number;
  hasCommercialExperience: boolean;

  emergencyContact: {
    firstName?: string;
    lastName?: string;
    name?: string; // Fallback for full name format
    phone: string;
    relationship: string;
  };

  status: 'pending' | 'approved' | 'rejected' | string;
  submittedAt: string;
  lastUpdated: string;
  __v: number;
}
