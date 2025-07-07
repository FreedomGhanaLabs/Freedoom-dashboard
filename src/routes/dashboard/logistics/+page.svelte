<script lang="ts">
	
	import type { PageData } from './$types';
	import { type DeliveryReportType } from '$lib/deliveryStore';
	import { Download, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';

	const { data } = $props<{ data: PageData }>();

	function formatToTwoDecimal(value: number): string {
		return value.toFixed(2);
	}
	let deliveries = data.deliveries;

	let formattedDeliveries = deliveries.map((d: any) => ({
		...d,
		distanceFare: formatToTwoDecimal(Number(d.distanceFare)),
		timeFare: formatToTwoDecimal(Number(d.timeFare)),
		discount: formatToTwoDecimal(Number(d.discount)),
		totalFare: formatToTwoDecimal(Number(d.totalFare)),
		driverEarnings: formatToTwoDecimal(Number(d.driverEarnings)),
		platformCommission: formatToTwoDecimal(Number(d.platformCommission))
	}));

	// Headings for the table
	let headings: {
		title: string;
		className: string;
		key: keyof DeliveryReportType;
	}[] = [
		{ title: 'Recipient Name', className: 'rounded-s-2xl', key: 'recipientName' },
		{ title: 'Recipient Phone', className: '', key: 'recipientPhone' },
		{ title: 'Package Name', className: '', key: 'packageName' },
		{ title: 'Package Type', className: '', key: 'packageType' },
		{ title: 'Distance Fare', className: '', key: 'distanceFare' },
		{ title: 'Time Fare', className: '', key: 'timeFare' },
		{ title: 'Discount', className: '', key: 'discount' },
		{ title: 'Total Fare', className: '', key: 'totalFare' },
		{ title: 'Currency', className: '', key: 'currency' },
		{ title: 'Freedom Commison', className: '', key: 'platformCommission' },
		{ title: 'Driver Earnings', className: '', key: 'driverEarnings' },
		{ title: 'Payment Method', className: 'rounded-e-2xl', key: 'paymentMethod' }
	];

	// Reactive state for filtering and searching
	let startDate = $state('');
	let endDate = $state('');
	let searchQuery = '';

	let filteredDeliveryReport = searchQuery
		? formattedDeliveries.filter((d: any) => {
				const q = searchQuery.toLowerCase();
				return (
					d.recipientName?.toLowerCase().includes(q) ||
					d.recipientPhone?.toLowerCase().includes(q) ||
					d.packageName?.toLowerCase().includes(q) ||
					d.packageType?.toLowerCase().includes(q)
				);
			})
		: formattedDeliveries;

	// --- CSV download logic ---
	function handleDownload() {
		// `$filteredRides` is the unwrapped array here
		downloadCSV(headings, formattedDeliveries, 'Deliveries.csv');
	}
</script>

<svelte:head>
  <title>Deliveries - Admin Panel</title>
</svelte:head>

<!-- Finance Report Table with Filtering and Searching -->
<section class="mx-auto my-12 w-388 rounded-lg bg-white">
	<div class="space mb-4 flex items-center px-12">
		<h3 class="p-10 text-[2rem]">Delivery Report</h3>

		<!-- Search Input -->
		<div class="relative ml-auto">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search by reference"
				class="w-64 rounded border p-3 pl-8"
			/>
			<Search class="absolute left-2 top-1/2 -translate-y-1/2 transform" size={16} />
		</div>
		<button
			onclick={handleDownload}
			class="ml-5 flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-3 text-gray-800"
		>
			<!-- You can swap in any icon here -->
			<Download class="h-5 w-5" />
			<span>Download CSV</span>
		</button>
	</div>
	<TableGroup {headings} invoices={filteredDeliveryReport} />
</section>
