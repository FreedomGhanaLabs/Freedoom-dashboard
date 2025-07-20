<script lang="ts">
	import { Download, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';

	export let data;

	function formatTimestamp(isoString: string): string {
		return new Date(isoString).toLocaleString('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}

	let { payments, pagination, currentPage } = data;

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.location.href = `?page=${page}`;
	}

	let processedPayments = payments.map((entry: any) => ({
		...entry,
		fullName: `${entry.driverId.firstName} ${entry.driverId.lastName}`,
		email: entry.driverId.email,
		phone: entry.driverId.phone,
		formattedMonth: new Date(entry.monthOf).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
		recordedByName: entry.recordedBy.firstName
	}));

	let headings = [
		{ title: 'Full Name', className: 'rounded-s-2xl', key: 'fullName' },
		{ title: 'Email', className: '', key: 'email' },
		{ title: 'Phone', className: '', key: 'phone' },
		{ title: 'Amount', className: '', key: 'amount' },
		{ title: 'Payment Method', className: '', key: 'paymentMethod' },
		{ title: 'Payment For', className: '', key: 'paymentFor' },
		{ title: 'Month Of', className: '', key: 'formattedMonth' },
		{ title: 'Status', className: '', key: 'paymentStatus' },
		{ title: 'Recorded By', className: 'rounded-e-2xl', key: 'recordedByName' }
	];

	let searchTerm = '';

	let filteredActivity = searchTerm
		? processedPayments.filter((d: any) => {
				const q = searchTerm.toLowerCase();
				return (
					d.fullName.toLowerCase().includes(q) ||
					d.email.toLowerCase().includes(q) ||
					d.phone.toLowerCase().includes(q) ||
					d.paymentMethod.toLowerCase().includes(q)
				);
			})
		: processedPayments;

	function handleDownload() {
		downloadCSV(headings, processedPayments, 'Activity.csv');
	}
</script>

<svelte:head>
	<title>Activity - Admin Panel</title>
</svelte:head>

<div class="mx-auto">
	<div class="my-12 w-388 rounded-lg bg-white">
		<div class="mt-4 flex items-center justify-between px-20 py-6">
			<h3 class="text-2xl">Activity Logs</h3>
			<div class="flex items-center space-x-5">
				<form class="mx-auto max-w-md">
					<label for="default-search" class="sr-only">Search</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<Search class="h-4 w-4 text-gray-500" />
						</div>
						<input
							type="search"
							id="default-search"
							bind:value={searchTerm}
							class="block w-fit max-w-52 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:border-none focus:outline-none"
							placeholder="Search"
							required
						/>
					</div>
				</form>
				<button
					onclick={handleDownload}
					class="flex items-center gap-2 rounded-lg border ml-5 border-gray-500 px-4 py-3 text-gray-800"
				>
					<Download class="h-5 w-5" />
					<span>Download CSV</span>
				</button>
			</div>
		</div>

		<TableGroup {headings} invoices={filteredActivity} />

		<div class="my-10 flex items-center justify-between px-[5rem]">
			<p
				class="rounded-md border border-gray-300 bg-white px-2 py-3 text-sm text-gray-600 shadow-sm"
			>
				Page {currentPage} of {pagination.page}
			</p>

			<nav
				class="inline-flex items-center mb-10 space-x-1 rounded-md border border-gray-300 bg-white px-2 py-3 shadow-sm"
			>
				<button
					onclick={() => goToPage(currentPage - 1)}
					class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
					disabled={currentPage === 1}
				>
					← Prev
				</button>

				{#each Array(pagination.pages)
					.fill(0)
					.slice(0, 6)
					.map((_, i) => i + currentPage - 2)
					.filter((p) => p >= 1 && p <= pagination.pages) as page}
					<button
						class="rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-100 {page === currentPage
							? 'bg-orange-500 text-white'
							: 'text-gray-700'}"
						onclick={() => goToPage(page)}
					>
						{page}
					</button>
				{/each}

				<button
					onclick={() => goToPage(currentPage + 1)}
					class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
					disabled={currentPage === pagination.pages}
				>
					Next →
				</button>
			</nav>
		</div>
	</div>
</div>
