<script lang="ts">
	import { ListFilter, Plus, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';

	import { goto } from '$app/navigation';

	export let data: {
		currentPage: number;
		totalPages: number;
		users: any[];
	};

	let users = data.users;
	let currentPage = data.currentPage;
	let totalPages = data.totalPages;

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.location.href = `?page=${page}`;
	}

	const headings = [
		{ title: 'ID', className: 'rounded-s-2xl', key: '_id' },
		{ title: 'First Name', key: 'firstName' },
		{ title: 'Last Name', key: 'surname' },
		{ title: 'Email', key: 'email' },
		{ title: 'Phone', key: 'phone' },
		{ title: 'Payment Method', className: 'rounded-e-2xl', key: 'paymentMethod' }
	];

	let searchQuery = '';
	$: filteredUsers = searchQuery
		? users.filter(
				(u) =>
					(u.firstName || u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
					(u.surname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
					(u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
					(u._id || '').toLowerCase().includes(searchQuery.toLowerCase())
			)
		: users;

	function handleRowClick(user: any) {
		goto(`/dashboard/user/${user._id}`);
	}
</script>

<svelte:head>
	<title>User - Admin Panel</title>
</svelte:head>

<div class="mx-auto">
	<div class="my-12 w-388 rounded-lg bg-white">
		<div class="mt-4 flex flex-row items-center justify-between px-20 py-6">
			<h3 class="text-2xl">User Management</h3>
			<div class="flex flex-row items-center justify-between space-x-5">
				<form class="mx-auto max-w-md">
					<label
						for="default-search"
						class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">Search</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<Search class="h-4 w-4 text-gray-500" />
						</div>
						<input
							type="search"
							id="default-search"
							bind:value={searchQuery}
							class="block w-fit max-w-52 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
							placeholder="Search"
						/>
					</div>
				</form>

				<button
					class="ml-5 flex flex-row items-center justify-center space-x-3 rounded-lg border border-gray-500 bg-white px-5 py-3 text-gray-600"
				>
					<ListFilter />
					<h4>Filter</h4>
				</button>
			</div>
		</div>
		<TableGroup {headings} invoices={filteredUsers} />

		<div class="my-10 flex items-center justify-between px-[5rem]">
			<p
				class="rounded-md border border-gray-300 bg-white px-2 py-3 text-sm text-gray-600 shadow-sm"
			>
				Page {currentPage} of {totalPages}
			</p>

			<nav
				class="inline-flex items-center space-x-1 rounded-md border border-gray-300 bg-white px-2 py-3 shadow-sm"
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
