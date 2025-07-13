<script lang="ts">
	import type { PageData } from './$types';
	import { type Application } from '$lib/application';
	import { Download, Search, Users, FileText, CheckCircle, MapPin, Building, Home } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import { MailPlus } from '@lucide/svelte';

	const { data } = $props<{ data: PageData }>();

	function formatToTwoDecimal(value: number): string {
		return value.toFixed(2);
	}
	
	const stats = data.stats;
	
	function getCountById(array: any[], id: string): number {
		const item = array.find(item => item._id === id);
		return item ? item.count : 0;
	}
	
	function getPercentage(value: number, total: number): number {
		return total > 0 ? (value / total) * 100 : 0;
	}
	
	let application = data.application;

	let formattedApplication = application.map((d: Application) => ({
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
		? formattedApplication.filter((d: any) => {
				const q = searchQuery.toLowerCase();
				return (
					d.firstName?.toLowerCase().includes(q) ||
					d.lastName?.toLowerCase().includes(q) ||
					d.email?.toLowerCase().includes(q) 
				);
			})
		: formattedApplication;

	function handleDownload() {
		downloadCSV(headings, formattedApplication, 'Application.csv');
	}
</script>

<svelte:head>
	<title>Deliveries - Admin Panel</title>
</svelte:head>

<section class="mx-auto my-8 w-388">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Total Applications</p>
					<p class="text-2xl font-bold text-gray-900">{stats.totalApplications || 0}</p>
				</div>
				<div class="p-3 bg-blue-50 rounded-lg">
					<FileText class="h-6 w-6 text-blue-600" />
				</div>
			</div>
		</div>

		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Recent Applications</p>
					<p class="text-2xl font-bold text-gray-900">{stats.recentApplications || 0}</p>
				</div>
				<div class="p-3 bg-green-50 rounded-lg">
					<Users class="h-6 w-6 text-green-600" />
				</div>
			</div>
		</div>

		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Approved</p>
					<p class="text-2xl font-bold text-gray-900">{getCountById(stats.statusStats || [], 'approved')}</p>
				</div>
				<div class="p-3 bg-green-50 rounded-lg">
					<CheckCircle class="h-6 w-6 text-green-600" />
				</div>
			</div>
		</div>

		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Pending</p>
					<p class="text-2xl font-bold text-gray-900">{getCountById(stats.statusStats || [], 'pending')}</p>
				</div>
				<div class="p-3 bg-yellow-50 rounded-lg">
					<FileText class="h-6 w-6 text-yellow-600" />
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
			<div class="space-y-4">
				{#each stats.statusStats || [] as status}
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<div class="w-3 h-3 rounded-full mr-3 {status._id === 'approved' ? 'bg-green-500' : status._id === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'}"></div>
							<span class="text-sm font-medium text-gray-700 capitalize">{status._id.replace('-', ' ')}</span>
						</div>
						<div class="text-right">
							<span class="text-sm font-semibold text-gray-900">{status.count}</span>
							<span class="text-xs text-gray-500 ml-1">({formatToTwoDecimal(getPercentage(status.count, stats.totalApplications || 1))}%)</span>
						</div>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-2">
						<div 
							class="h-2 rounded-full {status._id === 'approved' ? 'bg-green-500' : status._id === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'}"
							style="width: {getPercentage(status.count, stats.totalApplications || 1)}%"
						></div>
					</div>
				{/each}
			</div>
		</div>

		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Working Model Distribution</h3>
			<div class="space-y-4">
				{#each stats.workingModelStats || [] as model}
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<div class="p-2 bg-gray-50 rounded-lg mr-3">
								{#if model._id === 'in-house'}
									<Building class="h-4 w-4 text-gray-600" />
								{:else}
									<Home class="h-4 w-4 text-gray-600" />
								{/if}
							</div>
							<span class="text-sm font-medium text-gray-700 capitalize">{model._id.replace('-', ' ')}</span>
						</div>
						<div class="text-right">
							<span class="text-sm font-semibold text-gray-900">{model.count}</span>
							<span class="text-xs text-gray-500 ml-1">({formatToTwoDecimal(getPercentage(model.count, stats.totalApplications || 1))}%)</span>
						</div>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-2">
						<div 
							class="h-2 rounded-full {model._id === 'in-house' ? 'bg-purple-500' : 'bg-indigo-500'}"
							style="width: {getPercentage(model.count, stats.totalApplications || 1)}%"
						></div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each stats.topCities || [] as city}
				<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div class="flex items-center">
						<div class="p-2 bg-blue-50 rounded-lg mr-3">
							<MapPin class="h-4 w-4 text-blue-600" />
						</div>
						<span class="text-sm font-medium text-gray-700">{city._id}</span>
					</div>
					<div class="text-right">
						<span class="text-sm font-semibold text-gray-900">{city.count}</span>
						<span class="text-xs text-gray-500 ml-1">applications</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto my-12 w-388 rounded-lg bg-white">
	<div class="space mb-4 flex items-center px-12">
		<h3 class="p-10 text-[2rem]">Application Report</h3>

		<div class="relative ml-auto">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search by reference"
				class="w-64 rounded border p-3 pl-8"
			/>
			<Search class="absolute top-1/2 left-2 -translate-y-1/2 transform" size={16} />
		</div>
		<a
			href="/dashboard/application/bulk"
			class="ml-5 flex items-center gap-2 bg-green-600 rounded-lg border border-green-700 px-4 py-3 text-white"
		>
			<MailPlus class="h-5 w-5" />
			<span>Send Bulk Interview</span>
		</a>
		<button
			onclick={handleDownload}
			class="ml-5 flex items-center gap-2 rounded-lg border border-gray-500 px-4 py-3 text-gray-800"
		>
			<Download class="h-5 w-5" />
			<span>Download CSV</span>
		</button>
	</div>
	<div class="px-8">
		<TableGroup {headings} invoices={filteredDeliveryReport} />
	</div>
</section>