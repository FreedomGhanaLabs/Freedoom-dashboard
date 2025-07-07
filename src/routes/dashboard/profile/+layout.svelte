<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	type DriverProfile = {
		name: string;
		phone: string;
		email: string;
		location: string;
		image: string;
		totalRides: number;
		earnings: number;
		rating: number;
		completionRate: number;
	};

	let driver: DriverProfile = {
		name: 'Kwame Asante',
		phone: '+233 54 123 4567',
		email: 'kwame.asante@email.com',
		location: 'East Legon, Accra',
		image: '/profile.jpg',
		totalRides: 150,
		earnings: 2500,
		rating: 4.9,
		completionRate: 95
	};
</script>

<div class="space-y-6 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Driver Profile</h1>
		<div class="flex space-x-2">
			<button class="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">
				Edit Profile
			</button>
			<button class="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
				Suspend Driver
			</button>
		</div>
	</div>

	<div
		class="flex flex-col items-start gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
	>
		<!-- Profile & Info -->
		<div class="flex items-start space-x-4">
			<img src={driver.image} alt="Driver" class="h-20 w-20 rounded-full object-cover" />
			<div class="space-y-1">
				<div class="flex items-center space-x-2">
					<h2 class="text-lg font-semibold">{driver.name}</h2>
					<span class="inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
						Verified
					</span>
				</div>
				<p class="text-sm text-gray-600">{driver.phone}</p>
				<p class="text-sm text-gray-600">{driver.email}</p>
				<p class="text-sm text-gray-600">{driver.location}</p>
			</div>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div class="rounded-lg bg-gray-50 p-4 text-center">
				<p class="text-xs text-gray-500">Total Rides</p>
				<p class="text-xl font-bold">{driver.totalRides}</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-4 text-center">
				<p class="text-xs text-gray-500">Earnings</p>
				<p class="text-xl font-bold">GHS {driver.earnings}</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-4 text-center">
				<p class="text-xs text-gray-500">Rating</p>
				<p class="text-xl font-bold">{driver.rating}</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-4 text-center">
				<p class="text-xs text-gray-500">Completion Rate</p>
				<p class="text-xl font-bold">{driver.completionRate}%</p>
			</div>
		</div>
	</div>

	<!-- Navigation Tabs -->
	<nav class="flex space-x-6 border-b pb-2 text-sm">
		<a href="#" class="font-semibold text-gray-900 hover:text-black">Overview</a>
		<a href="#" class="text-gray-500 hover:text-gray-900">Vehicle information</a>
		<a href="#" class="text-gray-500 hover:text-gray-900">Documents</a>
		<a href="#" class="text-gray-500 hover:text-gray-900">Recent Activity</a>
	</nav>

	<!-- Active Tab Content -->
	<div class="p-4">
		<p class="text-sm text-gray-600">Overview content goes here.</p>
	</div>
</div>

{@render children()}
