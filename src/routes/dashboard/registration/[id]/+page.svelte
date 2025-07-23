<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import CheckCircle from 'lucide-svelte/icons/check-circle';
	import Download from 'lucide-svelte/icons/download';
	import User from 'lucide-svelte/icons/user';
	import FileText from 'lucide-svelte/icons/file-text';
	import Shield from 'lucide-svelte/icons/shield';
	import Bike from 'lucide-svelte/icons/bike';
	import Mail from 'lucide-svelte/icons/mail';
	import Phone from 'lucide-svelte/icons/phone';
	import Calendar from 'lucide-svelte/icons/calendar';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Clock from 'lucide-svelte/icons/clock';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import Eye from 'lucide-svelte/icons/eye';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import Hourglass from 'lucide-svelte/icons/hourglass';
	import Timer from 'lucide-svelte/icons/timer';
	import Picture from '$lib/assets/Logo-01.png';

	// Props from page.server.ts
	export let data;

	let activeTab = 'overview';

	// Extract driver data from the load function
	$: driverData = data.ride;
	$: driverId = data.id;

	const formatDate = (dateString: string | number | Date) => {
		return new Date(dateString).toLocaleDateString('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	};

	const formatCurrency = (amount: {
		toLocaleString: (arg0: string, arg1: { minimumFractionDigits: number }) => any;
	}) => {
		return `GHS ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
	};

	const getStatusColor = (status: any) => {
		switch (status) {
			case 'approved':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'active':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const tabs = [
		{ id: 'overview', label: 'Overview', icon: User },
		{ id: 'documents', label: 'Documents', icon: FileText },
		{ id: 'guarantor', label: 'Guarantor', icon: Shield },
		{ id: 'bike-program', label: 'Bike Program', icon: Bike }
	];

	let showImageModal = false;
	let currentImageUrl = '';
	let currentImageTitle = '';

	// Function to open image in modal
	const viewDocument = (documentUrl: string, title: string) => {
		if (documentUrl) {
			currentImageUrl = documentUrl;
			currentImageTitle = title;
			showImageModal = true;
		}
	};

	// Function to close modal
	const closeModal = () => {
		showImageModal = false;
		currentImageUrl = '';
		currentImageTitle = '';
	};

	// Calculate payment progress percentage
	$: paymentProgress = driverData?.bikeProgram
		? ((driverData.bikeProgram.totalPaid / driverData.bikeProgram.bikePrice) * 100).toFixed(1)
		: 0;
</script>

<svelte:head>
	<title>Driver ID: {driverData?.driverId || 'Loading...'}</title>
</svelte:head>

<div class="mx-auto min-h-screen w-[75vw] bg-gray-50">
	<div class="my-4 mr-[6rem] flex items-center justify-end gap-4">
		<form method="POST" action="?/approveDriver" use:enhance>
			<input type="hidden" name="notes" value="Approved by admin" />
			<button
				name="approveDriver"
				type="submit"
				class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
			>
				<CheckCircle class="mr-2 inline-block h-4 w-4" /> Approve Driver
			</button>
		</form>
	</div>

	<!-- Header -->
	<div class="sticky top-0 z-10 border-b border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="py-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white"
						>
							{driverData?.firstName?.[0] || 'D'}{driverData?.lastName?.[0] || 'R'}
						</div>
						<div>
							<h1 class="text-3xl font-bold text-gray-900">
								{driverData?.firstName || ''}
								{driverData?.lastName || ''}
								{driverData?.otherName || ''}
							</h1>
							<p class="text-lg text-gray-500">Driver ID: {driverData?.driverId || driverId}</p>
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<div
							class="rounded-full border px-4 py-2 text-sm font-semibold {getStatusColor(
								driverData?.registrationStatus
							)}"
						>
							<CheckCircle class="mr-2 inline-block h-4 w-4" />
							{driverData?.registrationStatus?.toUpperCase() || 'UNKNOWN'}
						</div>
						<a
							href={`/dashboard/registration/${driverId}/download-pdf`}
							class="inline-flex items-center space-x-2 rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-blue-700"
						>
							<Download class="h-4 w-4" />
							<span>Export</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Navigation Tabs -->
		<div class="mb-8">
			<nav class="flex space-x-8 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
				{#each tabs as tab}
					<button
						on:click={() => (activeTab = tab.id)}
						class="flex items-center space-x-2 rounded-md px-4 py-3 text-sm font-medium transition-all {activeTab ===
						tab.id
							? 'bg-amber-300/20 text-orange-700 shadow-sm'
							: 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}"
					>
						<svelte:component this={tab.icon} class="hzjs.ifto.hka-4 w-4" />
						<span>{tab.label}</span>
					</button>
				{/each}
			</nav>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'overview'}
			<div class="space-y-6">
				<!-- Personal Information -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200  bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<User class="mr-2 h-5 w-5 text-orange-600" />
							Personal Information
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Full Name</label>
								<p class="font-medium text-gray-900">
									{driverData?.firstName || ''}
									{driverData?.lastName || ''}
									{driverData?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Email</label>
								<p class="flex items-center text-gray-900">
									<Mail class="mr-2 h-4 w-4 text-gray-400" />
									{driverData?.email || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Phone</label>
								<p class="flex items-center text-gray-900">
									<Phone class="mr-2 h-4 w-4 text-gray-400" />
									{driverData?.phone || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Date of Birth</label>
								<p class="flex items-center text-gray-900">
									<Calendar class="mr-2 h-4 w-4 text-gray-400" />
									{driverData?.dateOfBirth ? formatDate(driverData.dateOfBirth) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Gender</label>
								<p class="text-gray-900">
									{driverData?.gender === 'M'
										? 'Male'
										: driverData?.gender === 'F'
											? 'Female'
											: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Address</label>
								<p class="flex items-start text-gray-900">
									<MapPin class="mt-0.5 mr-2 h-4 w-4 text-gray-400" />
									{driverData?.address || ''}, {driverData?.city || ''}, {driverData?.region || ''}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Registration Information -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<Clock class="mr-2 h-5 w-5 text-orange-600" />
							Registration Details
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Registered Date</label>
								<p class="text-gray-900">
									{driverData?.registeredAt ? formatDate(driverData.registeredAt) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Approved Date</label>
								<p class="text-gray-900">
									{driverData?.approvedAt ? formatDate(driverData.approvedAt) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Status</label>
								<span
									class="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium {getStatusColor(
										driverData?.registrationStatus
									)}"
								>
									<CheckCircle class="mr-2 inline-block h-4 w-4" />
									{driverData?.registrationStatus?.toUpperCase() || 'UNKNOWN'}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 'documents'}
			<div class="space-y-6">
				<!-- Driver License -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<FileText class="mr-2 h-5 w-5 text-orange-600" />
							Driver License
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">License Number</label>
								<p class="font-mono text-gray-900">
									{driverData?.driverLicense?.licenseNumber || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Full Name</label>
								<p class="text-gray-900">
									{driverData?.driverLicense?.firstName || ''}
									{driverData?.driverLicense?.lastName || ''}
									{driverData?.driverLicense?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Class</label>
								<p class="text-gray-900">{driverData?.driverLicense?.classOfLicense || 'N/A'}</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Nationality</label>
								<p class="text-gray-900">{driverData?.driverLicense?.nationality || 'N/A'}</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Issue Date</label>
								<p class="text-gray-900">
									{driverData?.driverLicense?.issueDate
										? formatDate(driverData.driverLicense.issueDate)
										: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Expiry Date</label>
								<p
									class="font-medium {driverData?.driverLicense?.expiryDate &&
									new Date(driverData.driverLicense.expiryDate) < new Date()
										? 'text-red-600'
										: 'text-gray-900'}"
								>
									{driverData?.driverLicense?.expiryDate
										? formatDate(driverData.driverLicense.expiryDate)
										: 'N/A'}
									{#if driverData?.driverLicense?.expiryDate && new Date(driverData.driverLicense.expiryDate) < new Date()}
										<AlertTriangle class="ml-2 inline h-4 w-4 text-red-500" />
									{/if}
								</p>
							</div>
						</div>
						<div class="mt-6">
							`<button
								on:click={() =>
									viewDocument(driverData?.driverLicense?.documentUrl, 'Driver License')}
								class="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
								disabled={!driverData?.driverLicense?.documentUrl}
							>
								<Eye class="h-4 w-4" />
								<span>View Document</span>
							</button>`
						</div>
					</div>
				</div>

				<!-- Ghana Card -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<FileText class="mr-2 h-5 w-5 text-orange-600" />
							Ghana Card
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">ID Number</label>
								<p class="font-mono text-gray-900">
									{driverData?.ghanaCard?.personalIdNumber || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Full Name</label>
								<p class="text-gray-900">
									{driverData?.ghanaCard?.firstName || ''}
									{driverData?.ghanaCard?.lastName || ''}
									{driverData?.ghanaCard?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Sex</label>
								<p class="text-gray-900">
									{driverData?.ghanaCard?.sex === 'M'
										? 'Male'
										: driverData?.ghanaCard?.sex === 'F'
											? 'Female'
											: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Height</label>
								<p class="text-gray-900">{driverData?.ghanaCard?.height || 'N/A'}</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Date of Birth</label>
								<p class="text-gray-900">
									{driverData?.ghanaCard?.dateOfBirth
										? formatDate(driverData.ghanaCard.dateOfBirth)
										: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Expiry Date</label>
								<p class="text-gray-900">
									{driverData?.ghanaCard?.expiryDate
										? formatDate(driverData.ghanaCard.expiryDate)
										: 'N/A'}
								</p>
							</div>
						</div>
						<div class="mt-6">
							`<button
								on:click={() => viewDocument(driverData?.ghanaCard?.documentUrl, 'Ghana Card')}
								class="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
								disabled={!driverData?.ghanaCard?.documentUrl}
							>
								<Eye class="h-4 w-4" />
								<span>View Document</span>
							</button>`
						</div>
					</div>
				</div>

				<!-- Proof of Address -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<MapPin class="mr-2 h-5 w-5 text-orange-600" />
							Proof of Address
						</h3>
					</div>
					<div class="p-6">
						<p class="mb-4 text-gray-600">Address verification document uploaded and verified.</p>
						`<button
							on:click={() =>
								viewDocument(driverData?.proofOfAddress?.documentUrl, 'Proof of Address')}
							class="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
							disabled={!driverData?.proofOfAddress?.documentUrl}
						>
							<Eye class="h-4 w-4" />
							<span>View Document</span>
						</button>`
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 'guarantor'}
			<div class="space-y-6">
				<!-- Guarantor Personal Info -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<Shield class="mr-2 h-5 w-5 text-orange-600" />
							Guarantor Information
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Full Name</label>
								<p class="font-medium text-gray-900">
									{driverData?.guarantor?.firstName || ''}
									{driverData?.guarantor?.lastName || ''}
									{driverData?.guarantor?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Relationship</label>
								<p class="text-gray-900">{driverData?.guarantor?.relationship || 'N/A'}</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Occupation</label>
								<p class="text-gray-900">{driverData?.guarantor?.occupation || 'N/A'}</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Phone</label>
								<p class="flex items-center text-gray-900">
									<Phone class="mr-2 h-4 w-4 text-gray-400" />
									{driverData?.guarantor?.phone || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Email</label>
								<p class="flex items-center text-gray-900">
									<Mail class="mr-2 h-4 w-4 text-gray-400" />
									{driverData?.guarantor?.email || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Address</label>
								<p class="flex items-start text-gray-900">
									<MapPin class="mt-0.5 mr-2 h-4 w-4 text-gray-400" />
									<span>
										{driverData?.guarantor?.address || 'N/A'}
										{#if driverData?.guarantor?.landmark}
											<br />
											<span class="text-sm text-gray-500">{driverData.guarantor.landmark}</span>
										{/if}
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Guarantor Ghana Card -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<FileText class="mr-2 h-5 w-5 text-orange-600" />
							Guarantor Ghana Card
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">ID Number</label>
								<p class="font-mono text-gray-900">
									{driverData?.guarantor?.ghanaCard?.personalIdNumber || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Sex</label>
								<p class="text-gray-900">
									{driverData?.guarantor?.ghanaCard?.sex === 'F'
										? 'Female'
										: driverData?.guarantor?.ghanaCard?.sex === 'M'
											? 'Male'
											: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Height</label>
								<p class="text-gray-900">{driverData?.guarantor?.ghanaCard?.height || 'N/A'}</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Date of Birth</label>
								<p class="text-gray-900">
									{driverData?.guarantor?.ghanaCard?.dateOfBirth
										? formatDate(driverData.guarantor.ghanaCard.dateOfBirth)
										: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Expiry Date</label>
								<p class="text-gray-900">
									{driverData?.guarantor?.ghanaCard?.expiryDate
										? formatDate(driverData.guarantor.ghanaCard.expiryDate)
										: 'N/A'}
								</p>
							</div>
						</div>
						<div class="mt-6 flex space-x-4">
							<button
								on:click={() =>
									viewDocument(
										driverData?.guarantor?.ghanaCard?.documentUrl,
										'Guarantor Ghana Card'
									)}
								class="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
								disabled={!driverData?.guarantor?.ghanaCard?.documentUrl}
							>
								<Eye class="h-4 w-4" />
								<span>View Ghana Card</span>
							</button>` `<button
								on:click={() =>
									viewDocument(
										driverData?.guarantor?.proofOfAddress?.documentUrl,
										'Guarantor Proof of Address'
									)}
								class="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
								disabled={!driverData?.guarantor?.proofOfAddress?.documentUrl}
							>
								<Eye class="h-4 w-4" />
								<span>View Address Proof</span>
							</button>`
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 'bike-program'}
			<div class="space-y-6">
				<!-- Bike Details -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<Bike class="mr-2 h-5 w-5 text-orange-600" />
							Bike Program Details
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Bike Model</label>
								<p class="font-medium text-gray-900">
									{driverData?.bikeProgram?.bikeModel || 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Total Price</label>
								<p class="text-lg font-bold text-gray-900">
									{driverData?.bikeProgram?.bikePrice
										? formatCurrency(driverData.bikeProgram.bikePrice)
										: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Status</label>
								<span
									class="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium {getStatusColor(
										driverData?.bikeProgram?.status
									)}"
								>
									<CheckCircle class="mr-2 inline-block h-4 w-4" />
									{driverData?.bikeProgram?.status?.toUpperCase() || 'UNKNOWN'}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Payment Information -->
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
						<h3 class="flex items-center text-lg font-semibold text-orange-600">
							<CreditCard class="mr-2 h-5 w-5 text-orange-600" />
							Payment Information
						</h3>
					</div>
					<div class="p-6">
						<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Monthly Payment</label>
								<p class="text-xl font-bold text-gray-900">
									{driverData?.bikeProgram?.monthlyPayment
										? formatCurrency(driverData.bikeProgram.monthlyPayment)
										: 'N/A'}
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Payment Duration</label>
								<p class="text-gray-900">
									{driverData?.bikeProgram?.paymentDuration || 'N/A'} months
								</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Extension Months</label>
								<p class="text-gray-900">{driverData?.bikeProgram?.extensionMonths || 0} months</p>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Start Date</label>
								<p class="text-gray-900">
									{driverData?.bikeProgram?.startDate
										? formatDate(driverData.bikeProgram.startDate)
										: 'N/A'}
								</p>
							</div>
						</div>

						<!-- Payment Progress -->
						<div class="mb-6">
							<div class="mb-2 flex items-center justify-between">
								<label class="text-sm font-medium text-gray-500">Payment Progress</label>
								<span class="text-sm text-gray-500">{paymentProgress}%</span>
							</div>
							<div class="h-3 w-full rounded-full bg-gray-200">
								<div
									class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
									style="width: {paymentProgress}%"
								></div>
							</div>
						</div>

						<!-- Payment Summary -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="rounded-lg border border-green-200 bg-green-50 p-4">
								<label class="mb-1 block text-sm font-medium text-green-600">Total Paid</label>
								<p class="text-2xl font-bold text-green-900">
									{driverData?.bikeProgram?.totalPaid
										? formatCurrency(driverData.bikeProgram.totalPaid)
										: 'N/A'}
								</p>
							</div>
							<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<label class="mb-1 block text-sm font-medium text-blue-600">Remaining Balance</label
								>
								<p class="text-2xl font-bold text-blue-900">
									{driverData?.bikeProgram?.remainingBalance
										? formatCurrency(driverData.bikeProgram.remainingBalance)
										: 'N/A'}
								</p>
							</div>
						</div>
						<form method="POST" action="?/extendPayment" use:enhance class="mt-6 space-y-4">
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label for="extensionMonths" class="block text-sm font-medium text-gray-700"
										>Extension Months</label
									>
									<input
										type="number"
										name="extensionMonths"
										id="extensionMonths"
										min="1"
										required
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label for="reason" class="block text-sm font-medium text-gray-700">Reason</label>
									<input
										type="text"
										name="reason"
										id="reason"
										required
										placeholder="E.g. Financial hardship"
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
							</div>

							<button
								type="submit"
								name="extendPayment"
								class="rounded-md inline-flex bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
							>
								<Timer class="h-4 w-4 mr-2" /> Extend Payment Duration
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- Expected Timeline -->
			<div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 bg-amber-300/20 px-6 py-4">
					<h3 class="flex items-center text-lg font-semibold text-orange-600">
						<Hourglass class="mr-2 h-5 w-5 text-orange-600" />
						Payment Timeline
					</h3>
				</div>
				<div class="p-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-500">Expected End Date</label>
							<p class="text-gray-900">
								{driverData?.bikeProgram?.expectedEndDate
									? formatDate(driverData.bikeProgram.expectedEndDate)
									: 'N/A'}
							</p>
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-500">Extension Period</label>
							<p class="text-gray-900">{driverData?.bikeProgram?.extensionMonths || 0} months</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	{#if showImageModal}
		<div
			class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
			on:click={closeModal}
			on:keydown={(e) => e.key === 'Escape' && closeModal()}
			role="dialog"
			aria-labelledby="modal-title"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white shadow-xl">
				<!-- Modal Header -->
				<div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
					<h3 id="modal-title" class="text-lg font-semibold text-gray-900">{currentImageTitle}</h3>
					<button
						on:click={closeModal}
						class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						aria-label="Close modal"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Modal Body -->
				<div class="p-6">
					<div class="flex justify-center">
						<img
							src={currentImageUrl}
							alt={currentImageTitle}
							class="max-h-[70vh] max-w-full object-contain"
							on:error={(e) => {
								console.error('Failed to load image:', currentImageUrl);
								if (e.target) {
									(e.target as HTMLImageElement).src =
										'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3YTNiNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkIGltYWdlPC90ZXh0Pjwvc3ZnPg==';
								}
							}}
						/>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-gray-200 px-6 py-4">
					<div class="flex justify-end space-x-3">
						<button
							on:click={closeModal}
							class="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
						>
							Close
						</button>
						<a
							href={currentImageUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
							Open in New Tab
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
