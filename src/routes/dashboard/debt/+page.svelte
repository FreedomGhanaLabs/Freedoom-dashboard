<script lang="ts">
	import { Download, Plus, Search } from 'lucide-svelte';
	import { type Debt } from '$lib/debt';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';

	export let data: PageData;

	let debts = data.debt ?? [];

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
	</div>
</div>
