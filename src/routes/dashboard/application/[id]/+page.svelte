<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import {
		User,
		Mail,
		Phone,
		Calendar,
		MapPin,
		Briefcase,
		Clock,
		Award,
		CreditCard,
		Bike,
		Users,
		CheckCircle,
		XCircle,
		MessageCircle,
		Download,
		Settings,
		CalendarDays,
		UserCheck,
		Building,
		Home
	} from 'lucide-svelte';

	export let data: PageData;

	const application = data.application;

	$: statusColor =
		{
			pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			approved: 'bg-green-100 text-green-800 border-green-200',
			rejected: 'bg-red-100 text-red-800 border-red-200',
			under_review: 'bg-blue-100 text-blue-800 border-blue-200'
		}[application.status] || 'bg-gray-100 text-gray-800 border-gray-200';

	$: workingModelColor =
		{
			external: 'bg-purple-100 text-purple-800',
			internal: 'bg-blue-100 text-blue-800',
			freelance: 'bg-green-100 text-green-800'
		}[application.workingModel] || 'bg-gray-100 text-gray-800';

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Application {application.applicationId} - Dashboard</title>
</svelte:head>

<div class="bg- min-h-screen p-4 md:p-6">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 h-24 rounded-lg bg-amber-50 p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<div class="flex items-center gap-3">
						<User class="h-8 w-8 text-gray-600" />
						<h1 class="text-3xl font-bold text-gray-900">
							{application.firstName}
							{application.lastName}
						</h1>
					</div>
					<p class="mt-1 ml-11 text-gray-600">Application ID: {application.applicationId}</p>
				</div>
				<div class="flex items-center gap-3">
					<span
						class="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium {statusColor}"
					>
						{application.status.charAt(0).toUpperCase() + application.status.slice(1)}
					</span>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div class="space-y-6 lg:col-span-2">
				<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 p-6">
						<div class="flex items-center gap-2">
							<User class="h-5 w-5 text-gray-600" />
							<h2 class="text-xl font-semibold text-gray-900">Personal Information</h2>
						</div>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<User class="h-4 w-4" />
									Full Name
								</label>
								<p class="text-gray-900">{application.firstName} {application.lastName}</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Mail class="h-4 w-4" />
									Email
								</label>
								<p class="text-gray-900">{application.email}</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Phone class="h-4 w-4" />
									Phone
								</label>
								<p class="text-gray-900">{application.phone}</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Calendar class="h-4 w-4" />
									Date of Birth
								</label>
								<p class="text-gray-900">{formatDate(application.dateOfBirth)}</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<UserCheck class="h-4 w-4" />
									Gender
								</label>
								<p class="text-gray-900 capitalize">{application.gender}</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<MapPin class="h-4 w-4" />
									Location
								</label>
								<p class="text-gray-900">{application.city}, {application.region}</p>
							</div>
							<div class="md:col-span-2">
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Home class="h-4 w-4" />
									Address
								</label>
								<p class="text-gray-900">{application.address}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 p-6">
						<div class="flex items-center gap-2">
							<Briefcase class="h-5 w-5 text-gray-600" />
							<h2 class="text-xl font-semibold text-gray-900">Work Information</h2>
						</div>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Building class="h-4 w-4" />
									Working Model
								</label>
								<span
									class="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium {workingModelColor}"
								>
									{application.workingModel.charAt(0).toUpperCase() +
										application.workingModel.slice(1)}
								</span>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Clock class="h-4 w-4" />
									Preferred Hours
								</label>
								<p class="text-gray-900 capitalize">
									{application.preferredWorkingHours.replace('-', ' ')}
								</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Award class="h-4 w-4" />
									Years of Experience
								</label>
								<p class="text-gray-900">
									{application.yearsOfRidingExperience} year{application.yearsOfRidingExperience !==
									1
										? 's'
										: ''}
								</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<Briefcase class="h-4 w-4" />
									Commercial Experience
								</label>
								<span
									class="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium {application.hasCommercialExperience
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-800'}"
								>
									{application.hasCommercialExperience ? 'Yes' : 'No'}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 p-6">
						<div class="flex items-center gap-2">
							<CreditCard class="h-5 w-5 text-gray-600" />
							<h2 class="text-xl font-semibold text-gray-900">License Information</h2>
						</div>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<CreditCard class="h-4 w-4" />
									License Number
								</label>
								<p class="font-mono text-gray-900">{application.licenseNumber}</p>
							</div>
							<div>
								<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
									<CalendarDays class="h-4 w-4" />
									Expiry Date
								</label>
								<p class="text-gray-900">{formatDate(application.licenseExpiryDate)}</p>
							</div>
						</div>
					</div>
				</div>

				{#if application.hasMotorbike && application.motorbikeDetails}
					<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
						<div class="border-b border-gray-100 p-6">
							<div class="flex items-center gap-2">
								<Bike class="h-5 w-5 text-gray-600" />
								<h2 class="text-xl font-semibold text-gray-900">Motorbike Information</h2>
							</div>
						</div>
						<div class="p-6">
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
										<Bike class="h-4 w-4" />
										Make & Model
									</label>
									<p class="text-gray-900">
										{application.motorbikeDetails.make}
										{application.motorbikeDetails.model}
									</p>
								</div>
								<div>
									<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
										<Calendar class="h-4 w-4" />
										Year
									</label>
									<p class="text-gray-900">{application.motorbikeDetails.year}</p>
								</div>
								<div>
									<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
										<CreditCard class="h-4 w-4" />
										Registration Number
									</label>
									<p class="font-mono text-gray-900">
										{application.motorbikeDetails.registrationNumber}
									</p>
								</div>
								<div>
									<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
										<Settings class="h-4 w-4" />
										Condition
									</label>
									<span
										class="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium {application
											.motorbikeDetails.condition === 'excellent'
											? 'bg-green-100 text-green-800'
											: application.motorbikeDetails.condition === 'good'
												? 'bg-blue-100 text-blue-800'
												: application.motorbikeDetails.condition === 'fair'
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-red-100 text-red-800'}"
									>
										{application.motorbikeDetails.condition
											? application.motorbikeDetails.condition.charAt(0).toUpperCase() +
												application.motorbikeDetails.condition.slice(1)
											: ''}
									</span>
								</div>
							</div>
						</div>
					</div>
				{/if}

				{#if application.emergencyContact}
					<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
						<div class="border-b border-gray-100 p-6">
							<div class="flex items-center gap-2">
								<Users class="h-5 w-5 text-gray-600" />
								<h2 class="text-xl font-semibold text-gray-900">Emergency Contact</h2>
							</div>
						</div>
						<div class="p-6">
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div>
									<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
										<User class="h-4 w-4" />
										Name
									</label>
									<p class="text-gray-900">
										{application.emergencyContact.firstName}
										{application.emergencyContact.lastName}
									</p>
								</div>
								<div>
									<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
										<Phone class="h-4 w-4" />
										Phone
									</label>
									<p class="text-gray-900">{application.emergencyContact.phone}</p>
								</div>
								<div>
									<label class="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
										<Users class="h-4 w-4" />
										Relationship
									</label>
									<p class="text-gray-900 capitalize">
										{application.emergencyContact.relationship}
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="space-y-6">
				<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 p-6">
						<div class="flex items-center gap-2">
							<Settings class="h-5 w-5 text-gray-600" />
							<h3 class="text-lg font-semibold text-gray-900">Quick Stats</h3>
						</div>
					</div>
					<div class="space-y-4 p-6">
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-2 text-sm text-gray-600">
								<Bike class="h-4 w-4" />
								Has Motorbike
							</span>
							<span class="text-sm font-medium text-gray-900"
								>{application.hasMotorbike ? 'Yes' : 'No'}</span
							>
						</div>
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-2 text-sm text-gray-600">
								<Award class="h-4 w-4" />
								Ownership Program
							</span>
							<span class="text-sm font-medium text-gray-900"
								>{application.interestedInOwnershipProgram ? 'Interested' : 'Not Interested'}</span
							>
						</div>
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-2 text-sm text-gray-600">
								<Clock class="h-4 w-4" />
								Experience
							</span>
							<span class="text-sm font-medium text-gray-900"
								>{application.yearsOfRidingExperience}yr</span
							>
						</div>
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-2 text-sm text-gray-600">
								<Briefcase class="h-4 w-4" />
								Commercial Exp.
							</span>
							<span class="text-sm font-medium text-gray-900"
								>{application.hasCommercialExperience ? 'Yes' : 'No'}</span
							>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 p-6">
						<div class="flex items-center gap-2">
							<Calendar class="h-5 w-5 text-gray-600" />
							<h3 class="text-lg font-semibold text-gray-900">Timeline</h3>
						</div>
					</div>
					<div class="space-y-4 p-6">
						<div class="flex items-start gap-3">
							<div class="mt-2 h-2 w-2 rounded-full bg-blue-600"></div>
							<div class="flex-1">
								<p class="text-sm font-medium text-gray-900">Application Submitted</p>
								<p class="text-xs text-gray-500">{formatDateTime(application.submittedAt)}</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<div class="mt-2 h-2 w-2 rounded-full bg-gray-300"></div>
							<div class="flex-1">
								<p class="text-sm font-medium text-gray-900">Last Updated</p>
								<p class="text-xs text-gray-500">{formatDateTime(application.lastUpdated)}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 p-6">
						<div class="flex items-center gap-2">
							<Settings class="h-5 w-5 text-gray-600" />
							<h3 class="text-lg font-semibold text-gray-900">Actions</h3>
						</div>
					</div>
					<div class="space-y-3 p-6">
						{#if application.status !== 'approved'}
							<form method="POST" action="?/approve">
								<input type="hidden" name="reviewNotes" value="Candidate meets all requirements" />
								<button
									type="submit"
									class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
								>
									<CheckCircle class="h-4 w-4" />
									Approve Application
								</button>
							</form>

							<form
								method="POST"
								action="?/delete"
								on:submit={() => confirm('Are you sure you want to delete this application?')}
							>
								<button
									type="submit"
									class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
								>
									<XCircle class="h-4 w-4" />
									Delete Application
								</button>
							</form>
						{/if}
						<form method="POST" action="?/scheduleInterview" class="space-y-4">
							<div class="space-y-2">
								<label for="interviewDate" class="text-md block font-medium text-gray-700">
									Interview Date & Time
								</label>
								<input
									type="datetime-local"
									name="interviewDate"
									id="interviewDate"
									required
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
								/>
							</div>

							<div>
								<label for="interviewNotes" class="text-md block font-medium text-gray-700"
									>Interview Notes</label
								>
								<textarea
									name="interviewNotes"
									id="interviewNotes"
									rows="3"
									required
									class="mt-3 w-full resize-none rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none"
								></textarea>
							</div>

							<button
								type="submit"
								class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
							>
								<Calendar class="h-4 w-4" />
								Schedule Interview
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
