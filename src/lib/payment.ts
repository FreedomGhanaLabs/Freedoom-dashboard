export interface Driver {
  _id: string;
  amount: number;
  paymentMethod: 'mobile_money' | 'bank_transfer' | string;
  paymentFor: 'monthly_payment' | string;
  monthOf: string; // e.g., '2025-07'
  receiptNumber: string;
  paymentStatus: 'confirmed' | 'pending' | 'failed' | string;
  notes: string;
  balanceAfterPayment: number;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  driverId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    driverId: string;
  };

  recordedBy: {
    _id: string;
    firstName: string;
    email: string;
  };

  latePayment?: {
    // Define if you know the shape of this object
    [key: string]: any;
  };
}
