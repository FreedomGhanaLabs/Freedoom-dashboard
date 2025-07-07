 
 export interface Transaction {
			transaction: any;

            _id: string,
            amount: number,
            currency: string,
            paymentMethod: string,
            status: string
            reference: string,
            createdAt: string,
            updatedAt: string,
            metadata: {},
            user: {
                _id: string,
                name: string,
                email: string,
                phone: string
            },
            ride: {
                _id: string,
                pickupLocation: 
                    {address: string,}
                dropoffLocation:
                    {address: string,}
                fare: number,
                distance: number,
                duration: number
            },
            delivery: null | boolean | string,
        }
