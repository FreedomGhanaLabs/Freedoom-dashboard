export interface InvoiceRide {
	_id: string;
	title: string;
	className: string;
	key: string;
	user: {
		phone: string;
	};
	estimatedDistance: {
		text: string;
	};
	estimatedDuration: {
		text: string;
	};
	pickupLocation: {
		address: string;
	};
	isMultiStop: boolean;
	stopLocations: {
		address: string;
	}[];
	timeFare: Number;
	distanceFare: Number;
	platformCommission: Number;
	driverEarnings: Number;
	totalFare: Number;
	paymentMethod: string;
}

export interface Driver {
	_id: string;
	id?: string;
	firstName: string;
	surname: string;
	otherName: string;
	email: string;
	phone: string;
	role?: 'driver';
	motorcycleType: string;
	motorcycleColor?: string;
	motorcycleNumber: string;
	motorcycleYear?: string;
	licenseNumber?: string;
	status: 'onRide' | 'available' | 'unavailable' | string;
	ratings?: number;
	numOfReviews?: number;
	suspended: boolean;
	documentStatus: 'approved' | 'pending' | 'rejected' | string;
	ridePreference: 'both' | 'ride' | 'delivery' | string;
	rideHistory?: any[];
	deliveryHistory?: any[];
	twoFactorEnabled?: boolean;
	isVerified?: boolean;
	lastActiveAt?: string;
	createdAt?: string;
	__v?: number;
	profilePicture?: string;
	documentId?: string;
	address?: {
		street: string;
		city: string;
		state: string;
		country: string;
		postalCode: string;
	};
	location?: {
		type: 'Point';
		coordinates: number[];
	};
	pendingNameUpdate?: {
		firstName?: string;
		surname?: string;
		otherName?: string;
		requestedAt: string;
		status: 'pending' | 'approved' | 'rejected';
	};
	insurance?: {
		isVerified: boolean;
	};
	notificationPreferences?: any;
	notificationStats?: any;
	lastNotificationSent?: string | null;
	onlineHistory?: any[];
	vehicleHistory?: any[];
	knownDevices?: any[];
}
