// deliveryStore.ts
export interface DeliveryReportType {
  _id: string;
  recipientName: string;
  recipientPhone: string;
  packageName: string;
  packageType: string;
  distanceFare: number;
  timeFare: number;
  discount: number;
  totalFare: number;
  currency: string;
  platformCommission: number;
  driverEarnings: number;
  paymentMethod: string;
  driverPhone: string;
  customer: {
    _id: string;
    phone: string;
    email: string;
    id: string;
  };
  email: string;
  phone: string;
  driver: {
    _id: string;
    email: string;
    phone: string;
    motorcycleType: string;
    motorcycleColor: string;
    motorcycleNumber: string;
    id: string;
  };
  pickupLocation: {
    type: string;
    coordinates: number[];
    address: string;
    _id: string;
  };
  dropoffLocation: {
    type: string;
    coordinates: number[];
    address: string;
    _id: string;
  };
  packageSize: string;
  packageDescription: string;
  deliveryInstructions: string;
  isDeliveryVerified: boolean;
  status: string;
  paymentStatus: string;
  requestedAt: string;
  acceptedAt: string;
  arrivedAt: string;
  startedAt: string;
  timeline: { time: string; event: string }[];
  items: { sku: string; description: string; category: string; qty: number; value: string }[];
  weatherConditions: {
    isRaining: boolean;
    temperature: number | null;
  };
  isMultiStop: boolean;
  baseFare: number;
  surgeMultiplier: number;
  demandLevel: string;
  cancelledBy: string | null;
  dropoffLocations: any[];
  messages: any[];
  locationHistory: any[];
}


// export const DeliveryReport: DeliveryReportType[] = [
// 	{
// 		recipientName: 'ORD-2025-1234',
// 		recipientPhone: '2025-01-20',
// 		packageName: 'Cash',
// 		packageType: '8:00 am',
// 		distanceFare: 'John Doe',
// 		timeFare: 'GHS 100',
//         discount: 'Cash',
// 		totalFare: 'Hotel District',
// 		currency: 'Kumasi',
// 		platformCommission: '23 mins',
// 		driverEarnings: 'Asante Toois',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'John Doe',
// 		email: 'john.doe@example.com',
// 		phone: '(555) 123-4567',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'Laptop Charger', category: 'Electronics', qty: 2, value: 'GHS 50.00' },
//             { sku: 'SKU-002', description: 'Wireless Mouse', category: 'Electronics', qty: 1, value: 'GHS 25.00' },
//             { sku: 'SKU-003', description: 'USB Cable', category: 'Accessories', qty: 3, value: 'GHS 15.00' }
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1235',
// 		recipientPhone: '2025-01-21',
// 		packageName: 'Mobile Money',
// 		distanceFare: 'Phili Stone',
// 		packageType: '7:23 am',
// 		timeFare: 'GHS 75',
//         discount: 'Mobile Money',
// 		totalFare: 'Jaligo',
// 		currency: 'Accra',
// 		platformCommission: '15 mins',
// 		driverEarnings: 'Hans Flick',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'Phili Stone',
// 		email: 'phili.stone@example.com',
// 		phone: '(555) 234-5678',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'MAcbook', category: 'Electronics', qty: 1, value: 'GHS 50.00' },
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1236',
// 		recipientPhone: '2025-01-19',
// 		packageName: 'Card',
// 		distanceFare: 'John Doe',
// 		packageType: '6:00 pm',
// 		timeFare: 'GHS 150',
//         discount: 'Card',
// 		totalFare: 'Hotel District',
// 		currency: 'Kumasi',
// 		platformCommission: '45 mins',
// 		driverEarnings: 'Timothy Anann',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'John Doe',
// 		email: 'john.doe@example.com',
// 		phone: '(555) 123-4567',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-004', description: 'Headphones', category: 'Electronics', qty: 1, value: 'GHS 75.00' }
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1237',
// 		recipientPhone: '2025-01-15',
// 		packageName: 'Cash',
// 		packageType: '7:00 pm',
// 		distanceFare: 'Sarah Ume',
// 		timeFare: 'GHS 175',
//         discount: 'Cash',
// 		totalFare: 'Lonko',
// 		currency: 'Captola',
// 		platformCommission: '60 mins',
// 		driverEarnings: 'Yamal Frimpong',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'Sarah Ume',
// 		email: 'sarah.ume@example.com',
// 		phone: '(555) 345-6789',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-005', description: 'Handbag', category: 'Accessories', qty: 2, value: 'GHS 30.00 ' }
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1238',
// 		recipientPhone: '2025-01-20',
// 		packageName: 'Mobile Money',
// 		packageType: '11:15 am',
// 		distanceFare: 'John Doe',
// 		timeFare: 'GHS 50',
//         discount: 'Mobile Money',
// 		totalFare: 'Sango',
// 		currency: 'Teloka Mansa',
// 		platformCommission: '10 mins',
// 		driverEarnings: 'John Joel',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'John Doe',
// 		email: 'john.doe@example.com',
// 		phone: '(555) 123-4567',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'Beadsheets', category: 'Clothings', qty: 1, value: 'GHS 75.00 ' },
//             { sku: 'SKU-001', description: 'Pillows', category: 'Clothings', qty: 2, value: 'GHS 85.00 ' }
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1239',
// 		recipientPhone: '2025-01-20',
// 		packageName: 'Card',
// 		packageType: '1:15 pm',
// 		distanceFare: 'Gozie Elvis',
// 		timeFare: 'GHS 30',
//         discount: 'Card',
// 		totalFare: 'Polsma',
// 		currency: 'Kumasi',
// 		platformCommission: '5 mins',
// 		driverEarnings: 'Godwin Ofori',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'Gozie Elvis',
// 		email: 'gozie.elvis@example.com',
// 		phone: '(555) 456-7890',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'Beadsheets', category: 'Clothings', qty: 1, value: 'GHS 75.00 ' },
//             { sku: 'SKU-001', description: 'Pillows', category: 'Clothings', qty: 2, value: 'GHS 85.00 ' }
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1240',
// 		recipientPhone: '2025-01-20',
// 		packageName: 'Cash',
// 		packageType: '3:15 pm',
// 		distanceFare: 'Lisa Agyemang',
// 		timeFare: 'GHS 20',
//         discount: 'Cash',
// 		totalFare: 'Kumasi',
// 		currency: 'Kumasi',
// 		platformCommission: '3 mins',
// 		driverEarnings: 'Arteta Gyan',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'Lisa Agyemang',
// 		email: 'lisa.agyemang@example.com',
// 		phone: '(555) 567-8901',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'Shorts', category: 'Clothings', qty: 1, value: 'GHS 75.00 ' },
//             { sku: 'SKU-002', description: 'Jerseys', category: 'Clothings', qty: 2, value: 'GHS 45.00 ' }
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1241',
// 		recipientPhone: '2025-01-20',
// 		packageName: 'Mobile Money',
// 		packageType: '6:10 pm',
// 		distanceFare: 'Theresa Abang',
// 		timeFare: 'GHS 60',
//         discount: 'Mobile Money',
// 		totalFare: 'Accra',
// 		currency: 'Accra',
// 		platformCommission: '18 mins',
// 		driverEarnings: 'Monica Felix',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'Theresa Abang',
// 		email: 'theresa.abang@example.com',
// 		phone: '(555) 678-9012',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'Iphone 16', category: 'Electronics', qty: 1, value: 'GHS 75.00 ' },
//             { sku: 'SKU-002', description: 'Chargers', category: 'Electronics', qty: 2, value: 'GHS 45.00 ' }
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1242',
// 		recipientPhone: '2025-01-20',
// 		packageType: '10:45 am',
// 		packageName: 'Cash',
// 		distanceFare: 'Kiki Akemian',
// 		timeFare: 'GHS 100',
//         discount: 'Cash',
// 		totalFare: 'Hotel District',
// 		currency: 'Kumasi',
// 		platformCommission: '2 hours',
// 		driverEarnings: 'Clever Cleverly',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'Kiki Akemian',
// 		email: 'kiki.akemian@example.com',
// 		phone: '(555) 789-0123',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'Premier League Trophy', category: 'Sports', qty: 1, value: 'GHS 750.00 ' },
//         ]
// 	},
// 	{
// 		recipientName: 'ORD-2025-1243',
// 		recipientPhone: '2025-01-20',
// 		packageName: 'Cash',
// 		packageType: '5:52 am',
// 		distanceFare: 'Honet Abila',
// 		timeFare: 'GHS 100',
//         discount: 'Cash',
// 		totalFare: 'Mopapa',
// 		currency: 'Aloko',
// 		platformCommission: '23 mins',
// 		driverEarnings: 'Kwame Asante',
// 		paymentMethod: 'Cash',
//         driverPhone: '(555) 123-4567',
// 		customer: 'Honet Abila',
// 		email: 'honet.abila@example.com',
// 		phone: '(555) 890-1234',
//         timeline: [
//             { time: '2025-02-28 09:46 AM', event: 'Order Placed' },
//             { time: '2025-03-01 10:15 AM', event: 'Item Picked' },
//             { time: '2025-03-05 12:00 PM', event: 'In Transit' },
//             { time: '2025-03-06 14:30 PM', event: 'Delivered' }
//         ],
//         items: [
//             { sku: 'SKU-001', description: 'Play Staion 5', category: 'Electronics', qty: 1, value: 'GHS 100.00 ' },
//         ]
// 	}
// ];

// export function getFinanceReportById(recipientName: string): DeliveryReportType | undefined {
//     return DeliveryReport.find(report => report.recipientName === recipientName);
// }