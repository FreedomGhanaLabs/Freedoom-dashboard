<script lang="ts">
	import { Download, Search } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';
	import { debounce } from 'lodash-es'; 

	const { data } = $props<{ data: PageData }>();

	
	let currentPage = $state(data.currentPage);
	let totalPages = $state(data.totalPages);
	let searchTerm = $state('');

	
	function formatTimestamp(isoString: string): string {
		return new Date(isoString).toLocaleString('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}

	let activity = $derived(
		data.activity.map((entry: any) => ({
			...entry,
			formattedTimestamp: formatTimestamp(entry.timestamp)
		}))
	);


	let headings = $state([
		{ title: 'Id', className: 'rounded-s-2xl', key: '_id' },
		{ title: 'Admin ID', className: '', key: 'adminId' },
		{ title: 'Action', className: '', key: 'action' },
		{ title: 'Time Stamp', className: '', key: 'formattedTimestamp' },
		{ title: 'Ip Address', className: 'rounded-e-2xl', key: 'ipAddress' }
	]);

	// Debounced search function
	const debouncedFilter = debounce((term: string) => {
		searchTerm = term;
	}, 300);

	// Filtered activity based on search term
	let filteredActivity = $derived(
		searchTerm
			? activity.filter((d: any) => {
					const q = searchTerm.toLowerCase();
					return (
						d.adminName?.toLowerCase().includes(q) ||
						d.action?.toLowerCase().includes(q) ||
						d.ipAddress?.toLowerCase().includes(q)
					);
			  })
			: activity
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
			goto(`?page=${page}`, { invalidateAll: true }); // Trigger SvelteKit navigation
		}
	}

	// Handle CSV download
	function handleDownload() {
		downloadCSV(headings, activity, 'Activity.csv');
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
							oninput={(e) => debouncedFilter(e.currentTarget.value)}
							class="block w-fit max-w-52 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:border-none focus:outline-none"
							placeholder="Search"
							required
						/>
					</div>
				</form>
				<button
					onclick={handleDownload}
					class="flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-3 text-gray-800"
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

				{#each getPageRange(currentPage, totalPages) as page}
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