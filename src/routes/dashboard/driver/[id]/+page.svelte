<script lang="ts">
	import type { PageData } from './$types';
	import Driver from '$lib/assets/driver.png';
	import {
		Phone,
		Mail,
		MapPin,
		BadgeCheck,
		Bike,
		Banknote,
		Star,
		PartyPopper,
		Shield,
		Calendar,
		Truck,
		Clock
	} from 'lucide-svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Bed, Bell } from '@lucide/svelte';

	export let data: PageData;

	let selectedTab = 'overview';

	let showDeleteDialog = false;
	

	
	const driver = data?.driver || {};

	function formatDate(dateString: string | number | Date) {
		try {
			const date = new Date(dateString);
			return date.toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			});
		} catch {
			return 'N/A';
		}
	}

	function formatLastActive(dateString: string | number | Date) {
		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

			if (diffInHours < 24) {
				return `${diffInHours} hours ago`;
			} else {
				const diffInDays = Math.floor(diffInHours / 24);
				return `${diffInDays} days ago`;
			}
		} catch {
			return 'N/A';
		}
	}

	function getStatusColor(status: any) {
		switch (status) {
			case 'available':
				return 'bg-green-300/30 text-green-800';
			case 'busy':
				return 'bg-yellow-300/30 text-yellow-800';
			case 'offline':
				return 'bg-gray-300/30 text-gray-800';
			default:
				return 'bg-gray-300/30 text-gray-800';
		}
	}

	$: firstName = driver.firstName || 'N/A';
	$: surname = driver.surname || '';
	$: otherName = driver.otherName || '';
	$: email = driver.email || 'N/A';
	$: phone = driver.phone || 'N/A';
	$: isVerified = driver.isVerified || false;
	$: ratings = driver.ratings || 0;
	$: numOfReviews = driver.numOfReviews || 0;
	$: status = driver.status || 'offline';
	$: suspended = driver.suspended || false;
	$: documentStatus = driver.documentStatus || 'pending';
	$: rideHistory = driver.rideHistory || [];
	$: deliveryHistory = driver.deliveryHistory || [];
	$: address = driver.address || {};
	$: motorcycleType = driver.motorcycleType || 'N/A';
	$: motorcycleColor = driver.motorcycleColor || 'N/A';
	$: motorcycleNumber = driver.motorcycleNumber || 'N/A';
	$: motorcycleYear = driver.motorcycleYear || 'N/A';
	$: licenseNumber = driver.licenseNumber || 'N/A';
	$: ridePreference = driver.ridePreference || 'N/A';
	$: twoFactorEnabled = driver.twoFactorEnabled || false;
	$: insurance = driver.insurance || {};
	$: knownDevices = driver.knownDevices || [];
	$: createdAt = driver.createdAt || '';
	$: lastActiveAt = driver.lastActiveAt || '';
	$: role = driver.role || 'driver';
	$: pendingNameUpdate = driver.pendingNameUpdate || {};
	$: driverId = driver._id || data?.id || '';
	$: onlineHistory = driver.onlineHistory || [];
	$: startQuietHours = driver.notificationPreferences?.quietHours?.startTime || 'N/A';
	$: endQuietHours = driver.notificationPreferences?.quietHours?.endTime || 'N/A';
	$: quietHoursEnabled = driver.notificationPreferences?.quietHours?.enabled || false;
</script>

<div class="container mx-auto mb-20 w-280 p-6">
	
	<section class="mb-4 flex flex-row justify-between">
	<h1 class="mb-4 text-2xl font-bold">Driver Profile</h1>
	<div class="-ml-5 flex flex-row justify-end space-x-2">
		
		<button
			on:click={() => (showDeleteDialog = true)}
			class="btn btn-danger rounded-lg border border-red-700 bg-red-700 px-4 py-2 text-[1.2rem] text-white"
		>
			Delete Driver
		</button>

		{#if showDeleteDialog}
			<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
					<h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
					<p class="mb-6">Are you sure you want to delete this driver?</p>
					<div class="flex justify-end space-x-2">
						<button
							on:click={() => (showDeleteDialog = false)}
							class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
						>
							Cancel
						</button>
						<form method="post" action="?/delete">
							<button
								type="submit"
								class="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
							>
								Delete
							</button>
						</form>
					</div>
				</div>
			</div>
		{/if}

		<button
			class="rounded-lg border border-orange-400 bg-orange-500 px-4 py-2 text-[1.2rem] text-white"
		>
			{suspended ? 'Unsuspend Driver' : 'Suspend Driver'}
		</button>
	</div>
</section>

	<div class="mb-6 w-280 rounded-lg border border-gray-200 bg-white p-2 shadow-md">
		<div class="flex items-center justify-between">
			<div class="flex rounded-xl p-6">
				<div class="ml-4 flex flex-col items-center justify-center text-center">
					<img src={Driver} alt="{firstName} {surname}" class="size-20 rounded-full" />
					<p
						class="mt-2 flex items-center rounded-lg {isVerified
							? 'bg-green-300/30 text-green-800'
							: 'bg-red-300/30 text-red-800'} px-2 py-1"
					>
						<span class="mr-1"><BadgeCheck class="size-4" /></span>
						{isVerified ? 'Verified' : 'Unverified'}
					</p>
					<div class="flex items-center text-gray-600">
						<span class="mr-1">★</span>
						{ratings}
					</div>
					<p class="mt-1 text-sm text-gray-500">({numOfReviews} reviews)</p>
				</div>

				<div class="ml-6 space-y-3">
					<div class="flex space-x-3">
						<h2 class="text-[1.7rem] text-lg font-normal">
							{driver.firstName}
							{driver.surname}
							{driver.otherName}
						</h2>
						<span class="mt-[0.2rem] text-[0.9rem] text-[#EA9300]"
							>#{driverId.slice(-6).toUpperCase()}</span
						>
					</div>

					<div class="flex flex-row">
						<span><Phone class="size-5" /></span>
						<p class="ml-2 text-gray-600">{phone}</p>
					</div>
					<div class="flex flex-row">
						<span><Mail /></span>
						<p class="ml-2 text-gray-600">{email}</p>
					</div>
					<div class="flex flex-row">
						<span><MapPin /></span>
						<p class="ml-2 text-gray-600">
							{address.city || 'N/A'}, {address.state || ''}, {address.country || ''}
						</p>
					</div>

					<div class="flex flex-row items-center">
						<span class="mr-2 rounded-md p-1 {getStatusColor(status)}">
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</span>
						{#if lastActiveAt}
							<span class="text-sm text-gray-500">
								Last active: {formatLastActive(lastActiveAt)}
							</span>
						{/if}
					</div>
				
					{#if quietHoursEnabled}
						<div class="flex">
							<span class="flex text-gray-600"><Bed class="mr-2" />Quiet Hours</span>
							<span class="ml-4 font-normal">{startQuietHours} - {endQuietHours}</span>
						</div>
					{/if}
					{#if suspended}
						<p class="mt-2 text-sm text-red-600">This driver is currently suspended.</p>
					{/if}
				</div>
			</div>

			<div class="grid w-120 grid-cols-2 gap-4 p-2 text-black">
				<div class="rounded-lg bg-white p-3">
					<p class="flex items-center text-center text-sm">
						<span class="mr-2 rounded-md bg-[#F59E0B12]/10 p-1 text-orange-500"><Bike /></span>
						Total Rides
					</p>
					<p class="mt-3 text-[1.1rem] font-semibold">{rideHistory.length}</p>
				</div>
				<div class="rounded-lg bg-white p-3">
					<p class="flex items-center text-center text-sm">
						<span class="mr-2 rounded-md bg-[#F59E0B12]/10 p-1 text-orange-500"><Truck /></span>
						Deliveries
					</p>
					<p class="mt-3 text-[1.1rem] font-semibold">{deliveryHistory.length}</p>
				</div>
				<div class="rounded-lg bg-white p-3">
					<p class="flex items-center text-center text-sm">
						<span class="mr-2 rounded-md bg-[#F59E0B12]/10 p-1 text-orange-500"><Star /></span>
						Rating
					</p>
					<p class="mt-3 text-[1.1rem] font-semibold">{ratings}</p>
				</div>
				<div class="rounded-lg bg-white p-3">
					<p class="flex items-center text-center text-sm">
						<span class="mr-2 rounded-md bg-[#F59E0B12]/10 p-1 text-orange-500"><Shield /></span>
						Document Status
					</p>
					<p
						class="mt-3 text-[1.1rem] font-semibold {documentStatus === 'approved'
							? 'text-green-600'
							: 'text-orange-600'}"
					>
						{documentStatus.charAt(0).toUpperCase() + documentStatus.slice(1)}
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
		<h3 class="mb-4 flex items-center text-lg font-semibold">
			<Bike class="mr-2 text-orange-500" />
			Vehicle Information
		</h3>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<div>
				<p class="text-sm text-gray-500">Type</p>
				<p class="font-medium">{motorcycleType}</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">Color</p>
				<p class="font-medium">{motorcycleColor}</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">Number</p>
				<p class="font-medium">{motorcycleNumber}</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">Year</p>
				<p class="font-medium">{motorcycleYear}</p>
			</div>
		</div>
		<div class="mt-4 items-center justify-between border-t pt-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<p class="text-sm text-gray-500">License Number</p>
					<p class="font-medium">{licenseNumber}</p>
				</div>
				<div>
					<p class="text-sm text-gray-500">Ride Preference</p>
					<p class="font-medium capitalize">{ridePreference}</p>
				</div>
				<div>
					<p class="text-sm text-gray-500">Role</p>
					<p class="font-medium capitalize">{role}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
			<h3 class="mb-4 flex items-center text-lg font-semibold">
				<Shield class="mr-2 text-orange-500" />
				Account Security
			</h3>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-gray-600">Two-Factor Authentication</span>
					<span
						class="rounded px-2 py-1 text-sm {twoFactorEnabled
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'}"
					>
						{twoFactorEnabled ? 'Enabled' : 'Disabled'}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-600">Insurance Verified</span>
					<span
						class="rounded px-2 py-1 text-sm {insurance.isVerified
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'}"
					>
						{insurance.isVerified ? 'Verified' : 'Not Verified'}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-600">Known Devices</span>
					<span class="font-medium text-gray-800">{knownDevices.length}</span>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
			<h3 class="mb-4 flex items-center text-lg font-semibold">
				<Calendar class="mr-2 text-orange-500" />
				Account Timeline
			</h3>
			<div class="space-y-3">
				<div class="flex justify-between">
					<span class="text-gray-600">Joined</span>
					<span class="font-medium">{formatDate(createdAt)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-600">Last Active</span>
					<span class="font-medium">{formatDate(lastActiveAt)}</span>
				</div>
				{#if pendingNameUpdate?.status}
					<div class="flex justify-between">
						<span class="text-gray-600">Name Update</span>
						<span class="rounded bg-green-100 px-2 py-1 text-sm capitalize text-green-800">
							{pendingNameUpdate.status}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<Tabs.Root value="onlineHistory">
		<Tabs.List
			class="flex h-20 w-268 items-center space-x-4 rounded-xl border bg-white"
		>
			<Tabs.Trigger value="onlineHistory">Online History</Tabs.Trigger>
			<Tabs.Trigger value="Devices">Devices</Tabs.Trigger>
			<Tabs.Trigger value="rideHistory">Documents</Tabs.Trigger>
			<Tabs.Trigger value="deliveryHistory">Recent Activity</Tabs.Trigger>
			<Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
		</Tabs.List>
		<div class="mt-6 space-y-4">
			<Tabs.Content value="onlineHistory">
				<div class="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
					<table class="min-w-full divide-y divide-gray-200 text-sm">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
								>
									Status
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
								>
									Timestamp
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 bg-white">
							{#each onlineHistory as entry}
								<tr>
									<td class="px-6 py-4">
										<span
											class="inline-block rounded px-2 py-1 text-xs font-semibold
								{entry.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}"
										>
											{entry.status}
										</span>
									</td>
									<td class="px-6 py-4 text-gray-700">
										{formatDate(entry.timestamp)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Tabs.Content>

			<Tabs.Content value="Devices">
				<div class="rounded-lg bg-white p-6 shadow-md">
					<h3 class="mb-4 text-lg font-semibold text-gray-800">Known Devices</h3>
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200 text-sm">
							<thead class="bg-gray-50 text-left">
								<tr>
									<th class="px-6 py-3 font-medium text-gray-600">Fingerprint</th>
									<th class="px-6 py-3 font-medium text-gray-600">Browser</th>
									<th class="px-6 py-3 font-medium text-gray-600">OS</th>
									<th class="px-6 py-3 font-medium text-gray-600">Device</th>
									<th class="px-6 py-3 font-medium text-gray-600">First Login</th>
									<th class="px-6 py-3 font-medium text-gray-600">Last Login</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100 bg-white">
								{#each knownDevices as device}
									<tr>
										<td class="break-all px-6 py-4 text-gray-700">{device.fingerprint}</td>
										<td class="px-6 py-4 text-gray-700">{device.browser}</td>
										<td class="px-6 py-4 text-gray-700">{device.os}</td>
										<td class="px-6 py-4 text-gray-700">{device.device}</td>
										<td class="px-6 py-4 text-gray-700">{formatDate(device.firstLogin)}</td>
										<td class="px-6 py-4 text-gray-700">{formatDate(device.lastLogin)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</Tabs.Content>
			<Tabs.Content value="rideHistory">
				<div>
					<h1>Ride History</h1>
				</div>
			</Tabs.Content>
			<Tabs.Content value="deliveryHistory">
				<div>
					<h1>Delivery History</h1>
				</div>
			</Tabs.Content>
			<Tabs.Content value="notifications">
				<div class="rounded-lg bg-white p-6 shadow-md">
					<h3 class="mb-4 flex items-center text-lg font-semibold text-gray-800">
						<span class="mr-2 text-orange-500"><Bell /></span>
						Notification Settings
					</h3>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<h4 class="mb-3 text-sm font-semibold text-gray-600">Preferences</h4>
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Quiet Hours</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.quietHours
											.enabled
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.quietHours.enabled ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								{#if driver.notificationPreferences.quietHours.enabled}
									<div class="ml-4 text-sm text-gray-500">
										<p>
											From {driver.notificationPreferences.quietHours.startTime} to {driver
												.notificationPreferences.quietHours.endTime}
										</p>
									</div>
								{/if}
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Login Alerts</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.loginAlerts
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.loginAlerts ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Security Alerts</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.securityAlerts
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.securityAlerts ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Marketing Emails</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.marketingEmails
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.marketingEmails ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Email Notifications</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences
											.emailNotifications
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.emailNotifications ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">New Ride Requests</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.newRideRequests
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.newRideRequests ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Payment Alerts</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.paymentAlerts
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.paymentAlerts ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Push Notifications</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences
											.pushNotifications
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.pushNotifications ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Ratings Notifications</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences
											.ratingsNotifications
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.ratingsNotifications ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">Ride Updates</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.rideUpdates
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.rideUpdates ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">SMS Notifications</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences
											.smsNotifications
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.smsNotifications ? 'Enabled' : 'Disabled'}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600">System Updates</span>
									<span
										class="rounded px-2 py-1 text-sm {driver.notificationPreferences.systemUpdates
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{driver.notificationPreferences.systemUpdates ? 'Enabled' : 'Disabled'}
									</span>
								</div>
							</div>
						</div>
						<div>
							<h4 class="mb-3 text-sm font-semibold text-gray-600">Statistics</h4>
							<div class="space-y-3">
								<div class="flex justify-between">
									<span class="text-gray-600">Last Read</span>
									<span class="font-medium"
										>{driver.notificationStats.lastReadAt
											? formatDate(driver.notificationStats.lastReadAt)
											: 'N/A'}</span
									>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Ride Requests Received</span>
									<span class="font-medium">{driver.notificationStats.rideRequestsReceived}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Ride Requests Accepted</span>
									<span class="font-medium">{driver.notificationStats.rideRequestsAccepted}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Total Notifications Sent</span>
									<span class="font-medium">{driver.notificationStats.totalSent}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Total Notifications Read</span>
									<span class="font-medium">{driver.notificationStats.totalRead}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Tabs.Content>
		</div>
	</Tabs.Root>
</div>
