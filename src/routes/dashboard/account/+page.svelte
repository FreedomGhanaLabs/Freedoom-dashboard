<script lang="ts">
	
	import { sum } from 'd3-array';
	import { dateSeriesData, invoices, keyColors, values } from '$lib/data';
	import { goto } from '$app/navigation';
	import { Download, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';

	let dataSum = $derived(sum(values, (d: any) => d.value));
	let renderContext: 'svg' | 'canvas' = 'svg';
	let debug = false;

	const { data } = $props<{ data: PageData }>();
	let operations = data.operations;
	let currentPage = data.currentPage;
	let totalPages = data.totalPages;

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.location.href = `?page=${page}`;
	}

	function formatToTwoDecimal(value: number): string {
		return value.toFixed(2);
	}

	function flattenRideData(operations: any) {
		return {
			...operations,
			'user.phone': operations.user?.phone || '-',
			'estimatedDistance.text': operations.estimatedDistance?.text || '-',
			'estimatedDuration.text': operations.estimatedDuration?.text || '-',
			'pickupLocation.address': operations.pickupLocation?.address || '-',
			isMultiStop: operations.isMultiStop ? 'Yes' : 'No',
			'dropoffLocation.address': operations.dropoffLocation?.address || '-',
			timeFare: formatToTwoDecimal(Number(operations.timeFare)),
			distanceFare: formatToTwoDecimal(Number(operations.distanceFare)),
			platformCommission: formatToTwoDecimal(Number(operations.platformCommission)),
			driverEarnings: formatToTwoDecimal(Number(operations.driverEarnings)),
			totalFare: formatToTwoDecimal(Number(operations.totalFare)),
			paymentMethod: operations.paymentMethod || '-'
		};
	}

	let formattedRides = operations.map(flattenRideData);

	let headings: {
		title: string;
		className: string;
		key: string;
	}[] = [
		{ title: 'Recipient Phone', className: 'rounded-s-2xl', key: 'user.phone' },
		{ title: 'Pick Up', className: '', key: 'pickupLocation.address' },
		{ title: 'Drop Off', className: '', key: 'dropoffLocation.address' },
		{ title: 'Mulit Stop', className: '', key: 'isMultiStop' },
		{ title: 'Estimated Distance', className: '', key: 'estimatedDistance.text' },
		{ title: 'Estimated Duration', className: '', key: 'estimatedDuration.text' },
		{ title: 'Ride Type', className: '', key: 'operationType' },
		{ title: 'Ride Fare', className: '', key: 'distanceFare' },
		{ title: 'Discount', className: '', key: 'discount' },
		{ title: 'Commission', className: '', key: 'platformCommission' },
		{ title: 'Driver Earnings', className: '', key: 'driverEarnings' },
		{ title: 'Total Fare', className: '', key: 'totalFare' },
		{ title: 'Payment Status', className: '', key: 'paymentStatus' },
		{ title: 'Payment Method', className: 'rounded-e-2xl', key: 'paymentMethod' }
	];

	let searchTerm = $state('');

	let filteredFinanceReport = $derived(
		searchTerm
			? formattedRides.filter((d: any) => {
					const q = searchTerm.toLowerCase();
					return (
						d.recipientName?.toLowerCase().includes(q) ||
						d.recipientPhone?.toLowerCase().includes(q) ||
						d.packageName?.toLowerCase().includes(q) ||
						d.packageType?.toLowerCase().includes(q)
					);
				})
			: formattedRides
	);

	// --- CSV download logic ---
	function handleDownload() {
		downloadCSV(headings, formattedRides, 'Operations.csv');
	}
</script>

<svelte:head>
	<title>Operations - Admin Panel</title>
</svelte:head>

<section class="mx-auto my-12 w-388 rounded-lg bg-white">
	<div class="space mb-4 flex items-center px-12">
		<h3 class="p-10 text-[2rem] font-semibold">Operations Report</h3>

		<div class="relative mr-5 ml-auto">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search by reference"
				class="w-64 rounded border p-3 pl-8"
			/>
			<Search class="absolute top-1/2 left-2 -translate-y-1/2 transform" size={16} />
		</div>
		<button
			onclick={handleDownload}
			class="flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-3 text-gray-800"
		>
			<Download class="h-5 w-5" />
			<span>Download CSV</span>
		</button>
	</div>
	<div class="px-8">
		<TableGroup {headings} invoices={filteredFinanceReport} />
	</div>

	<!-- Pagination container -->
<div class="my-10 flex items-center justify-between px-[5rem]">
	<!-- Page text -->
	<p class="text-sm text-gray-600 rounded-md border border-gray-300 bg-white px-2 py-3 shadow-sm">
		Page {currentPage} of {totalPages}
	</p>

	<!-- Pagination UI -->
	<nav class="inline-flex items-center space-x-1 rounded-md border border-gray-300 bg-white px-2 py-3 shadow-sm">
		<button
			onclick={() => goToPage(currentPage - 1)}
			class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
			disabled={currentPage === 1}
		>
			← Prev
		</button>

		{#each Array(totalPages).fill(0).slice(0, 6).map((_, i) => i + currentPage - 2).filter(p => p >= 1 && p <= totalPages) as page}
			<button
				class="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-md {page === currentPage ? 'bg-black text-white' : 'text-gray-700'}"
				onclick={() => goToPage(page)}
			>
				{page}
			</button>
		{/each}

		<button
			onclick={() => goToPage(currentPage + 1)}
			class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
			disabled={currentPage === totalPages}
		>
			Next →
		</button>
	</nav>
</div>


</section>
