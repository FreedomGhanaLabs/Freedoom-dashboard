<script lang="ts">
	import { sum } from 'd3-array';
	import { goto } from '$app/navigation';
	import { Download, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';
	import { debounce } from 'lodash-es'; // Assuming lodash is available

	const { data } = $props<{ data: PageData }>();
	let dataSum = $derived(sum(data.operations, (d: any) => Number(d.totalFare)));
	let renderContext: 'svg' | 'canvas' = 'svg';
	let debug = $state(false);

	// Reactive state for pagination and search
	let currentPage = $state(data.currentPage);
	let totalPages = $state(data.totalPages);
	let searchTerm = $state('');

	// Format number to two decimal places
	function formatToTwoDecimal(value: number): string {
		return value.toFixed(2);
	}

	// Flatten ride data for table display
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

	// Map operations to formatted data
	let formattedRides = $derived(data.operations.map(flattenRideData));

	// Table headings
	let headings = $state([
		{ title: 'Recipient Phone', className: 'rounded-s-2xl', key: 'user.phone' },
		{ title: 'Pick Up', className: '', key: 'pickupLocation.address' },
		{ title: 'Drop Off', className: '', key: 'dropoffLocation.address' },
		{ title: 'Multi Stop', className: '', key: 'isMultiStop' },
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
	]);

	// Debounced search function
	const debouncedFilter = debounce((term: string) => {
		searchTerm = term;
	}, 300);

	// Filtered data based on search term
	let filteredFinanceReport = $derived(
		searchTerm
			? formattedRides.filter((d: any) => {
					const q = searchTerm.toLowerCase();
					return (
						d['user.phone']?.toLowerCase().includes(q) ||
						d['pickupLocation.address']?.toLowerCase().includes(q) ||
						d['dropoffLocation.address']?.toLowerCase().includes(q) ||
						d.operationType?.toLowerCase().includes(q) ||
						d.paymentMethod?.toLowerCase().includes(q)
					);
			  })
			: formattedRides
	);

	// Dynamic pagination range
	const getPageRange = (current: number, total: number, maxButtons: number = 5) => {
		const half = Math.floor(maxButtons / 2);
		let start = Math.max(1, current - half);
		let end = Math.min(total, start + maxButtons - 1);

		if (end - start + 1 < maxButtons) {
			start = Math.max(1, end - maxButtons + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	// Navigate to a specific page using client-side routing
	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			currentPage = page;
			const url = new URL(window.location.href);
			url.searchParams.set('page', page.toString());
			goto(`?page=${page}`, { invalidateAll: true });
		}
	}

	// Handle CSV download
	function handleDownload() {
		downloadCSV(headings, formattedRides, 'Operations.csv');
	}
</script>

<svelte:head>
	<title>Operations - Admin Panel</title>
</svelte:head>

<section class="mx-auto my-12 w-388 rounded-lg bg-white">
	<div class="mb-4 flex items-center px-12">
		<h3 class="p-10 text-[2rem] font-semibold">Operations Report</h3>

		<div class="relative mr-5 ml-auto">
			<input
				type="text"
				oninput={(e) => debouncedFilter(e.currentTarget.value)}
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

	<div class="my-10 flex items-center justify-between px-[5rem]">
		<p class="rounded-md border border-gray-300 bg-white px-2 py-3 text-sm text-gray-600 shadow-sm">
			Page {currentPage} of {totalPages}
		</p>

		<nav class="inline-flex items-center space-x-1 rounded-md border border-gray-300 bg-white px-2 py-3 shadow-sm">
			<button
				onclick={() => goToPage(currentPage - 1)}
				class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
				disabled={currentPage === 1}
			>
				← Prev
			</button>

			{#each getPageRange(currentPage, totalPages) as page}
				<button
					class="rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-100 {page === currentPage ? 'bg-orange-500 text-white' : 'text-gray-700'}"
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