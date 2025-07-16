<script lang="ts">
	import { Download, Plus, Search } from 'lucide-svelte';
	import { type Debt } from '$lib/debt';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';

	export let data: PageData;

	let debts = data.debt ?? [];
	let currentPage = data.currentPage;
	let totalPages = data.totalPages;

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.location.href = `?page=${page}`;
	}

	function flattenRideData(debts: any) {
		return {
			...debts,
			id: debts.id,
			debt: debts.debt.toFixed(2)
		};
	}

	let debt = debts.map(flattenRideData);

	let headings: {
		title: string;
		className: string;
		key: string;
	}[] = [
		{ title: 'Driver', className: 'rounded-s-2xl', key: 'name' },
		{ title: 'Email', className: '', key: 'email' },
		{ title: 'Phone', className: '', key: 'phone' },
		{ title: 'Debt (GHS)', className: '', key: 'debt' },
		{ title: 'Threshold (GHS)', className: '', key: 'debtThreshold' },
		{ title: 'Status', className: '', key: 'debtStatus' },
		{ title: 'Percentage', className: 'rounded-e-2xl', key: 'debtPercentage' }
	];

	let searchTerm = '';

	let filteredDebt = searchTerm
		? debt.filter((d: any) => {
				const q = searchTerm.toLowerCase();
				return d.name?.toLowerCase().includes(q) || d.phone?.toLowerCase().includes(q);
			})
		: debt;

	function handleDownload() {
		downloadCSV(headings, filteredDebt, 'Debt.csv');
	}
</script>

<svelte:head>
	<title>Debt - Admin Panel</title>
</svelte:head>

<div class="mx-auto">
	<div class="my-12 w-388 rounded-lg bg-white">
		<div class="mt-4 flex items-center justify-between px-20 py-6">
			<h3 class="text-2xl">Debt Management</h3>
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
					class="ml-5 flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-3 text-gray-800"
				>
					<Download class="h-5 w-5" />
					<span>Download CSV</span>
				</button>
			</div>
		</div>

		<TableGroup {headings} invoices={filteredDebt} />
		<div class="my-10 flex items-center justify-between px-[5rem]">
			<p
				class="rounded-md border border-gray-300 bg-white px-2 py-3 text-sm text-gray-600 shadow-sm"
			>
				Page {currentPage} of {totalPages}
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

				{#each Array(totalPages)
					.fill(0)
					.slice(0, 6)
					.map((_, i) => i + currentPage - 2)
					.filter((p) => p >= 1 && p <= totalPages) as page}
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
					disabled={currentPage === totalPages}
				>
					Next →
				</button>
			</nav>
		</div>
	</div>
</div>
