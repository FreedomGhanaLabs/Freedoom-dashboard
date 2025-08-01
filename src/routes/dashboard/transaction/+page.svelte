<script lang="ts">
	import { ListFilter, Plus, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';

	import { goto } from '$app/navigation';
	import { Download } from '@lucide/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let transactions = data.transactions ?? [];
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

	function formatDate(isoDateString: string): string {
		if (!isoDateString) return '-';

		const date = new Date(isoDateString);

		return date.toLocaleString('en-US', {
			day: '2-digit',
			month: 'numeric',
			year: 'numeric'
		});
	}

	function flattenRideData(transactions: any) {
		return {
			...transactions,
			id: transactions.id,
			'user.name': transactions.user?.name || '-',
			'user.phone': transactions.user?.phone || '-',
			'ride.pickupLocation': transactions.ride?.pickupLocation?.address || '-',
			'ride.dropoffLocation': transactions.ride?.dropoffLocation?.address || '-',
			'metadata.servicetype': transactions.metadata?.serviceType || '-',
			'ride.duration': transactions.dropoffLocation?.duration || '-',
			amount: formatToTwoDecimal(Number(transactions.amount.toFixed(2))),
			status: transactions.status || '-',
			createdAt: formatDate(transactions.createdAt)
		};
	}

	let formattedRides = transactions.map(flattenRideData);

	let headings: {
		title: string;
		className: string;
		key: string;
	}[] = [
		{ title: 'Date', className: 'rounded-s-2xl', key: 'createdAt' },
		{ title: 'Phone', className: '', key: 'user.phone' },
		{ title: 'Pick Up', className: '', key: 'ride.pickupLocation' },
		{ title: 'Drop Off', className: '', key: 'ride.dropoffLocation' },
		{ title: 'Service Type', className: '', key: 'metadata.servicetype' },
		{ title: 'Amount', className: '', key: 'amount' },
		{ title: 'Currency', className: '', key: 'currency' },
		{ title: 'Status', className: '', key: 'status' },
		{ title: 'Payment Method', className: '', key: 'paymentMethod' },
		{ title: 'Reference', className: 'rounded-e-2xl', key: 'reference' }
	];

	let searchTerm = '';

	let filteredFinanceReport = searchTerm
		? formattedRides.filter((d: any) => {
				const q = searchTerm.toLowerCase();
				return (
					d.recipientName?.toLowerCase().includes(q) ||
					d.recipientPhone?.toLowerCase().includes(q) ||
					d.packageName?.toLowerCase().includes(q) ||
					d.packageType?.toLowerCase().includes(q)
				);
			})
		: formattedRides;

	function handleDownload() {
		downloadCSV(headings, formattedRides, 'Transactions.csv');
	}
</script>

<svelte:head>
	<title>Transaction - Admin Panel</title>
</svelte:head>

<section class="mx-auto my-12 w-388 rounded-lg bg-white">
	<div class="space mb-4 flex items-center px-12">
		<h3 class="p-10 text-[2rem] font-semibold">Transaction Report</h3>

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
	<div class="my-10 flex items-center justify-between px-[5rem]">
	<p class="text-sm text-gray-600 rounded-md border border-gray-300 bg-white px-2 py-3 shadow-sm">
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

		{#each Array(totalPages).fill(0).slice(0, 6).map((_, i) => i + currentPage - 2).filter(p => p >= 1 && p <= totalPages) as page}
			<button
				class="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-md {page === currentPage ? 'bg-orange-500 text-white' : 'text-gray-700'}"
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
