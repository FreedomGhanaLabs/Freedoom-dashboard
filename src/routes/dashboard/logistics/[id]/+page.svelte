<!-- src/routes/dashboard/logistics/[id]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { formatDistanceToNow } from 'date-fns';
	import type { PageData } from './$types';
	import { 
		Package2, 
		MapPin, 
		User, 
		Phone, 
		Mail, 
		Truck, 
		Clock, 
		DollarSign, 
		CheckCircle, 
		AlertCircle,
		Navigation,
		Calendar,
		FileText,
		CreditCard,
		Thermometer,
		CloudRain
	} from 'lucide-svelte';

	export let data: PageData;
	
	$: delivery = data.delivery;
	$: transaction = data.transaction;

	// Status badge styling
	function getStatusBadge(status: string) {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'in_progress':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'cancelled':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function getPaymentStatusBadge(status: string) {
		switch (status) {
			case 'paid':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'failed':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	// Timeline events
	$: timeline = [
		{ event: 'Requested', time: delivery.requestedAt, icon: Clock },
		{ event: 'Accepted', time: delivery.acceptedAt, icon: CheckCircle },
		{ event: 'Driver Arrived', time: delivery.arrivedAt, icon: Navigation },
		{ event: 'Pickup Started', time: delivery.startedAt, icon: Package2 },
		{ event: 'Completed', time: delivery.completedAt, icon: CheckCircle }
	].filter(item => item.time);

	function formatCurrency(amount: number, currency: string) {
		return new Intl.NumberFormat('en-GH', {
			style: 'currency',
			currency: currency || 'GHS'
		}).format(amount);
	}

	function formatDateTime(dateString: string) {
		return new Date(dateString).toLocaleString('en-GH', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function capitalizeFirst(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
	}
</script>

<svelte:head>
	<title>Delivery #{delivery._id.slice(-8)} - Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-white mb-[4rem] w-[75vw] rounded-2xl mx-auto p-6">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">
						Delivery #{delivery._id.slice(-8)}
					</h1>
					<p class="text-gray-600 mt-1">
						{delivery.packageName} • {formatDateTime(delivery.requestedAt)}
					</p>
				</div>
				<div class="flex items-center gap-3">
					<p> Delivery Status:
					<span class="px-3 py-1 rounded-full ml-3 text-sm font-medium border {getStatusBadge(delivery.status)}">
						{capitalizeFirst(delivery.status)}
					</span>
					</p>
					<p> Payment Status:
					<span class="px-3 py-1 rounded-full text-sm font-medium border {getPaymentStatusBadge(delivery.paymentStatus)}">
						{capitalizeFirst(delivery.paymentStatus)}
					</span>
					</p>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Package Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200">
					<div class="p-6">
						<div class="flex items-center gap-3 mb-4">
							<Package2 class="w-5 h-5 text-blue-600" />
							<h2 class="text-xl font-semibold text-gray-900">Package Details</h2>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-3">
								<div>
									<label class="text-sm font-medium text-gray-500">Package Name</label>
									<p class="text-gray-900 font-medium">{delivery.packageName}</p>
								</div>
								<div>
									<label class="text-sm font-medium text-gray-500">Type</label>
									<p class="text-gray-900">{capitalizeFirst(delivery.packageType)}</p>
								</div>
								<div>
									<label class="text-sm font-medium text-gray-500">Size</label>
									<p class="text-gray-900">{capitalizeFirst(delivery.packageSize)}</p>
								</div>
							</div>
							<div class="space-y-3">
								<div>
									<label class="text-sm font-medium text-gray-500">Recipient</label>
									<p class="text-gray-900 font-medium">{delivery.recipientName}</p>
								</div>
								<div>
									<label class="text-sm font-medium text-gray-500">Recipient Phone</label>
									<p class="text-gray-900">{delivery.recipientPhone}</p>
								</div>
								<div>
									<label class="text-sm font-medium text-gray-500">Verified</label>
									<div class="flex items-center gap-2">
										{#if delivery.isDeliveryVerified}
											<CheckCircle class="w-4 h-4 text-green-600" />
											<span class="text-green-600 font-medium">Verified</span>
										{:else}
											<AlertCircle class="w-4 h-4 text-yellow-600" />
											<span class="text-yellow-600 font-medium">Unverified</span>
										{/if}
									</div>
								</div>
							</div>
						</div>
						{#if delivery.packageDescription}
							<div class="mt-4 p-3 bg-gray-50 rounded-lg">
								<label class="text-sm font-medium text-gray-500">Description</label>
								<p class="text-gray-900 mt-1">{delivery.packageDescription}</p>
							</div>
						{/if}
						{#if delivery.deliveryInstructions}
							<div class="mt-4 p-3 bg-blue-50 rounded-lg">
								<label class="text-sm font-medium text-gray-500">Delivery Instructions</label>
								<p class="text-gray-900 mt-1">{delivery.deliveryInstructions}</p>
							</div>
						{/if}
					</div>
				</div>

				<!-- Location Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200">
					<div class="p-6">
						<div class="flex items-center gap-3 mb-4">
							<MapPin class="w-5 h-5 text-green-600" />
							<h2 class="text-xl font-semibold text-gray-900">Route Information</h2>
						</div>
						<div class="space-y-4">
							<div class="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
								<div class="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
								<div class="flex-1">
									<label class="text-sm font-medium text-green-700">Pickup Location</label>
									<p class="text-gray-900 font-medium">{delivery.pickupLocation.address}</p>
									<p class="text-sm text-gray-600">
										{delivery.pickupLocation.coordinates[1].toFixed(6)}, {delivery.pickupLocation.coordinates[0].toFixed(6)}
									</p>
								</div>
							</div>
							<div class="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
								<div class="w-3 h-3 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
								<div class="flex-1">
									<label class="text-sm font-medium text-red-700">Dropoff Location</label>
									<p class="text-gray-900 font-medium">{delivery.dropoffLocation.address}</p>
									<p class="text-sm text-gray-600">
										{delivery.dropoffLocation.coordinates[1].toFixed(6)}, {delivery.dropoffLocation.coordinates[0].toFixed(6)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Timeline -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200">
					<div class="p-6">
						<div class="flex items-center gap-3 mb-4">
							<Calendar class="w-5 h-5 text-purple-600" />
							<h2 class="text-xl font-semibold text-gray-900">Delivery Timeline</h2>
						</div>
						<div class="space-y-4">
							{#each timeline as item, index}
								<div class="flex items-center gap-4">
									<div class="flex-shrink-0">
										<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
											<svelte:component this={item.icon} class="w-5 h-5 text-blue-600" />
										</div>
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex items-center justify-between">
											<p class="text-sm font-medium text-gray-900">{item.event}</p>
											<p class="text-sm text-gray-500">{formatDateTime(item.time)}</p>
										</div>
										<p class="text-sm text-gray-600">{formatDistanceToNow(new Date(item.time))} ago</p>
									</div>
								</div>
								{#if index < timeline.length - 1}
									<div class="ml-5 h-6 w-px bg-gray-200"></div>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Customer Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200">
					<div class="p-6">
						<div class="flex items-center gap-3 mb-4">
							<User class="w-5 h-5 text-indigo-600" />
							<h3 class="text-lg font-semibold text-gray-900">Customer</h3>
						</div>
						<div class="space-y-3">
							<div class="flex items-center gap-3">
								<Mail class="w-4 h-4 text-gray-400" />
								<span class="text-sm text-gray-900">{delivery.user.email}</span>
							</div>
							<div class="flex items-center gap-3">
								<Phone class="w-4 h-4 text-gray-400" />
								<span class="text-sm text-gray-900">{delivery.user.phone}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Driver Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200">
					<div class="p-6">
						<div class="flex items-center gap-3 mb-4">
							<Truck class="w-5 h-5 text-orange-600" />
							<h3 class="text-lg font-semibold text-gray-900">Driver</h3>
						</div>
						<div class="space-y-3">
							<!-- <div class="flex items-center gap-3">
								<Mail class="w-4 h-4 text-gray-400" />
								<span class="text-sm text-gray-900">{delivery.driver.email}</span>
							</div> -->
							<!-- <div class="flex items-center gap-3">
								<Phone class="w-4 h-4 text-gray-400" />
								<span class="text-sm text-gray-900">{delivery.driver.phone}</span>
							</div> -->
							<!-- <div class="mt-4 p-3 bg-gray-50 rounded-lg">
								<div class="text-sm space-y-1">
									<div class="flex justify-between">
										<span class="text-gray-500">Vehicle:</span>
										<span class="text-gray-900 font-medium">{delivery.driver.motorcycleType}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Color:</span>
										<span class="text-gray-900">{delivery.driver.motorcycleColor}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Plate:</span>
										<span class="text-gray-900 font-mono">{delivery.driver.motorcycleNumber}</span>
									</div>
								</div>
							</div> -->
						</div>
					</div>
				</div>

				<!-- Pricing Breakdown -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200">
					<div class="p-6">
						<div class="flex items-center gap-3 mb-4">
							<DollarSign class="w-5 h-5 text-green-600" />
							<h3 class="text-lg font-semibold text-gray-900">Pricing</h3>
						</div>
						<div class="space-y-3 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600">Base Fare</span>
								<span class="text-gray-900">{formatCurrency(delivery.baseFare, delivery.currency)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Distance Fare</span>
								<span class="text-gray-900">{formatCurrency(delivery.distanceFare, delivery.currency)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Time Fare</span>
								<span class="text-gray-900">{formatCurrency(delivery.timeFare, delivery.currency)}</span>
							</div>
							{#if delivery.discount > 0}
								<div class="flex justify-between">
									<span class="text-gray-600">Discount</span>
									<span class="text-green-600">-{formatCurrency(delivery.discount, delivery.currency)}</span>
								</div>
							{/if}
							<div class="flex justify-between">
								<span class="text-gray-600">Platform Commission</span>
								<span class="text-gray-900">{formatCurrency(delivery.platformCommission, delivery.currency)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Driver Earnings</span>
								<span class="text-gray-900">{formatCurrency(delivery.driverEarnings, delivery.currency)}</span>
							</div>
							<hr class="my-3">
							<div class="flex justify-between text-lg font-semibold">
								<span class="text-gray-900">Total Fare</span>
								<span class="text-gray-900">{formatCurrency(delivery.totalFare, delivery.currency)}</span>
							</div>
							<div class="flex items-center justify-between mt-3 p-3 bg-gray-50 rounded-lg">
								<div class="flex items-center gap-2">
									<CreditCard class="w-4 h-4 text-gray-400" />
									<span class="text-sm text-gray-600">Payment Method</span>
								</div>
								<span class="text-sm font-medium text-gray-900">{capitalizeFirst(delivery.paymentMethod)}</span>
							</div>
						</div>
					</div>
				</div>
			
				<!-- Weather & Conditions -->
				{#if delivery.weatherConditions}
					<div class="bg-white rounded-xl shadow-sm border border-gray-200">
						<div class="p-6">
							<div class="flex items-center gap-3 mb-4">
								<Thermometer class="w-5 h-5 text-blue-600" />
								<h3 class="text-lg font-semibold text-gray-900">Conditions</h3>
							</div>
							<div class="space-y-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<CloudRain class="w-4 h-4 text-gray-400" />
										<span class="text-sm text-gray-600">Weather</span>
									</div>
									<span class="text-sm font-medium text-gray-900">
										{delivery.weatherConditions.isRaining ? 'Raining' : 'Clear'}
									</span>
								</div>
								{#if delivery.weatherConditions.temperature}
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2">
											<Thermometer class="w-4 h-4 text-gray-400" />
											<span class="text-sm text-gray-600">Temperature</span>
										</div>
										<span class="text-sm font-medium text-gray-900">
											{delivery.weatherConditions.temperature}°C
										</span>
									</div>
								{/if}
								<div class="flex items-center justify-between">
									<span class="text-sm text-gray-600">Demand Level</span>
									<span class="text-sm font-medium text-gray-900 capitalize">{delivery.demandLevel}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm text-gray-600">Surge Multiplier</span>
									<span class="text-sm font-medium text-gray-900">{delivery.surgeMultiplier}x</span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>