<script lang="ts">
	import { Download, Search, TrendingUp, CreditCard, Clock, DollarSign } from 'lucide-svelte';
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

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount);
	}

	function formatMonth(monthObj: any): string {
		if (monthObj && monthObj.month && monthObj.year) {
			const date = new Date(monthObj.year, monthObj.month - 1);
			return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
		}
		return 'Current Month';
	}

	let { payments, pagination, currentPage, stats } = data;

	// Add fallback for stats in case it's undefined
	if (!stats) {
		stats = {
			totalPayments: 0,
			totalAmount: 0,
			recentPayments: 0,
			latePayments: 0,
			paymentMethodStats: [],
			monthlyStats: []
		};
	}

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
	<title>Payment - Admin Panel</title>
</svelte:head>

<div class="mx-auto">
	<!-- Statistics Cards Section -->
	<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
		<!-- Total Payments Card -->
		<div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
			<div class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-500/10 transition-all duration-300 group-hover:bg-blue-500/20"></div>
			<div class="relative z-10 flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-blue-600">Total Payments</p>
					<p class="mt-2 text-3xl font-bold text-gray-900">{stats.totalPayments.toLocaleString()}</p>
					<div class="mt-2 flex items-center text-sm text-green-600">
						<TrendingUp class="mr-1 h-4 w-4" />
						<span>Active</span>
					</div>
				</div>
				<div class="rounded-xl bg-blue-500/20 p-3">
					<CreditCard class="h-6 w-6 text-blue-600" />
				</div>
			</div>
		</div>

		<!-- Total Amount Card -->
		<div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
			<div class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-500/10 transition-all duration-300 group-hover:bg-emerald-500/20"></div>
			<div class="relative z-10 flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-emerald-600">Total Revenue</p>
					<p class="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
					<div class="mt-2 flex items-center text-sm text-green-600">
						<TrendingUp class="mr-1 h-4 w-4" />
						<span>Growing</span>
					</div>
				</div>
				<div class="rounded-xl bg-emerald-500/20 p-3">
					<DollarSign class="h-6 w-6 text-emerald-600" />
				</div>
			</div>
		</div>

		<!-- Recent Payments Card -->
		<div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
			<div class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-500/10 transition-all duration-300 group-hover:bg-purple-500/20"></div>
			<div class="relative z-10 flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-purple-600">Recent Payments</p>
					<p class="mt-2 text-3xl font-bold text-gray-900">{stats.recentPayments.toLocaleString()}</p>
					<div class="mt-2 flex items-center text-sm text-blue-600">
						<Clock class="mr-1 h-4 w-4" />
						<span>This period</span>
					</div>
				</div>
				<div class="rounded-xl bg-purple-500/20 p-3">
					<TrendingUp class="h-6 w-6 text-purple-600" />
				</div>
			</div>
		</div>

		<!-- Late Payments Card -->
		<div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
			<div class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-orange-500/10 transition-all duration-300 group-hover:bg-orange-500/20"></div>
			<div class="relative z-10 flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-orange-600">Late Payments</p>
					<p class="mt-2 text-3xl font-bold text-gray-900">{stats.latePayments.toLocaleString()}</p>
					<div class="mt-2 flex items-center text-sm {stats.latePayments === 0 ? 'text-green-600' : 'text-red-600'}">
						<Clock class="mr-1 h-4 w-4" />
						<span>{stats.latePayments === 0 ? 'All on time' : 'Needs attention'}</span>
					</div>
				</div>
				<div class="rounded-xl bg-orange-500/20 p-3">
					<Clock class="h-6 w-6 text-orange-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Payment Method & Monthly Stats -->
	<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Payment Methods Card -->
		<div class="rounded-2xl bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Payment Methods</h3>
			<div class="space-y-3">
				{#each stats.paymentMethodStats || [] as method}
					<div class="flex items-center justify-between rounded-xl bg-gray-50 p-4">
						<div class="flex items-center space-x-3">
							<div class="h-3 w-3 rounded-full bg-blue-500"></div>
							<span class="font-medium capitalize text-gray-700">
								{method.id ? method.id.toString().replace(/_/g, ' ') : 'Unknown Method'}
							</span>
						</div>
						<div class="text-right">
							<p class="font-semibold text-gray-900">{method.count || 0} payments</p>
							<p class="text-sm text-gray-500">{formatCurrency(method.totalAmount || 0)}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Monthly Stats Card -->
		<div class="rounded-2xl bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Monthly Overview</h3>
			<div class="space-y-3">
				{#each stats.monthlyStats as month}
					<div class="flex items-center justify-between rounded-xl bg-gray-50 p-4">
						<div class="flex items-center space-x-3">
							<div class="h-3 w-3 rounded-full bg-emerald-500"></div>
							<span class="font-medium text-gray-700">{formatMonth(month._id)}</span>
						</div>
						<div class="text-right">
							<p class="font-semibold text-gray-900">{month.count} payments</p>
							<p class="text-sm text-gray-500">{formatCurrency(month.totalAmount)}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Payment Logs Table -->
	<div class="w-388 rounded-2xl bg-white shadow-lg">
		<div class="flex items-center justify-between px-8 py-6">
			<h3 class="text-2xl font-bold text-gray-900">Payment Logs</h3>
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
							class="block w-fit max-w-52 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="Search payments..."
							required
						/>
					</div>
				</form>
				<button
					onclick={handleDownload}
					class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
				>
					<Download class="h-5 w-5" />
					<span>Download CSV</span>
				</button>
			</div>
		</div>

		<TableGroup {headings} invoices={filteredActivity} />

		<div class="flex items-center justify-between px-8 py-6">
			<p class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
				Page {currentPage} of {pagination.pages}
			</p>

			<nav class="inline-flex items-center space-x-1 rounded-md border border-gray-200 bg-white px-2 py-2 shadow-sm">
				<button
					onclick={() => goToPage(currentPage - 1)}
					class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
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
						class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 {page === currentPage
							? 'bg-blue-500 text-white hover:bg-blue-600'
							: 'text-gray-700'}"
						onclick={() => goToPage(page)}
					>
						{page}
					</button>
				{/each}

				<button
					onclick={() => goToPage(currentPage + 1)}
					class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
					disabled={currentPage === pagination.pages}
				>
					Next →
				</button>
			</nav>
		</div>
	</div>
</div>