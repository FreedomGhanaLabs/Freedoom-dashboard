

export interface AccountAPI {
  _id: string;
  platformCommission: number;
  driverEarnings: number;
  paymentStatus: string;
  isMultiStop: boolean;
  paymentMethod: string;
  totalFare: number;
  distanceFare: number;
  operationType: string;
  discount: number;
  user: {
    phone: string;
  };
  pickupLocation: {
    address: string;
  };
  dropoffLocation: {
    address: string;
  };
  estimatedDistance: {
    text: string;
  };
  estimatedDuration: {
    text: string;
  };
}

export interface AccountId {

        _id: string,
        amount: number,
        currency: string,
        paymentMethod: string,
        status: string,
        reference: string,
        createdAt: string,
        updatedAt: string,
        metadata: {
            provider: string,
            providerReference: string
        }
       
    user: {
        _id: string,
        name: string,
        email: string,
        phone: string,
    },
    ride: {
        _id: string,
        pickupLocation: string,
        dropoffLocation: string,
        fare: number,
        distance: number,
        duration: number
    },
    delivery: null | boolean | string,
}