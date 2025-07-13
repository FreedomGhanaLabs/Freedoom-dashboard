<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import { Search,CheckCircle,Clock,XCircle,Calendar,User,Mail,Phone,MapPin,Filter,Check,AlertCircle,ArrowLeft,Users} from 'lucide-svelte';

	const { data, form } = $props<{ data: PageData; form: ActionData }>();

	let selectedApplications: string[] = $state([]);
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let selectedStatus = $state('');
	let reviewNotes = $state('');
	let isSubmitting = $state(false);

	// Filter applications based on search and status
	let filteredApplications = $derived(
		data.applications.filter((app: any) => {
			const matchesSearch = !searchQuery || 
				app.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				app.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				app.phone?.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

			return matchesSearch && matchesStatus;
		})
	);

	// Status options for bulk update
	const statusOptions = [
			{ value: 'interview-scheduled', label: 'Interview Scheduled', icon: Calendar, color: 'text-blue-600' }
	];

	// Filter options
	const filterOptions = [
		{ value: 'all', label: 'All Applications' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'approved', label: 'Approved' },
		{ value: 'rejected', label: 'Rejected' },
		{ value: 'interview-scheduled', label: 'Interview Scheduled' }
	];

	function toggleApplication(id: string) {
		if (selectedApplications.includes(id)) {
			selectedApplications = selectedApplications.filter(appId => appId !== id);
		} else {
			selectedApplications = [...selectedApplications, id];
		}
	}

	function toggleSelectAll() {
		if (selectedApplications.length === filteredApplications.length) {
			selectedApplications = [];
		} else {
			selectedApplications = filteredApplications.map((app: any) => app._id);
		}
	}

	function getStatusIcon(status: string) {
		const option = statusOptions.find(opt => opt.value === status);
		return option?.icon || Clock;
	}

	function getStatusColor(status: string) {
		const option = statusOptions.find(opt => opt.value === status);
		return option?.color || 'text-gray-600';
	}

	function formatDate(dateString: string) {
		return dateString ? new Date(dateString).toLocaleDateString() : '-';
	}

	function goBack() {
		goto('/dashboard/application');
	}
</script>

<svelte:head>
	<title>Bulk Update Applications - Admin Panel</title>
</svelte:head>

<div class="min-h-screen bg-white w-[75vw] mx-auto rounded-3xl">
	<div class="mx-auto max-w-7xl px-4 py-8">
		<!-- Header -->
		<div class="mb-8">
			<button 
				onclick={goBack}
				class="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
			>
				<ArrowLeft class="h-4 w-4 mr-2" />
				Back to Applications
			</button>
			
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Bulk Update Applications</h1>
					<p class="text-gray-600 mt-1">Select applications and update their status in bulk</p>
				</div>
				<div class="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm border">
					<Users class="h-5 w-5 text-gray-400 mr-2" />
					<span class="text-sm font-medium text-gray-700">
						{selectedApplications.length} selected
					</span>
				</div>
			</div>
		</div>

		<!-- Success/Error Messages -->
		{#if form?.success}
			<div class="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
				<div class="flex items-center">
					<CheckCircle class="h-5 w-5 text-green-600 mr-2" />
					<p class="text-green-800 font-medium">{form.message}</p>
				</div>
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
				<div class="flex items-center">
					<AlertCircle class="h-5 w-5 text-red-600 mr-2" />
					<p class="text-red-800 font-medium">{form.error}</p>
				</div>
			</div>
		{/if}

		<!-- Filters and Search -->
		<div class="mb-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
			<div class="flex flex-col md:flex-row gap-4">
				<!-- Search -->
				<div class="relative flex-1">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search by name, email, or phone..."
						class="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					/>
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
				</div>

				<!-- Status Filter -->
				<div class="relative">
					<select
						bind:value={statusFilter}
						class="rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-white"
					>
						{#each filterOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					<Filter class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
				</div>

				<!-- Select All Toggle -->
				<button
					onclick={toggleSelectAll}
					class="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
				>
					<Check class="h-4 w-4" />
					{selectedApplications.length === filteredApplications.length ? 'Deselect All' : 'Select All'}
				</button>
			</div>
		</div>

		<!-- Applications Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
			{#each filteredApplications as application}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
					<!-- Selection Header -->
					<div class="p-4 border-b border-gray-100">
						<div class="flex items-center justify-between">
							<label class="flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={selectedApplications.includes(application._id)}
									onchange={() => toggleApplication(application._id)}
									class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="ml-2 text-sm font-medium text-gray-700">Select</span>
							</label>
							
							<div class="flex items-center gap-2">
								<svelte:component 
									this={getStatusIcon(application.status)} 
									class="h-4 w-4 {getStatusColor(application.status)}"
								/>
								<span class="text-sm font-medium capitalize {getStatusColor(application.status)}">
									{application.status?.replace('-', ' ') || 'N/A'}
								</span>
							</div>
						</div>
					</div>

					<!-- Application Details -->
					<div class="p-4">
						<div class="space-y-3">
							<div class="flex items-center gap-3">
								<User class="h-4 w-4 text-gray-400" />
								<span class="text-sm font-medium text-gray-900">
									{application.firstName} {application.lastName}
								</span>
							</div>
							
							<div class="flex items-center gap-3">
								<Mail class="h-4 w-4 text-gray-400" />
								<span class="text-sm text-gray-600 truncate">{application.email}</span>
							</div>
							
							<div class="flex items-center gap-3">
								<Phone class="h-4 w-4 text-gray-400" />
								<span class="text-sm text-gray-600">{application.phone || '-'}</span>
							</div>
							
							<div class="flex items-center gap-3">
								<MapPin class="h-4 w-4 text-gray-400" />
								<span class="text-sm text-gray-600">{application.city || '-'}</span>
							</div>
							
							<div class="flex items-center gap-3">
								<Calendar class="h-4 w-4 text-gray-400" />
								<span class="text-sm text-gray-600">
									{formatDate(application.submittedAt)}
								</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Bulk Update Form -->
		{#if selectedApplications.length > 0}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">
					Update {selectedApplications.length} Selected Application(s)
				</h3>
				
				<form 
					method="POST" 
					action="?/bulkUpdate"
					use:enhance={({ formData }) => {
						isSubmitting = true;
						selectedApplications.forEach(id => {
							formData.append('applicationIds', id);
						});
						return async ({ result, update }) => {
							isSubmitting = false;
							if (result.type === 'success') {
								selectedApplications = [];
								selectedStatus = '';
								reviewNotes = '';
							}
							await update();
						};
					}}
				>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Status Selection -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								New Status *
							</label>
							<select
								bind:value={selectedStatus}
								name="status"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							>
								<option value="">Select status...</option>
								{#each statusOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						<!-- Review Notes -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Review Notes
							</label>
							<input
								type="text"
								bind:value={reviewNotes}
								name="reviewNotes"
								placeholder="Optional notes for this update..."
								class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
					</div>

					<div class="mt-6 flex items-center gap-4">
						<button
							type="submit"
							disabled={!selectedStatus || isSubmitting}
							class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{#if isSubmitting}
								<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
								Updating...
							{:else}
								<Check class="h-4 w-4" />
								Update {selectedApplications.length} Application(s)
							{/if}
						</button>
						
						<button
							type="button"
							onclick={() => {
								selectedApplications = [];
								selectedStatus = '';
								reviewNotes = '';
							}}
							class="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Clear Selection
						</button>
					</div>
				</form>
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
				<Users class="h-12 w-12 text-gray-400 mx-auto mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">No Applications Selected</h3>
				<p class="text-gray-600">Select one or more applications to perform bulk updates.</p>
			</div>
		{/if}
	</div>
</div>