export interface DriverRegistration {
  _id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  address: string;
  city: string;
  region: string;
  registrationStatus: 'approved' | 'pending' | 'rejected';
  driverId: string;
  registeredAt: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  driverLicense: {
    licenseNumber: string;
    firstName: string;
    lastName: string;
    otherName: string;
    dateOfBirth: string;
    classOfLicense: string;
    nationality: string;
    issueDate: string;
    expiryDate: string;
    uploadedAt: string;
  };
  ghanaCard: {
    personalIdNumber: string;
    firstName: string;
    lastName: string;
    otherName: string;
    sex: 'M' | 'F';
    dateOfBirth: string;
    height: string;
    expiryDate: string;
    uploadedAt: string;
  };
  proofOfAddress: {
    uploadedAt: string;
  };
  guarantor: {
    firstName: string;
    lastName: string;
    otherName: string;
    phone: string;
    email: string;
    relationship: string;
    occupation: string;
    address: string;
    landmark: string;
    ghanaCard: {
      personalIdNumber: string;
      firstName: string;
      lastName: string;
      otherName: string;
      sex: 'M' | 'F';
      dateOfBirth: string;
      height: string;
      expiryDate: string;
      uploadedAt: string;
    };
    proofOfAddress: {
      uploadedAt: string;
    };
  };
  bikeProgram: {
    bikeModel: string;
    bikePrice: number;
    paymentDuration: number;
    monthlyPayment: number;
    startDate: string;
    expectedEndDate: string;
    totalPaid: number;
    remainingBalance: number;
    status: string;
    extensionMonths: number;
  };
  registeredBy: {
    _id: string;
    firstName: string;
    email: string;
  };
  approvedBy?: {
    _id: string;
    firstName: string;
    email: string;
  };
  __v: number;
}