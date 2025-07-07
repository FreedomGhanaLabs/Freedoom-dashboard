export interface FinanceReportType {
	id: string;
	date: string;
	time: string;
	payment: string;
	user: string;
	amount: string;
	pickup: string;
	dropOff: string;
	type: String,
	rideDuration: string;
	driverName: string;
	subject: string;
	customer: string;
	email: string;
	phone: string;
	description: string;
	status: string;
	category: string;
	messages: Message[];
}

export interface Message {
	sender: string;
	timestamp: string;
	content: string;
	isCustomer: boolean;
}

export const FinanceReport: FinanceReportType[] = [
	{
		id: 'TXNID983274',
		date: '2025-01-20',
		payment: 'Card',
		time: '8:00 am',
		user: 'John Doe',
		amount: 'GHS 100',
		pickup: 'Hotel District',
		dropOff: 'Kumasi',
		rideDuration: '23 mins',
		type: 'Ride',
		driverName: 'Asante Toois',
		subject: 'Ride Payment Issue',
		customer: 'John Doe',
		email: 'john.doe@example.com',
		phone: '(555) 123-4567',
		description: 'Customer reported an issue with card payment processing.',
		status: 'Open',
		category: 'Payment',
		messages: []
	},
	{
		id: 'TXNID983275',
		date: '2025-01-21',
		payment: 'Mobile Money',
		user: 'Phili Stone',
		time: '7:23 am',
		amount: 'GHS 75',
		pickup: 'Jaligo',
		dropOff: 'Accra',
		rideDuration: '15 mins',
		type: 'Delivery',
		driverName: 'Hans Flick',
		subject: 'Ride Confirmation',
		customer: 'Phili Stone',
		email: 'phili.stone@example.com',
		phone: '(555) 234-5678',
		description: 'Customer requested confirmation of ride details.',
		status: 'Open',
		category: 'General',
		messages: []
	},
	{
		id: 'TXNID983276',
		date: '2025-01-19',
		payment: 'Card',
		user: 'John Doe',
		time: '6:00 pm',
		amount: 'GHS 150',
		pickup: 'Hotel District',
		dropOff: 'Kumasi',
		rideDuration: '45 mins',
		type: 'Delivery',
		driverName: 'Timothy Anann',
		subject: 'Ride Duration Query',
		customer: 'John Doe',
		email: 'john.doe@example.com',
		phone: '(555) 123-4567',
		description: 'Customer inquired about ride duration accuracy.',
		status: 'Open',
		category: 'General',
		messages: []
	},
	{
		id: 'TXNID983277',
		date: '2025-01-15',
		payment: 'Card',
		time: '7:00 pm',
		user: 'Sarah Ume',
		amount: 'GHS 175',
		pickup: 'Lonko',
		dropOff: 'Captola',
		rideDuration: '60 mins',
		type: 'Ride',
		driverName: 'Yamal Frimpong',
		subject: 'Payment Dispute',
		customer: 'Sarah Ume',
		email: 'sarah.ume@example.com',
		phone: '(555) 345-6789',
		description: 'Customer disputed the charged amount.',
		status: 'Open',
		category: 'Payment',
		messages: []
	},
	{
		id: 'TXNID983278',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '11:15 am',
		user: 'John Doe',
		amount: 'GHS 50',
		pickup: 'Sango',
		dropOff: 'Teloka Mansa',
		rideDuration: '10 mins',
		type: 'Ride',
		driverName: 'John Joel',
		subject: 'Ride Feedback',
		customer: 'John Doe',
		email: 'john.doe@example.com',
		phone: '(555) 123-4567',
		description: 'Customer provided feedback on ride experience.',
		status: 'Open',
		category: 'Feedback',
		messages: []
	},
	{
		id: 'TXNID983279',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '1:15 pm',
		user: 'Gozie Elvis',
		amount: 'GHS 30',
		pickup: 'Polsma',
		dropOff: 'Kumasi',
		rideDuration: '5 mins',
		type: 'Ride',
		driverName: 'Godwin Ofori',
		subject: 'Short Ride Query',
		customer: 'Gozie Elvis',
		email: 'gozie.elvis@example.com',
		phone: '(555) 456-7890',
		description: 'Customer asked about minimum ride charges.',
		status: 'Open',
		category: 'General',
		messages: []
	},
	{
		id: 'TXNID983280',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '3:15 pm',
		user: 'Lisa Agyemang',
		amount: 'GHS 20',
		pickup: 'Kumasi',
		dropOff: 'Kumasi',
		rideDuration: '3 mins',
		type: 'Delivery',
		driverName: 'Arteta Gyan',
		subject: 'Ride Cancellation',
		customer: 'Lisa Agyemang',
		email: 'lisa.agyemang@example.com',
		phone: '(555) 567-8901',
		description: 'Customer inquired about cancellation policy.',
		status: 'Open',
		category: 'General',
		messages: []
	},
	{
		id: 'TXNID983281',
		date: '2025-01-20',
		payment: 'Mobile Money',
		time: '6:10 pm',
		user: 'Theresa Abang',
		amount: 'GHS 60',
		pickup: 'Accra',
		dropOff: 'Accra',
		rideDuration: '18 mins',
		type: 'Delivery',
		driverName: 'Monica Felix',
		subject: 'Driver Conduct',
		customer: 'Theresa Abang',
		email: 'theresa.abang@example.com',
		phone: '(555) 678-9012',
		description: 'Customer reported driver behavior.',
		status: 'Open',
		category: 'Feedback',
		messages: []
	},
	{
		id: 'TXNID983282',
		date: '2025-01-20',
		time: '10:45 am',
		payment: 'Payment',
		user: 'Kiki Akemian',
		amount: 'GHS 100',
		pickup: 'Hotel District',
		dropOff: 'Kumasi',
		rideDuration: '2 hours',
		type: 'Ride',
		driverName: 'Clever Cleverly',
		subject: 'Long Ride Query',
		customer: 'Kiki Akemian',
		email: 'kiki.akemian@example.com',
		phone: '(555) 789-0123',
		description: 'Customer asked about long ride pricing.',
		status: 'Open',
		category: 'General',
		messages: []
	},
	{
		id: 'TXNID983283',
		date: '2025-01-20',
		payment: 'Payment',
		time: '5:52 am',
		user: 'Honet Abila',
		amount: 'GHS 100',
		pickup: 'Mopapa',
		dropOff: 'Aloko',
		rideDuration: '23 mins',
		type: 'Ride',
		driverName: 'Kwame Asante',
		subject: 'Payment Method Issue',
		customer: 'Honet Abila',
		email: 'honet.abila@example.com',
		phone: '(555) 890-1234',
		description: 'Customer faced issues with payment method.',
		status: 'Open',
		category: 'Payment',
		messages: []
	}
];

export function getFinanceReportById(id: string): FinanceReportType | undefined {
    return FinanceReport.find(report => report.id === id);
}