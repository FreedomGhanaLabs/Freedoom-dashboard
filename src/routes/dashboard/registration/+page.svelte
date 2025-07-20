<script lang="ts">
	import { Download, Plus, Search, Users, UserCheck, Clock, MapPin, CreditCard, TrendingUp } from 'lucide-svelte';
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

	// Extract stats data for the dashboard
	const {
		totalDrivers = 0,
		activeDrivers = 0,
		completedPayments = 0,
		pendingApproval = 0,
		paymentDurationStats = [],
		topCities = []
	} = data.stats?.data || {};

	// Calculate percentages and derived metrics
	const activePercentage = totalDrivers > 0 ? Math.round((activeDrivers / totalDrivers) * 100) : 0;
	const pendingPercentage = totalDrivers > 0 ? Math.round((pendingApproval / totalDrivers) * 100) : 0;
	const paymentCompletionRate = totalDrivers > 0 ? Math.round((completedPayments / totalDrivers) * 100) : 0;

	// Process payment duration data
	const paymentDurations = paymentDurationStats.map((item: any) => ({
		duration: `${item.id} months`,
		count: item.count,
		percentage: totalDrivers > 0 ? Math.round((item.count / totalDrivers) * 100) : 0
	}));

	// Get top 3 cities
	const topThreeCities = topCities.slice(0, 3);
	const totalCityDrivers = topCities.reduce((sum: number, city: any) => sum + city.count, 0);
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

	<!-- Stats Dashboard -->
	<div class="mb-8 mt-6 space-y-6 px-10">
		<!-- Main Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Total Drivers Card -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-blue-600 text-sm font-medium mb-1">Total Drivers</p>
						<p class="text-3xl font-bold text-blue-900">{totalDrivers.toLocaleString()}</p>
					</div>
					<div class="bg-blue-500 p-3 rounded-xl">
						<Users class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Active Drivers Card -->
			<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-emerald-600 text-sm font-medium mb-1">Active Drivers</p>
						<p class="text-3xl font-bold text-emerald-900">{activeDrivers.toLocaleString()}</p>
						<p class="text-emerald-600 text-xs mt-1">{activePercentage}% of total</p>
					</div>
					<div class="bg-emerald-500 p-3 rounded-xl">
						<UserCheck class="h-6 w-6 text-white" />
					</div>
				</div>
				<div class="mt-3 bg-emerald-200 rounded-full h-2">
					<div 
						class="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
						style="width: {activePercentage}%"
					></div>
				</div>
			</div>

			<!-- Pending Approval Card -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-amber-600 text-sm font-medium mb-1">Pending Approval</p>
						<p class="text-3xl font-bold text-amber-900">{pendingApproval.toLocaleString()}</p>
						<p class="text-amber-600 text-xs mt-1">{pendingPercentage}% of total</p>
					</div>
					<div class="bg-amber-500 p-3 rounded-xl">
						<Clock class="h-6 w-6 text-white" />
					</div>
				</div>
				<div class="mt-3 bg-amber-200 rounded-full h-2">
					<div 
						class="bg-amber-500 h-2 rounded-full transition-all duration-500" 
						style="width: {pendingPercentage}%"
					></div>
				</div>
			</div>

			<!-- Payment Completion Card -->
			<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-purple-600 text-sm font-medium mb-1">Completed Payments</p>
						<p class="text-3xl font-bold text-purple-900">{completedPayments.toLocaleString()}</p>
						<p class="text-purple-600 text-xs mt-1">{paymentCompletionRate}% completion rate</p>
					</div>
					<div class="bg-purple-500 p-3 rounded-xl">
						<CreditCard class="h-6 w-6 text-white" />
					</div>
				</div>
				<div class="mt-3 bg-purple-200 rounded-full h-2">
					<div 
						class="bg-purple-500 h-2 rounded-full transition-all duration-500" 
						style="width: {paymentCompletionRate}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Secondary Stats Row -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Payment Duration Stats -->
			<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex items-center gap-2 mb-4">
					<TrendingUp class="h-5 w-5 text-gray-600" />
					<h3 class="text-lg font-semibold text-gray-800">Payment Duration Distribution</h3>
				</div>
				
				{#if paymentDurations.length > 0}
					<div class="space-y-3">
						{#each paymentDurations as duration}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="w-3 h-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"></div>
									<span class="text-sm font-medium text-gray-700">{duration.duration}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-sm text-gray-600">{duration.count} drivers</span>
									<span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
										{duration.percentage}%
									</span>
								</div>
							</div>
							<div class="bg-gray-200 rounded-full h-1.5 ml-6">
								<div 
									class="bg-gradient-to-r from-indigo-400 to-indigo-600 h-1.5 rounded-full transition-all duration-500" 
									style="width: {duration.percentage}%"
								></div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 text-sm">No payment duration data available</p>
				{/if}
			</div>

			<!-- Top Cities -->
			<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<div class="flex items-center gap-2 mb-4">
					<MapPin class="h-5 w-5 text-gray-600" />
					<h3 class="text-lg font-semibold text-gray-800">Top Cities by Drivers</h3>
				</div>
				
				{#if topThreeCities.length > 0}
					<div class="space-y-4">
						{#each topThreeCities as city, index}
							{@const percentage = totalCityDrivers > 0 ? Math.round((city.count / totalCityDrivers) * 100) : 0}
							{@const colors = ['from-rose-400 to-rose-600', 'from-teal-400 to-teal-600', 'from-orange-400 to-orange-600']}
							{@const bgColors = ['bg-rose-100', 'bg-teal-100', 'bg-orange-100']}
							{@const textColors = ['text-rose-700', 'text-teal-700', 'text-orange-700']}
							
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="flex items-center justify-center w-8 h-8 {bgColors[index]} rounded-full">
										<span class="text-sm font-bold {textColors[index]}">{index + 1}</span>
									</div>
									<div>
										<p class="font-medium text-gray-800 capitalize">{city._id}</p>
										<p class="text-xs text-gray-500">{percentage}% of city drivers</p>
									</div>
								</div>
								<div class="text-right">
									<p class="text-lg font-bold text-gray-800">{city.count}</p>
									<p class="text-xs text-gray-500">drivers</p>
								</div>
							</div>
							<div class="bg-gray-200 rounded-full h-2">
								<div 
									class="bg-gradient-to-r {colors[index]} h-2 rounded-full transition-all duration-500" 
									style="width: {percentage}%"
								></div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 text-sm">No city data available</p>
				{/if}
			</div>
		</div>
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
				<a
					href="/dashboard/registration/payments"
					class="flex items-center gap-2 rounded-lg border border-green-700 px-4 py-2 text-md font-semibold text-white bg-green-500"
				>
					<CreditCard class="h-5 w-5" />
					<span>Payments</span>
				</a>
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