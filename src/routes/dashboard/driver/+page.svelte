<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		Download,
		Search,
		Users,
		FileCheck,
		Clock,
		XCircle,
		CheckCircle,
		AlertCircle
	} from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { goto } from '$app/navigation';
	import { cleaner } from './cleaner.js';
	import { downloadCSV } from '$lib/csv.js';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	let drivers = data.drivers;
	let currentPage = data.currentPage;
	let totalPages = data.totalPages;

	let verificationStats = data.verificationStats;
	let pendingDocumentVerifications = data.pendingDocumentVerifications;

	let headings: {
		title: string;
		className: string;
		key: string;
	}[] = [
		{ title: 'First Name', className: 'rounded-s-2xl', key: 'firstName' },
		{ title: 'Surname', className: '', key: 'surname' },
		{ title: 'Other Name', className: '', key: 'otherName' },
		{ title: 'Email', className: '', key: 'email' },
		{ title: 'Phone', className: '', key: 'phone' },
		{ title: 'Motorcycle Type', className: '', key: 'motorcycleType' },
		{ title: 'Document Status', className: '', key: 'documentStatus' },
		{ title: 'Motorcycle Number', className: '', key: 'motorcycleNumber' },
		{ title: 'Status', className: '', key: 'status' },
		{ title: 'Suspended', className: '', key: 'suspended' },
		{ title: 'Ride Preference', className: 'rounded-e-2xl', key: 'ridePreference' }
	];

	let searchTerm = $state('');

	let filteredDrivers = $derived(
		(() => {
			const q = searchTerm.toLowerCase();
			if (!q) return drivers;
			return drivers.filter(
				(d: any) =>
					d.firstName?.toLowerCase().includes(q) ||
					d.email?.toLowerCase().includes(q) ||
					d.packageName?.toLowerCase().includes(q) ||
					d.packageType?.toLowerCase().includes(q)
			);
		})()
	);

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.location.href = `?page=${page}`;
	}

	function handleDownload() {
		downloadCSV(headings, drivers, 'Driver.csv');
	}

	function getProgressPercentage(approved: number, total: number): number {
		return total > 0 ? Math.round((approved / total) * 100) : 0;
	}

	const pendingDocsCount = pendingDocumentVerifications?.length || 0;
</script>

<svelte:head>
	<title>Driver - Admin Panel</title>
</svelte:head>

<div>
	<div class="mx-auto w-388 p-20">
		<div class="rounded-xl bg-white p-6 shadow-lg">
			<h3 class="mb-6 text-xl font-semibold text-gray-800">Document Verification Status</h3>

			<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
				<div class="rounded-xl bg-linear-to-r from-blue-500 to-blue-600 p-6 text-white">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-blue-100">Total Drivers</p>
							<p class="text-3xl font-bold">{verificationStats.totalDrivers || 0}</p>
						</div>
						<Users class="h-12 w-12 text-blue-200" />
					</div>
				</div>

				<div class="rounded-xl bg-linear-to-r from-green-500 to-green-600 p-6 text-white">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-green-100">Approved</p>
							<p class="text-3xl font-bold">{verificationStats.documentStats?.approved || 0}</p>
						</div>
						<CheckCircle class="h-12 w-12 text-green-200" />
					</div>
				</div>

				<div class="rounded-xl bg-linear-to-r from-yellow-500 to-yellow-600 p-6 text-white">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-yellow-100">Pending</p>
							<p class="text-3xl font-bold">{verificationStats.documentStats?.pending || 0}</p>
						</div>
						<Clock class="h-12 w-12 text-yellow-200" />
					</div>
				</div>

				<div class="rounded-xl bg-linear-to-r from-red-500 to-red-600 p-6 text-white">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-red-100">Incomplete</p>
							<p class="text-3xl font-bold">{verificationStats.documentStats?.incomplete || 0}</p>
						</div>
						<XCircle class="h-12 w-12 text-red-200" />
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Object.entries(verificationStats.byDocumentType || {}) as [docType, stats]}
					{@const docStats = stats}
					{@const approvalRate = getProgressPercentage(
						verificationStats.documentStats.approved,
						verificationStats.documentStats.total
					)}
					<div class="rounded-lg border border-gray-200 p-4">
						<div class="mb-3 flex items-center justify-between">
							<h4 class="font-medium text-gray-700 capitalize">
								{docType.replace(/([A-Z])/g, ' $1').trim()}
							</h4>
							<span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
								{verificationStats.documentStats.total} total
							</span>
						</div>

						<div class="mb-3">
							<div class="mb-1 flex justify-between text-sm">
								<span class="text-gray-600">Approval Rate</span>
								<span class="font-medium text-gray-800">{approvalRate}%</span>
							</div>
							<div class="h-2 w-full rounded-full bg-gray-200">
								<div
									class="h-2 rounded-full bg-linear-to-r from-green-400 to-green-500"
									style="width: {approvalRate}%"
								></div>
							</div>
						</div>

						<div class="grid grid-cols-3 gap-2 text-xs">
							<div class="text-center">
								<div class="font-medium text-green-600">
									{verificationStats.documentStats.approved}
								</div>
								<div class="text-gray-500">Approved</div>
							</div>
							<div class="text-center">
								<div class="font-medium text-yellow-600">
									{verificationStats.documentStats.pending}
								</div>
								<div class="text-gray-500">Pending</div>
							</div>
							<div class="text-center">
								<div class="font-medium text-red-600">
									{verificationStats.documentStats.rejected}
								</div>
								<div class="text-gray-500">Rejected</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mx-auto mb-12 w-388 rounded-lg bg-white">
		<div class="mt-4 flex flex-row items-center justify-between px-20 py-6">
			<h3 class="text-2xl">Driver Management</h3>
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
							bind:value={searchTerm}
							class="block w-fit max-w-52 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Search"
							required
						/>
					</div>
				</form>

				<a
					href="/dashboard/driver/pending-documents"
					class="ml-5 flex items-center gap-2 rounded-lg border border-orange-500 bg-orange-50 px-4 py-3 text-orange-800 transition-colors hover:bg-orange-100"
					class:animate-pulse={pendingDocsCount > 0}
				>
					<AlertCircle class="h-5 w-5" />
					<span>Pending Docs</span>
					{#if pendingDocsCount > 0}
						<span
							class="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white"
						>
							{pendingDocsCount}
						</span>
					{/if}
				</a>

				<button
					onclick={handleDownload}
					class="flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-3 text-gray-800"
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
