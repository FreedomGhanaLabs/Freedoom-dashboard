/**
 * 
 * Array of color codes used for chart visualization
 * @constant
 * @type {string[]}
 */




export const keyColors: string[] = [
	'#3b82f6', // info
	'#22c55e', // success
	'#f59e0b', // warning
	'#ef4444' // danger
];

/**
 * Represents a single data point in the chart
 * @interface
 * @property {Date} date - The date of the data point
 * @property {number} value - The numerical value associated with the date
 */
export interface ChartDataPoint {
	date: Date;
	value: number;
}

/**
 * Sample data for pie chart visualization
 * @type {ChartDataPoint[]}
 */
export let values: ChartDataPoint[] = [
	{
		date: new Date('2025-02-10T23:00:00.000Z'),
		value: 93
	},
	{
		date: new Date('2025-02-11T23:00:00.000Z'),
		value: 73
	},
	{
		date: new Date('2025-02-12T23:00:00.000Z'),
		value: 51
	},
	{
		date: new Date('2025-02-13T23:00:00.000Z'),
		value: 90
	}
];

/**
 * Time series data for area chart visualization
 * @type {ChartDataPoint[]}
 */
export let dateSeriesData: ChartDataPoint[] = [
	{
		date: new Date('2025-01-18T23:00:00.000Z'),
		value: 100
	},
	{
		date: new Date('2025-01-19T23:00:00.000Z'),
		value: 87
	},
	{
		date: new Date('2025-01-20T23:00:00.000Z'),
		value: 76
	},
	{
		date: new Date('2025-01-21T23:00:00.000Z'),
		value: 78
	},
	{
		date: new Date('2025-01-22T23:00:00.000Z'),
		value: 54
	},
	{
		date: new Date('2025-01-23T23:00:00.000Z'),
		value: 90
	},
	{
		date: new Date('2025-01-24T23:00:00.000Z'),
		value: 82
	},
	{
		date: new Date('2025-01-25T23:00:00.000Z'),
		value: 56
	},
	{
		date: new Date('2025-01-26T23:00:00.000Z'),
		value: 88
	},
	{
		date: new Date('2025-01-27T23:00:00.000Z'),
		value: 52
	},
	{
		date: new Date('2025-01-28T23:00:00.000Z'),
		value: 56
	},
	{
		date: new Date('2025-01-29T23:00:00.000Z'),
		value: 57
	},
	{
		date: new Date('2025-01-30T23:00:00.000Z'),
		value: 78
	},
	{
		date: new Date('2025-01-31T23:00:00.000Z'),
		value: 78
	},
	{
		date: new Date('2025-02-01T23:00:00.000Z'),
		value: 69
	},
	{
		date: new Date('2025-02-02T23:00:00.000Z'),
		value: 73
	},
	{
		date: new Date('2025-02-03T23:00:00.000Z'),
		value: 67
	},
	{
		date: new Date('2025-02-04T23:00:00.000Z'),
		value: 59
	},
	{
		date: new Date('2025-02-05T23:00:00.000Z'),
		value: 63
	},
	{
		date: new Date('2025-02-06T23:00:00.000Z'),
		value: 54
	},
	{
		date: new Date('2025-02-07T23:00:00.000Z'),
		value: 81
	},
	{
		date: new Date('2025-02-08T23:00:00.000Z'),
		value: 72
	},
	{
		date: new Date('2025-02-09T23:00:00.000Z'),
		value: 69
	},
	{
		date: new Date('2025-02-10T23:00:00.000Z'),
		value: 51
	},
	{
		date: new Date('2025-02-11T23:00:00.000Z'),
		value: 74
	},
	{
		date: new Date('2025-02-12T23:00:00.000Z'),
		value: 56
	},
	{
		date: new Date('2025-02-13T23:00:00.000Z'),
		value: 74
	},
	{
		date: new Date('2025-02-14T23:00:00.000Z'),
		value: 83
	},
	{
		date: new Date('2025-02-15T23:00:00.000Z'),
		value: 77
	},
	{
		date: new Date('2025-02-16T23:00:00.000Z'),
		value: 61
	}
];

/**
 * Represents the invoice and its columns.
 */
interface Invoice {
	rideId: string;
	pickOff: string;
	dropOff: string;
	rate: string;
	// existing columns
	driverName: string;
	fare: string;
	// New properties for additional columns
	status: string;
	rideCompleted: string;
	earnings: string;
	actions: string;
	// Ten additional columns
	id: string;
	date: string;
	driver: string;
	pickup: string;
	drop: string;
	distance: string;
	duration: string;
	cost: string;
	rating: string;
	rideStatus: string;
	//added columns
	
}

export const invoices: Invoice[] = [
	{
		rideId: '#12542',
		pickOff: 'Accra Mall',
		dropOff: '',
		rate: '4.9/5',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500',
		// additional properties
		status: 'Active',
		rideCompleted: '150',
		earnings: 'GHS 2,500',
		actions: 'View Profile',
		// Ten additional columns
		id: 'RD003',
		date: '2025-01-20',
		driver: '25 min',
		pickup: 'Hotel District',
		drop: 'Hotel District',
		distance: '28km',
		duration: '60 min',
		cost: 'GHC 32.50',
		rating: '4.9',
		rideStatus: 'Completed'
	},
	{
		rideId: '',
		pickOff: 'Pending',
		dropOff: '',
		rate: '4.9/5',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500',
		// additional properties
		status: 'Pending',
		rideCompleted: '150',
		earnings: 'GHS 2,500',
		actions: 'View Profile',
		// Ten additional columns
		id: 'RD003',
		date: '2025-01-20',
		driver: '30 min',
		pickup: 'City Center',
		drop: 'City Center',
		distance: '28km',
		duration: '60 min',
		cost: 'GHC 32.50',
		rating: '4.9',
		rideStatus: 'Completed'
	},
	{
		rideId: '12543',
		pickOff: 'Unpaid',
		dropOff: 'Ashaiman Terminal',
		rate: '4.9/5',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500',
		// additional properties
		status: 'Inactive',
		rideCompleted: '150',
		earnings: 'GHS 2,500',
		actions: 'View Profile',
		// Ten additional columns
		id: 'RD003',
		date: '2025-01-20',
		driver: '40 min',
		pickup: 'City Center',
		drop: 'City Center',
		distance: '28km',
		duration: '60 min',
		cost: 'GHC 32.50',
		rating: '4.9',
		rideStatus: 'Completed'
	},
	{
		rideId: '12543',
		pickOff: 'Paid',
		dropOff: 'Ashaiman Terminal',
		rate: '4.9/5',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500',
		// additional properties
		status: 'Active',
		rideCompleted: '150',
		earnings: 'GHS 2,500',
		actions: 'View Profile',
		// Ten additional columns
		id: 'RD003',
		date: '2025-01-20',
		driver: '20 min',
		pickup: 'City Center',
		drop: 'City Center',
		distance: '28 km',
		duration: '60 min',
		cost: 'GHC 32.50',
		rating: '4.9',
		rideStatus: 'Completed'
	},
	{
		rideId: '12543',
		pickOff: 'Paid',
		dropOff: 'Ashaiman Terminal',
		rate: '4.9/5',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500',
		status: 'Active',
		rideCompleted: '150',
		earnings: 'GHS 2,500',
		actions: 'View Profile',
		// Ten additional columns
		id: 'RD003',
		date: '2025-01-20',
		driver: '15 min',
		pickup: 'City Center',
		drop: 'City Center',
		distance: '28km',
		duration: '60 min',
		cost: 'GHC 32.50',
		rating: '4.9',
		rideStatus: 'Completed'
	},
	{
		rideId: '12543',
		pickOff: 'Pending',
		dropOff: 'Ashaiman Terminal',
		rate: '4.9/5',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500',
		status: 'Pending',
		rideCompleted: '150',
		earnings: 'GHS 2,500',
		actions: 'View Profile',
		// Ten additional columns
		id: 'RD003',
		date: '2025-01-20',
		driver: '35 min',
		pickup: 'City Center',
		drop: 'City Center',
		distance: '28km',
		duration: '60 min',
		cost: 'GhC 32.50',
		rating: '4.9',
		rideStatus: 'Completed'
	},
	{
		rideId: '12543',
		pickOff: 'Unpaid',
		dropOff: 'Ashaiman Terminal',
		rate: '4.9/5',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500',
		status: 'Active',
		rideCompleted: '150',
		earnings: 'GHS 2,500',
		actions: 'View Profile',
		// Ten additional columns
		id: 'RD003',
		date: '2025-01-20',
		driver: '28 min',
		pickup: 'City Center',
		drop: 'City Center',
		distance: '28km',
		duration: '60 min',
		cost: 'GHC 32.50',
		rating: '4.9',
		rideStatus: 'Completed'
	}
];

// Base type with common fields
export type BaseInvoice = {
	driverName: string;
	rating: string;
};

// Invoice data for rides
export interface InvoiceRide extends BaseInvoice {
	rideId: string;
	pickupLocation: string;
	dropOffLocation: string;
	fare: string;
}

// Invoice data for drivers
export interface InvoiceDriver extends BaseInvoice {
	status: 'Active' | 'Pending' | 'Inactive';
	rides: number;
	earnings: string;
	driverId: string;
	actions: string;
}

// Invoice data for account (which is almost the driver type but adds actions)
export interface InvoiceAccount extends InvoiceDriver {
	_id: string; // Unique identifier for the account
	actions: string;
	accountId: string;
}

import { type FinanceReportType as FinanceStoreReportType } from './financeStore';

// If needed, you can define a union type of all invoice types:
export type InvoiceData = InvoiceRide | InvoiceDriver | InvoiceAccount | InvoiceReportType | FinanceStoreReportType;

export const invoiceRides: InvoiceRide[] = [
	{
		rideId: '#12542',
		pickupLocation: 'Kojo Aban',
		dropOffLocation: 'kojoaban@gmail.com',
		rating: 'somewhere in ghana',
		driverName: 'Kwame Asante',
		fare: 'GHS 2,500'
	},
	{
		rideId: '#12543',
		pickupLocation: 'Addae Fenuku',
		dropOffLocation: 'addaefenuku@live.com',
		rating: 'somewhere in ghana',
		driverName: 'Lamine Yamal',
		fare: 'GHS 2,500'
	},
	{
		rideId: '#12544',
		pickupLocation: 'Enam Danquah',
		dropOffLocation: 'enamanquah027@yahoo.com',
		rating: 'somewhere in ghana',
		driverName: 'Laurato Martinez',
		fare: 'GHS 2,500'
	},
	{
		rideId: '#12545',
		pickupLocation: 'Commie Bubune',
		dropOffLocation: 'Commie_Bubune@hotmail.com',
		rating: 'somewhere in ghana',
		driverName: 'James kwesa',
		fare: 'GHS 2,500'
	},
	{
		rideId: '#12546',
		pickupLocation: 'Kplorm Koffi',
		dropOffLocation: 'kpoboss@today.com',
		rating: 'somewhere in ghana',
		driverName: 'Timothy Asanie',
		fare: 'GHS 2,500'
	},
	{
		rideId: '#12547',
		pickupLocation: 'Lomi Nkrumah',
		dropOffLocation: 'Lomistars@gmail.com',
		rating: 'somewhere in ghana',
		driverName: 'Mario Icardi',
		fare: 'GHS 2,500'
	},
	{
		rideId: '#12548',
		pickupLocation: 'Siisi Tano',
		dropOffLocation: 'Siisitano@wiki.com',
		rating: 'somewhere in ghana',
		driverName: 'Eric Garcia',
		fare: 'GHS 2,500'
	}
];

export const invoiceDrivers: InvoiceDriver[] = [
	{
		driverId: '#12549',
		driverName: 'Kwame Asante',
		status: 'Active',
		rides: 150,
		rating: '4.9/5',
		earnings: 'GHS 2,500',
		actions: 'View Profile'
	},
	{
		driverId: '#12550',
		driverName: 'Chalie Shallipopi',
		status: 'Pending',
		rides: 150,
		rating: '4.9/5',
		earnings: 'GHS 2,500',
		actions: 'View Profile'
	},
	{
		driverId: '#12551',
		driverName: 'Timaya Akunta',
		status: 'Inactive',
		rides: 150,
		rating: '4.9/5',
		earnings: 'GHS 2,500',
		actions: 'View Profile'
	},
	{
		driverId: '#12552',
		driverName: 'Burna Boy',
		status: 'Active',
		rides: 150,
		rating: '4.9/5',
		earnings: 'GHS 2,500',
		actions: 'View Profile'
	},
	{
		driverId: '#12553',
		driverName: 'Terry Apala',
		status: 'Active',
		rides: 150,
		rating: '4.9/5',
		earnings: 'GHS 2,500',
		actions: 'View Profile'
	},
	{
		driverId: '#12554',
		driverName: 'Davido Adeleke',
		status: 'Pending',
		rides: 150,
		rating: '4.9/5',
		earnings: 'GHS 2,500',
		actions: 'View Profile'
	},
	{
		driverId: '#12555',
		driverName: 'Wikid Olamide',
		status: 'Active',
		rides: 150,
		rating: '4.9/5',
		earnings: 'GHS 2,500',
		actions: 'View Profile'
	}
];

// export const invoiceAccount: InvoiceAccount[] = [
// 	{
// 		accountId: '#12556',
// 		driverName: 'Kwame Asante',
// 		status: 'Active',
// 		rides: 150,
// 		rating: '4.9/5',
// 		earnings: 'GHS 2,500',
// 		actions: 'View Profile',
// 		driverId: '12345'
// 	},
// 	{
// 		accountId: '#12557',
// 		driverName: 'Kwame Asante',
// 		status: 'Pending',
// 		rides: 150,
// 		rating: '4.9/5',
// 		earnings: 'GHS 2,500',
// 		actions: 'View Profile',
// 		driverId: '12346'
// 	},
// 	{
// 		accountId: '#12558',
// 		driverName: 'Kwame Asante',
// 		status: 'Inactive',
// 		rides: 150,
// 		rating: '4.9/5',
// 		earnings: 'GHS 2,500',
// 		actions: 'View Profile',
// 		driverId: '12347'
// 	},
// 	{
// 		accountId: '#12559',
// 		driverName: 'Kwame Asante',
// 		status: 'Active',
// 		rides: 150,
// 		rating: '4.9/5',
// 		earnings: 'GHS 2,500',
// 		actions: 'View Profile',
// 		driverId: '12348'
// 	},
// 	{
// 		accountId: '#12560',
// 		driverName: 'Kwame Asante',
// 		status: 'Active',
// 		rides: 150,
// 		rating: '4.9/5',
// 		earnings: 'GHS 2,500',
// 		actions: 'View Profile',
// 		driverId: '12349'
// 	},
// 	{
// 		accountId: '#12561',
// 		driverName: 'Kwame Asante',
// 		status: 'Pending',
// 		rides: 150,
// 		rating: '4.9/5',
// 		earnings: 'GHS 2,500',
// 		actions: 'View Profile',
// 		driverId: '12350'
// 	},
// 	{
// 		accountId: '#12562',
// 		driverName: 'Kwame Asante',
// 		status: 'Active',
// 		rides: 150,
// 		rating: '4.9/5',
// 		earnings: 'GHS 2,500',
// 		actions: 'View Profile',
// 		driverId: '12351'
// 	}
// ];

export interface InvoiceReportType {
	id: string;
	date: string;
	shipmentID: string;
	origin: string;
	destination: string;
	items: number | string;
	quantity: number;
	status: string;
	driver: number;
	priority: string;
	}

export const InvoiceReport: InvoiceReportType[] = [
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '', // no shipment id available
        origin: 'Hotel District',  // from pickup
        destination: '15.7',         // from dropoff
        items: 1,                    // default value
        quantity: 1,                 // default value
        status: 'Completed',
        driver: 0,                   // since original value was "Airport"
        priority: 'High'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'Low'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'Medium'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'Low'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'High'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'Low'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'High'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'Low'
    },
    {
        id: 'RD003',
        date: '2025-01-20',
        shipmentID: '',
        origin: 'City Center',
        destination: 'City Center',
        items: 1,
        quantity: 1,
        status: 'Completed',
        driver: 0,
        priority: 'High'
    }
];

export interface FinanceReportType {
	id: string;
	date: string;
	time: string;
	payment: string;
	user: string;
	amount: string;
	pickup: string;
	dropOff: string;
	rideDuration: string;
	driverName: string;
}

export const FinanceReport: FinanceReportType[] = [
    {
        id: '245',
        date: '2025-01-20',
        payment: 'Card',
		time: '8:00 am',
        user: 'John Doe',
        amount: 'GHS 100',
        pickup: 'Hotel District',
        dropOff: 'Kumasi',
        rideDuration: '23 mins',
        driverName: 'Asante Toois'
    },
	{
		id: '246',
		date: '2025-01-21',
		payment: 'Mobile Money',
		user: 'Phili Stone',
		time: '7:23 am',
		amount: 'GHS 75',
		pickup: 'Jaligo',
		dropOff: 'Accra',
		rideDuration: '15 mins',
		driverName: 'Hans Flick'
	},
	{
		id: '247',
		date: '2025-01-19',
		payment: 'Card',
		user: 'John Doe',
		time: '6:00 pm',
		amount: 'GHS 150',
		pickup: 'Hotel District',
		dropOff: 'Kumasi',
		rideDuration: '45 mins',
		driverName: 'Timothy Anann'
	},
	{
		id: '248',
		date: '2025-01-15',
		payment: 'Card',
		time: '7:00 pm',
		user: 'Sarah Ume',
		amount: 'GHS 175',
		pickup: 'Lonko',
		dropOff: 'Captola',
		rideDuration: '60 mins',
		driverName: 'Yamal Frimpong'
	},
	{
		id: '249',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '11:15 am',
		user: 'John Doe',
		amount: 'GHS 50',
		pickup: 'Sango',
		dropOff: 'Teloka Mansa',
		rideDuration: '10 mins',
		driverName: 'John Joel'
	},
	{
		id: '250',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '1:15 pm',
		user: 'Gozie Elvis',
		amount: 'GHS 30',
		pickup: 'Polsma',
		dropOff: 'Kumasi',
		rideDuration: '5 mins',
		driverName: 'Godwin Ofori'
	},
	{
		id: '251',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '3:15 pm',
		user: 'Lisa Agyemang',
		amount: 'GHS 20',
		pickup: 'Kumasi',
		dropOff: 'Kumasi',
		rideDuration: '3 mins',
		driverName: 'Arteta Gyan'
	},
	{
		id: '252',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '6:10 pm',
		user: 'Theresa Abang',
		amount: 'GHS 60',
		pickup: 'Accra ',
		dropOff: 'Accra',
		rideDuration: '18 mins',
		driverName: 'Monica Felix'
	},
	{
		id: '253',
		date: '2025-01-20',
		time: '10:45 am',
		payment: 'Payment',
		user: 'Kiki Akemian',
		amount: 'GHS 100',
		pickup: 'Hotel District',
		dropOff: 'Kumasi',
		rideDuration: '2 hours',
		driverName: 'Clever Cleverly'
	},
	{
		id: '254',
		date: '2025-01-20',
		payment: 'Payment',
		time: '5:52 am',
		user: 'Honet Abila',
		amount: 'GHS 100',
		pickup: 'Mopapa ',
		dropOff: 'Aloko',
		rideDuration: '23 mins',
		driverName: 'Kwame Asante'
	}
]