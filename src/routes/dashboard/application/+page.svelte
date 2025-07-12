<script lang="ts">
	import type { PageData } from './$types';
	import { type Application } from '$lib/application';
	import { Download, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';

	const { data } = $props<{ data: PageData }>();

	function formatToTwoDecimal(value: number): string {
		return value.toFixed(2);
	}
	let deliveries = data.deliveries;

	let formattedDeliveries = deliveries.map((d: Application) => ({
		...d,
		dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth).toLocaleDateString() : '-',
		submittedAt: d.submittedAt ? new Date(d.submittedAt).toLocaleDateString() : '-',
		status: d.status || 'N/A',
		hasMotorbike: d.hasMotorbike ? 'Yes' : 'No',
	}));

	
	let headings: {
		title: string;
		className: string;
		key: keyof Application;
	}[] = [
		{ title: 'First Name', className: 'rounded-s-2xl', key: 'firstName' },
		{ title: 'Last Name', className: '', key: 'lastName' },
		{ title: 'Email', className: '', key: 'email' },
		{ title: 'Phone', className: '', key: 'phone' },
		{ title: 'D.O.B', className: '', key: 'dateOfBirth' },
		{ title: 'Gender', className: '', key: 'gender' },
		{ title: 'Address', className: '', key: 'address' },
		{ title: 'City', className: '', key: 'city' },
		{ title: 'Work Model', className: '', key: 'workingModel' },
		{ title: 'Work Hours', className: '', key: 'preferredWorkingHours' },
		{ title: 'Has Bike', className: '', key: 'hasMotorbike' },
        { title: 'License No.', className: '', key: 'licenseNumber' },
         { title: 'Status', className: '', key: 'status' },
		{ title: 'Subimission Date', className: 'rounded-e-2xl', key: 'submittedAt' }
	];

	
	let searchQuery = '';

	let filteredDeliveryReport = searchQuery
		? formattedDeliveries.filter((d: any) => {
				const q = searchQuery.toLowerCase();
				return (
					d.firstName?.toLowerCase().includes(q) ||
					d.lastName?.toLowerCase().includes(q) ||
					d.email?.toLowerCase().includes(q) 
				);
			})
		: formattedDeliveries;

	// --- CSV download logic ---
	function handleDownload() {
		// `$filteredRides` is the unwrapped array here
		downloadCSV(headings, formattedDeliveries, 'Application.csv');
	}
</script>

<svelte:head>
	<title>Deliveries - Admin Panel</title>
</svelte:head>

<!-- Finance Report Table with Filtering and Searching -->
<section class="mx-auto my-12 w-388 rounded-lg bg-white">
	<div class="space mb-4 flex items-center px-12">
		<h3 class="p-10 text-[2rem]">Application Report</h3>

		<!-- Search Input -->
		<div class="relative ml-auto">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search by reference"
				class="w-64 rounded border p-3 pl-8"
			/>
			<Search class="absolute top-1/2 left-2 -translate-y-1/2 transform" size={16} />
		</div>
		<button
			onclick={handleDownload}
			class="ml-5 flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-3 text-gray-800"
		>
			<!-- You can swap in any icon here -->
			<Download class="h-5 w-5" />
			<span>Download CSV</span>
		</button>
	</div>
	<div class="px-8">
		<TableGroup {headings} invoices={filteredDeliveryReport} />
	</div>
</section>
