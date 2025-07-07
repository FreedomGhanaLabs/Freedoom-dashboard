

<script lang="ts">
	import type { PageData } from './$types';
	import Driver from '$lib/assets/driver.png';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import Histroy from '$lib/components/blocks/Histroy.svelte';
	import Rewards from '$lib/components/blocks/Rewards.svelte';
	import Preference from '$lib/components/blocks/Preference.svelte';
	import Security from '$lib/components/blocks/Security.svelte';
	import {
		Phone,
		Mail,
		MapPin,
		BadgeCheck,
		ArrowLeft,
		ChevronRight,
		ChevronLeft,
		Clock,
		ScrollText,
		Languages
	} from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import { BadgeCent, Banknote, ChartArea, ClockArrowUp, Cloud, HandCoins, LandPlot, MapPinCheck, MapPinPlus, PackageCheck, PiggyBank, TrendingUp } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let selectedTab = $state('profile');

	// Helper function to format rating stars
	function getStarRating(rating: number) {
		return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
	}

	// Helper function to format date
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formaDate(dateString: string) {
		if (!dateString) return '';
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${day}/${month}/${year} ${hours}:${minutes}`;
	}
</script>


<div class="container mx-auto mb-20 w-280 p-6">
	<!-- Header Navigation -->
	<div class="mb-4 flex items-center">
		<a
			href="/dashboard/ride"
			class="{buttonVariants({
				variant: 'ghost'
			})} flex items-center gap-2 text-orange-500 hover:text-orange-700"
			><ArrowLeft class="size-4" /> Back</a
		>
		<div class="ml-2 flex space-x-2">
			<button onclick={() => window.history.back()} class="text-gray-500 hover:text-gray-700"
				><ChevronLeft class="size-4" /></button
			>
			<button onclick={() => window.history.forward()} class="text-gray-500 hover:text-gray-700"
				><ChevronRight class="size-4" /></button
			>
		</div>
	</div>

	<h1 class="mb-4 text-2xl font-bold">Rider Profile</h1>

	<!-- Profile Header -->
	<div class="mb-6 h-48 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
		<div class="flex items-center">
			<div class="ml-4 flex flex-col items-center justify-center text-center">
				<img src={Driver} alt="Rider Profile" class="size-20 rounded-full" />
				<p class="mt-2 flex items-center rounded-lg bg-green-300/30 px-2 py-1 text-black">
					<span class="mr-1"><BadgeCheck class="size-4" /></span> Verified
				</p>
				<div class="flex items-center text-gray-600">
					<span class="mr-1">★</span>
					{data.ride?.userRating?.rating || 'N/A'}
				</div>
			</div>
			<div class="ml-10 space-y-3">
				<div class="flex space-x-3">
					<h2 class="text-[1.7rem] text-lg font-normal">
						{data.ride?.user?.email?.split('@')[0] || 'Rider'}
					</h2>
					<span class="mt-[0.2rem] text-[0.9rem] text-[#EA9300]">
						#{data.ride?.user?.id?.slice(-8) || data.id}
					</span>
				</div>

				<div class="flex flex-row">
					<span><Phone class="size-5" /></span>
					<p class="ml-2 text-gray-600">
						{data.ride?.user?.phone || 'N/A'}
					</p>
				</div>
				<div class="flex flex-row">
					<span><Mail /></span>
					<p class="ml-2 text-gray-600">
						{data.ride?.user?.email || 'N/A'}
					</p>
				</div>
				<div class="flex flex-row">
					<span><MapPin /></span>
					<p class="ml-2 text-gray-600">
						{data.ride?.pickupLocation?.address || 'N/A'}
					</p>
				</div>
			</div>
			<!-- <div class="mb-22 ml-auto flex space-x-2 text-[1.2rem]">
				<button class="rounded-lg bg-[#180F00] px-4 py-2 text-white">Edit Profile</button>
				<button class="rounded-lg border px-4 py-2 text-gray-800 shadow-inner"
					>Contact Support</button
				>
			</div> -->
		</div>
	</div>

	<!-- Ride Summary Card -->
	{#if data.ride}
		<div class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
			<h3 class="mb-4 text-lg font-semibold">Recent Ride Details</h3>
			<div class="grid grid-cols-3 gap-6">
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Ride Status</p>
					<p class="font-medium capitalize">
						<span
							class="mr-2 inline-block h-2 w-2 rounded-full {data.ride.status === 'completed'
								? 'bg-green-500'
								: 'bg-yellow-500'}"
						></span>
						{data.ride.status}
					</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Distance</p>
					<p class="font-medium">{data.ride.estimatedDistance?.text || 'N/A'}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Total Fare</p>
					<p class="font-medium">{data.ride.currency} {data.ride.totalFare}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Payment Method</p>
					<p class="font-medium capitalize">{data.ride.paymentMethod}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Ride Date</p>
					<p class="font-medium">{formatDate(data.ride.requestedAt)}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Driver Rating</p>
					<p class="font-medium">
						{data.ride.userRating?.rating || 'Not rated'}
						{#if data.ride.userRating?.rating}
							<span class="text-yellow-500">★</span>
						{/if}
					</p>
				</div>
			</div>

			{#if data.ride.userRating?.comment}
				<div class="mt-4 border-t pt-4">
					<p class="text-sm text-gray-500">Rider Comment</p>
					<p class="mt-1 italic">"{data.ride.userRating.comment}"</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Driver Information Card -->
	{#if data.ride?.driver}
		<div class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
			<h3 class="mb-4 text-lg font-semibold">Driver Information</h3>
			<div class="grid grid-cols-2 gap-6">
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Driver Email</p>
					<p class="font-medium">{data.ride.driver.email}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Driver Phone</p>
					<p class="font-medium">{data.ride.driver.phone}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Motorcycle Type</p>
					<p class="font-medium">{data.ride.driver.motorcycleType}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Motorcycle Colour</p>
					<p class="font-medium">{data.ride.driver.motorcycleColor}</p>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-gray-500">Motorcycle Number</p>
					<p class="font-medium">{data.ride.driver.motorcycleNumber}</p>
				</div>
			</div>
		</div>
	{/if}

	<Tabs.Root value="profile" onValueChange={(v) => (selectedTab = v)}>
		<Tabs.List
			class="flex h-20 w-200 items-center space-x-8 rounded-xl border bg-white"
		>
			<Tabs.Trigger value="profile">Ride Information</Tabs.Trigger>
			<Tabs.Trigger value="rewards">Payment Information</Tabs.Trigger>
		</Tabs.List>
		<div class="mt-6 space-y-4">
			<Tabs.Content value="profile">
				<div class="container -mx-6 w-280 p-6">
					<!-- Personal Information -->
					<div class="-mt-8 h-120 w-200 rounded-xl border bg-white text-[1.3rem]">
						<h3 class="ml-8 mt-5 text-[1.6rem] font-semibold">Ride Information</h3>
						<div class="mt-3 grid grid-cols-4 gap-10 px-8 text-[0.9rem]">
							<div class="rounded-xl border border-gray-200 bg-white p-4">
								<p>Order time</p>
								<p class="">{formaDate(data.ride.requestedAt)}</p>
							</div>
							<div class="rounded-xl border border-gray-200 bg-white p-4">
								<p>Accepted at</p>
								<p class="">{formaDate(data.ride.acceptedAt)}</p>
							</div>
							<div class="rounded-xl border border-gray-200 bg-white p-4">
								<p>Started</p>
								<p class="">{formaDate(data.ride.startedAt)}</p>
							</div>
							<div class="rounded-xl border border-gray-200 bg-white p-4">
								<p>Completed at</p>
								<p class="">{formaDate(data.ride.completedAt)}</p>
							</div>
						</div>
            
						<div class="mt-3 grid grid-cols-2 gap-10 px-8">
							<div class="space-y-4 rounded-xl">
								<p class="mb-3 flex items-center text-left text-gray-800">
									<MapPinPlus class="mr-2 size-4" />Pick Up Location
								</p>
								<span class="rounded-lg bg-blue-400 px-2 py-2"
									>{data.ride.pickupLocation.address}</span
								>
							</div>
							<div class="space-y-4 rounded-xl">
								<p class="mb-3 flex items-center text-left text-gray-800">
									<MapPinCheck class="mr-2 size-4" />Drop off Location
								</p>
								<span class="rounded-lg bg-green-400 px-2 py-2"
									>{data.ride.dropoffLocation.address}</span
								>
							</div>
						</div>

						<!-- Preferred Locations -->
						<div class="ml-8 mt-5">
							<h3 class="mb-10 text-lg font-semibold">Other Information</h3>
							<div
								class="flex h-14 w-[18rem] flex-col justify-center gap-3 rounded-lg p-2 text-[1rem]"
							>
                            
								<p class="flex space-x-2">
									<LandPlot class="mr-2 size-4" /> Estimated Distance :
									<span>{data.ride.estimatedDistance.text}</span>
								</p>
								<p class="flex space-x-2">
									<ClockArrowUp class="mr-2 size-4" /> Estimated Duration :
									<span>{data.ride.estimatedDuration.text}</span>
								</p>
								<p class="mb-6 flex space-x-2">
									<Cloud class="mr-2 size-4" /> Weather :
									<span>{data.ride.weatherConditions.temperature}:°C</span>
								</p>
							</div>
						</div>
						<div class="mt-4 px-4">
							<hr class="my-4" />

							<!-- Additional Metadata -->
							<div class="mt-4 grid grid-cols-2 gap-4 px-10 text-[1rem]">
								<div>
									<span class="block text-gray-500">Multi-Stop?</span>
									<span class="font-medium">{data.ride.isMultiStop ? 'Yes' : 'No'}</span>
								</div>
								<div>
									<span class="block text-gray-500">Waiting Time</span>
									<span class="font-medium">{data.ride.waitingTime} mins</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Tabs.Content>

			<Tabs.Content value="rewards">
				<div class="max-w-200 rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-4 text-xl font-semibold text-gray-800">Fare Summary</h2>

					<div class="grid grid-cols-2 gap-4 text-[1rem] text-gray-700">
						<!-- Fare Breakdown -->
						<div>
							<h3 class="mb-2 font-semibold text-gray-900">Breakdown</h3>
							<ul class="space-y-4">
								<li class="flex">
									<ChartArea /><span class="text-gray-600 ml-2">Base Fare:</span>
									{data.ride.currency}
									{data.ride.baseFare.toFixed(2)}
								</li>
                              
								<li class="flex">
									  <Banknote /><span class="text-gray-600 ml-2">Distance Fare:</span>
									{data.ride.currency}
									{data.ride.distanceFare.toFixed(2)}
								</li>
								<li class="flex">
                                    <ClockArrowUp />
									<span class="text-gray-600 ml-2">Time Fare:</span>
									{data.ride.currency}
									{data.ride.timeFare.toFixed(2)}
								</li>
								<li class="flex">
                                    <MapPin />
									<span class="text-gray-600 ml-2">Multi-Stop Fare:</span>
									{data.ride.currency}
									{data.ride.multiStopFare.toFixed(2)}
								</li>
								<li class="flex">
                                    <Clock />
									<span class="text-gray-600 ml-2">Waiting Time Fare:</span>
									{data.ride.currency}
									{data.ride.waitingTimeFare.toFixed(2)}
								</li>
								<li class="flex">
                                    <BadgeCent />
									<span class="text-gray-600 ml-2">Discount:</span>
									{data.ride.currency}
									{data.ride.discount.toFixed(2)}
								</li>
							</ul>
						</div>

						<!-- Totals -->
						<div class="text-[1rem]">
							<h3 class="mb-2 font-semibold text-gray-900">Total & Earnings</h3>
							<ul class="space-y-4">
                                <li class="flex">
                                    <TrendingUp />
									<span class="text-gray-500 ml-2">Surge Multiplier:</span> ×{data.ride.surgeMultiplier}
								</li>								
								<li class="flex">
                                    <PiggyBank />
									<span class="text-gray-500 ml-2">Driver Earnings:</span>
									{data.ride.currency}
									{data.ride.driverEarnings.toFixed(2)}
								</li>
								<li class="flex">
                                    <HandCoins />
									<span class="text-gray-500 ml-2">Platform Commission:</span>
									{data.ride.currency}
									{data.ride.platformCommission.toFixed(2)}
								</li>
								<li class="flex">
                                    <PackageCheck />
									<span class="text-gray-500 ml-2">Total Fare:</span>
									{data.ride.currency}
									{data.ride.totalFare.toFixed(2)}
								</li>
							</ul>
						</div>
					</div>

					<hr class="my-4" />

					<!-- Meta Info -->
					<div class="grid grid-cols-3 gap-4 text-sm">
						<div>
							<span class="block text-gray-500">Demand Level</span>
							<span class="font-medium capitalize">{data.ride.demandLevel}</span>
						</div>
						<div>
							<span class="block text-gray-500">Ride Status</span>
							<span class="font-medium capitalize">{data.ride.status}</span>
						</div>
						<div>
							<span class="block text-gray-500">Payment</span>
							<span class="font-medium capitalize"
								>{data.ride.paymentMethod} ({data.ride.paymentStatus})</span
							>
						</div>
					</div>
				</div>
			</Tabs.Content>
			<!-- <Tabs.Content value="preference">
				<Preference {data} />
			</Tabs.Content>
			<Tabs.Content value="security">
				<Security {data} />
			</Tabs.Content> -->
		</div>
	</Tabs.Root>
</div>
