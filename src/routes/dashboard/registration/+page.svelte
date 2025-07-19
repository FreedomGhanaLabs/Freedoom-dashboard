<script lang="ts">
	import { Download, Plus, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	function formatTimestamp(isoString: string): string {
		return new Date(isoString).toLocaleString('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}

	let currentPage = data.currentPage;
	let totalPages = data.pagination.pages;
	let searchTerm = '';

	let drivers = data.drivers.map((driver: any) => ({
		...driver,
		fullName: `${driver.firstName} ${driver.otherName} ${driver.lastName}`,
		formattedRegisteredAt: formatTimestamp(driver.registeredAt)
	}));

	let headings = [
		{ title: 'Full Name', className: 'rounded-s-2xl', key: 'fullName' },
		{ title: 'Gender', className: '', key: 'gender' },
		{ title: 'Phone', className: '', key: 'phone' },
		{ title: 'Email', className: '', key: 'email' },
		{ title: 'Address', className: '', key: 'address' },
		{ title: 'City', className: '', key: 'city' },
		{ title: 'Region', className: '', key: 'region' },
		{ title: 'Status', className: '', key: 'registrationStatus' },
		{ title: 'Registered At', className: 'rounded-e-2xl', key: 'formattedRegisteredAt' }
	];

	let filteredDrivers = searchTerm
		? drivers.filter((d: any) => {
				const q = searchTerm.toLowerCase();
				return (
					d.fullName?.toLowerCase().includes(q) ||
					d.email?.toLowerCase().includes(q) ||
					d.phone?.toLowerCase().includes(q)
				);
			})
		: drivers;

	function handleDownload() {
		downloadCSV(headings, drivers, 'Drivers.csv');
	}

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.location.href = `?page=${page}`;
	}
</script>

<svelte:head>
	<title>Registered Drivers - Admin Panel</title>
</svelte:head>

<div class="mx-auto">
	<div class="flex justify-end pr-10">
		<a
			href="/dashboard/addDriver"
			class="rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-md hover:bg-orange-600"
		>
			Register New Driver
		</a>
	</div>

	<div class="my-10 w-full rounded-lg bg-white shadow">
		<div class="mt-4 flex items-center justify-between px-10 py-6">
			<h3 class="text-2xl font-semibold">Registered Drivers</h3>
			<div class="flex items-center space-x-5">
				<form class="mx-auto max-w-md">
					<label for="default-search" class="sr-only">Search</label>
					<div class="relative mr-10">
						<div class="pointer-events-none  absolute inset-y-0 start-0 flex items-center ps-3">
							<Search class="h-4 w-4 text-gray-500" />
						</div>
						<input
							type="search"
							id="default-search"
							bind:value={searchTerm}
							class="block w-64 rounded-lg border border-gray-300 bg-gray-50 p-3 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
							placeholder="Search..."
						/>
					</div>
				</form>
				<button
					onclick={handleDownload}
					class="flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
				>
					<Download class="h-5 w-5" />
					<span>Download CSV</span>
				</button>
			</div>
		</div>

		<div class="px-8">
			<TableGroup {headings} invoices={filteredDrivers} />
		</div>

		<div class="my-10 flex items-center justify-between px-[5rem]">
			<p
				class="rounded-md border border-gray-300 bg-white px-2 py-3 text-sm text-gray-600 shadow-sm"
			>
				Page {currentPage} of {totalPages}
			</p>

			<nav
				class="inline-flex items-center space-x-1 rounded-md mb-9 border border-gray-300 bg-white px-2 py-3 shadow-sm"
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
