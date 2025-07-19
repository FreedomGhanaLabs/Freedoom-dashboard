<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

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

	const formatCurrency = (amount: { toLocaleString: (arg0: string, arg1: { minimumFractionDigits: number; }) => any; }) => {
		return `₵${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
	};

	const getStatusColor = (status: any) => {
		switch (status) {
			case 'approved': return 'bg-green-100 text-green-800 border-green-200';
			case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const tabs = [
		{ id: 'overview', label: 'Overview', icon: '👤' },
		{ id: 'documents', label: 'Documents', icon: '📄' },
		{ id: 'guarantor', label: 'Guarantor', icon: '🛡️' },
		{ id: 'bike-program', label: 'Bike Program', icon: '🏍️' }
	];

	// Calculate payment progress percentage
	$: paymentProgress = driverData?.bikeProgram 
		? ((driverData.bikeProgram.totalPaid / driverData.bikeProgram.bikePrice) * 100).toFixed(1)
		: 0;
</script>

<svelte:head>
	<title>Driver ID: {driverData?.driverId || 'Loading...'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white border-b border-gray-200 sticky top-0 z-10">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="py-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
							{driverData?.firstName?.[0] || 'D'}{driverData?.lastName?.[0] || 'R'}
						</div>
						<div>
							<h1 class="text-3xl font-bold text-gray-900">
								{driverData?.firstName || ''} {driverData?.lastName || ''} {driverData?.otherName || ''}
							</h1>
							<p class="text-gray-500 text-lg">Driver ID: {driverData?.driverId || driverId}</p>
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<div class="px-4 py-2 rounded-full text-sm font-semibold border {getStatusColor(driverData?.registrationStatus)}">
							<span class="inline-block w-4 h-4 mr-2">✅</span>
							{driverData?.registrationStatus?.toUpperCase() || 'UNKNOWN'}
						</div>
						<button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
							<span class="w-4 h-4">📥</span>
							<span>Export</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Navigation Tabs -->
		<div class="mb-8">
			<nav class="flex space-x-8 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
				{#each tabs as tab}
					<button
						on:click={() => activeTab = tab.id}
						class="flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all {activeTab === tab.id
							? 'bg-blue-100 text-blue-700 shadow-sm'
							: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}"
					>
						<span class="w-4 h-4">{tab.icon}</span>
						<span>{tab.label}</span>
					</button>
				{/each}
			</nav>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'overview'}
			<div class="space-y-6">
				<!-- Personal Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-blue-600">👤</span>
							Personal Information
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
								<p class="text-gray-900 font-medium">
									{driverData?.firstName || ''} {driverData?.lastName || ''} {driverData?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
								<p class="text-gray-900 flex items-center">
									<span class="w-4 h-4 mr-2 text-gray-400">✉️</span>
									{driverData?.email || 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Phone</label>
								<p class="text-gray-900 flex items-center">
									<span class="w-4 h-4 mr-2 text-gray-400">📞</span>
									{driverData?.phone || 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
								<p class="text-gray-900 flex items-center">
									<span class="w-4 h-4 mr-2 text-gray-400">📅</span>
									{driverData?.dateOfBirth ? formatDate(driverData.dateOfBirth) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Gender</label>
								<p class="text-gray-900">{driverData?.gender === 'M' ? 'Male' : driverData?.gender === 'F' ? 'Female' : 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Address</label>
								<p class="text-gray-900 flex items-start">
									<span class="w-4 h-4 mr-2 text-gray-400 mt-0.5">📍</span>
									{driverData?.address || ''}, {driverData?.city || ''}, {driverData?.region || ''}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Registration Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-blue-600">🕐</span>
							Registration Details
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Registered Date</label>
								<p class="text-gray-900">{driverData?.registeredAt ? formatDate(driverData.registeredAt) : 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Approved Date</label>
								<p class="text-gray-900">{driverData?.approvedAt ? formatDate(driverData.approvedAt) : 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
								<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {getStatusColor(driverData?.registrationStatus)}">
									<span class="w-4 h-4 mr-1">✅</span>
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
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-blue-600">📄</span>
							Driver License
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">License Number</label>
								<p class="text-gray-900 font-mono">{driverData?.driverLicense?.licenseNumber || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
								<p class="text-gray-900">
									{driverData?.driverLicense?.firstName || ''} 
									{driverData?.driverLicense?.lastName || ''} 
									{driverData?.driverLicense?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Class</label>
								<p class="text-gray-900">{driverData?.driverLicense?.classOfLicense || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
								<p class="text-gray-900">{driverData?.driverLicense?.nationality || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Issue Date</label>
								<p class="text-gray-900">
									{driverData?.driverLicense?.issueDate ? formatDate(driverData.driverLicense.issueDate) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Expiry Date</label>
								<p class="font-medium {driverData?.driverLicense?.expiryDate && new Date(driverData.driverLicense.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-900'}">
									{driverData?.driverLicense?.expiryDate ? formatDate(driverData.driverLicense.expiryDate) : 'N/A'}
									{#if driverData?.driverLicense?.expiryDate && new Date(driverData.driverLicense.expiryDate) < new Date()}
										<span class="w-4 h-4 inline ml-2 text-red-500">⚠️</span>
									{/if}
								</p>
							</div>
						</div>
						<div class="mt-6">
							<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
								<span class="w-4 h-4">👁️</span>
								<span>View Document</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Ghana Card -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-green-600">📄</span>
							Ghana Card
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">ID Number</label>
								<p class="text-gray-900 font-mono">{driverData?.ghanaCard?.personalIdNumber || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
								<p class="text-gray-900">
									{driverData?.ghanaCard?.firstName || ''} 
									{driverData?.ghanaCard?.lastName || ''} 
									{driverData?.ghanaCard?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Sex</label>
								<p class="text-gray-900">{driverData?.ghanaCard?.sex === 'M' ? 'Male' : driverData?.ghanaCard?.sex === 'F' ? 'Female' : 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Height</label>
								<p class="text-gray-900">{driverData?.ghanaCard?.height || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
								<p class="text-gray-900">
									{driverData?.ghanaCard?.dateOfBirth ? formatDate(driverData.ghanaCard.dateOfBirth) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Expiry Date</label>
								<p class="text-gray-900">
									{driverData?.ghanaCard?.expiryDate ? formatDate(driverData.ghanaCard.expiryDate) : 'N/A'}
								</p>
							</div>
						</div>
						<div class="mt-6">
							<button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
								<span class="w-4 h-4">👁️</span>
								<span>View Document</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Proof of Address -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-purple-600">📍</span>
							Proof of Address
						</h3>
					</div>
					<div class="p-6">
						<p class="text-gray-600 mb-4">Address verification document uploaded and verified.</p>
						<button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
							<span class="w-4 h-4">👁️</span>
							<span>View Document</span>
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 'guarantor'}
			<div class="space-y-6">
				<!-- Guarantor Personal Info -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-blue-600">🛡️</span>
							Guarantor Information
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
								<p class="text-gray-900 font-medium">
									{driverData?.guarantor?.firstName || ''} 
									{driverData?.guarantor?.lastName || ''} 
									{driverData?.guarantor?.otherName || ''}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Relationship</label>
								<p class="text-gray-900">{driverData?.guarantor?.relationship || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Occupation</label>
								<p class="text-gray-900">{driverData?.guarantor?.occupation || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Phone</label>
								<p class="text-gray-900 flex items-center">
									<span class="w-4 h-4 mr-2 text-gray-400">📞</span>
									{driverData?.guarantor?.phone || 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
								<p class="text-gray-900 flex items-center">
									<span class="w-4 h-4 mr-2 text-gray-400">✉️</span>
									{driverData?.guarantor?.email || 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Address</label>
								<p class="text-gray-900 flex items-start">
									<span class="w-4 h-4 mr-2 text-gray-400 mt-0.5">📍</span>
									<span>
										{driverData?.guarantor?.address || 'N/A'}
										{#if driverData?.guarantor?.landmark}
											<br />
											<span class="text-gray-500 text-sm">{driverData.guarantor.landmark}</span>
										{/if}
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Guarantor Ghana Card -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-green-600">📄</span>
							Guarantor Ghana Card
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">ID Number</label>
								<p class="text-gray-900 font-mono">{driverData?.guarantor?.ghanaCard?.personalIdNumber || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Sex</label>
								<p class="text-gray-900">
									{driverData?.guarantor?.ghanaCard?.sex === 'F' ? 'Female' : driverData?.guarantor?.ghanaCard?.sex === 'M' ? 'Male' : 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Height</label>
								<p class="text-gray-900">{driverData?.guarantor?.ghanaCard?.height || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
								<p class="text-gray-900">
									{driverData?.guarantor?.ghanaCard?.dateOfBirth ? formatDate(driverData.guarantor.ghanaCard.dateOfBirth) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Expiry Date</label>
								<p class="text-gray-900">
									{driverData?.guarantor?.ghanaCard?.expiryDate ? formatDate(driverData.guarantor.ghanaCard.expiryDate) : 'N/A'}
								</p>
							</div>
						</div>
						<div class="mt-6 flex space-x-4">
							<button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
								<span class="w-4 h-4">👁️</span>
								<span>View Ghana Card</span>
							</button>
							<button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
								<span class="w-4 h-4">👁️</span>
								<span>View Address Proof</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 'bike-program'}
			<div class="space-y-6">
				<!-- Bike Details -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-blue-600">🏍️</span>
							Bike Program Details
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Bike Model</label>
								<p class="text-gray-900 font-medium">{driverData?.bikeProgram?.bikeModel || 'N/A'}</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Total Price</label>
								<p class="text-gray-900 font-bold text-lg">
									{driverData?.bikeProgram?.bikePrice ? formatCurrency(driverData.bikeProgram.bikePrice) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
								<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {getStatusColor(driverData?.bikeProgram?.status)}">
									<span class="w-4 h-4 mr-1">✅</span>
									{driverData?.bikeProgram?.status?.toUpperCase() || 'UNKNOWN'}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Payment Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
						<h3 class="text-lg font-semibold text-gray-900 flex items-center">
							<span class="w-5 h-5 mr-2 text-green-600">💳</span>
							Payment Information
						</h3>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Monthly Payment</label>
								<p class="text-gray-900 font-bold text-xl">
									{driverData?.bikeProgram?.monthlyPayment ? formatCurrency(driverData.bikeProgram.monthlyPayment) : 'N/A'}
								</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Payment Duration</label>
								<p class="text-gray-900">{driverData?.bikeProgram?.paymentDuration || 'N/A'} months</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Extension Months</label>
								<p class="text-gray-900">{driverData?.bikeProgram?.extensionMonths || 0} months</p>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
								<p class="text-gray-900">
									{driverData?.bikeProgram?.startDate ? formatDate(driverData.bikeProgram.startDate) : 'N/A'}
								</p>
							</div>
						</div>

						<!-- Payment Progress -->
						<div class="mb-6">
							<div class="flex justify-between items-center mb-2">
								<label class="text-sm font-medium text-gray-500">Payment Progress</label>
								<span class="text-sm text-gray-500">{paymentProgress}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-3">
								<div 
									class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
									style="width: {paymentProgress}%"
								></div>
							</div>
						</div>

						<!-- Payment Summary -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="bg-green-50 rounded-lg p-4 border border-green-200">
								<label class="block text-sm font-medium text-green-600 mb-1">Total Paid</label>
								<p class="text-green-900 font-bold text-2xl">
									{driverData?.bikeProgram?.totalPaid ? formatCurrency(driverData.bikeProgram.totalPaid) : 'N/A'}
								</p>
							</div>
							<div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
								<label class="block text-sm font-medium text-blue-600 mb-1">Remaining Balance</label>
								<p class="text-blue-900 font-bold text-2xl">
									{driverData?.bikeProgram?.remainingBalance ? formatCurrency(driverData.bikeProgram.remainingBalance) : 'N/A'}
								</p>
							</div>
						</div>

						<!-- Expected End Date -->
						{#if driverData?.bikeProgram?.expectedEndDate}
							<div class="mt-6">
								<label class="block text-sm font-medium text-gray-500 mb-1">Expected End Date</label>
														<p class="text-gray-900">
															{formatDate(driverData.bikeProgram.expectedEndDate)}
														</p>
													</div>
												{/if}
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>