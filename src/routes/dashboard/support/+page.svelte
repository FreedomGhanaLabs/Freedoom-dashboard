<script lang="ts">
	import TableGroup from './TableGroup.svelte';
	import type { PageData } from './$types';
	import type { Ticket, SupportTicket } from '$lib/ticketStore';
	import { BadgeCheck, Clock, FileText } from '@lucide/svelte';

	const { data } = $props<{ data: PageData & { support: SupportTicket[]; stats: any } }>();

	let supportTickets: SupportTicket[] = data.support ?? [];
	let currentPage = data.currentPage;
	let totalPages = data.totalPages;

	let ticketStats = data.stats?.data ?? {};

	let visibleCategories: string[] = [
		'All Tickets',
		...new Set(supportTickets.map((ticket) => String(ticket.category)))
	];

	let activeCategory = $state('All Tickets');
	let showAllCategories = $state(false);

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.location.href = `?page=${page}`;
	}

	function formatTicketData(ticket: SupportTicket): Ticket {
		return {
			_id: ticket._id || '#0000',
			subject: ticket.subject || '-',
			subcategory: ticket.subcategory || '-',
			priority: ticket.priority || '-',
			userType: ticket.creator?.userType || 'unknown',
			serviceType: ticket.serviceType || 'N/A',
			customer: ticket.creator?.name || 'Unknown User',
			email: ticket.creator?.email || 'N/A',
			phone: 'N/A',
			date: new Date(ticket.createdAt).toLocaleDateString() || '-',
			status: ticket.status || '-',
			category: ticket.category || '-',
			description: ticket.subject || 'No detailed description available',
			messages: []
		};
	}

	let formattedTickets: Ticket[] = supportTickets.map(formatTicketData);

	let filteredRiders = $derived<Ticket[]>(
		activeCategory === 'All Tickets'
			? formattedTickets
			: formattedTickets.filter((ticket) => ticket.category === activeCategory)
	);

	let displayCategories = $derived(
		showAllCategories ? visibleCategories : visibleCategories.slice(0, 4)
	);

	const changeCategory = (category: string) => {
		console.log('Category button clicked:', category);
		activeCategory = category;
		console.log('activeCategory updated to:', activeCategory);
	};

	const toggleAllCategories = () => {
		console.log('Toggle button clicked, showAllCategories:', !showAllCategories);
		showAllCategories = !showAllCategories;
	};

	const formatResolutionTime = (hours: string) => {
		const h = parseFloat(hours);
		if (h < 24) return `${Math.round(h)}h`;
		return `${Math.round(h / 24)}d`;
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'open':
				return 'bg-blue-100 text-blue-800';
			case 'resolved':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'closed':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const resolutionRate =
		ticketStats.totalTickets > 0
			? Math.round(((ticketStats.byStatus?.resolved || 0) / ticketStats.totalTickets) * 100)
			: 0;

	const headings = [
		{ title: 'Creator', className: '', key: 'userType' },
		{ title: 'Creator Name', className: '', key: 'customer' },
		{ title: 'Email', className: '', key: 'email' },
		{ title: 'Phone', className: '', key: 'phone' },
		{ title: 'Subject', className: '', key: 'subject' },
		{ title: 'Priority', className: '', key: 'priority' },
		{ title: 'Date', className: '', key: 'date' },
		{ title: 'Status', className: '', key: 'status' },
		{ title: 'Service Type', className: '', key: 'serviceType' },
		{ title: 'Subcategory', className: '', key: 'subcategory' },
		{ title: 'Category', className: '', key: 'category' }
	];
</script>

<svelte:head>
	<title>Support - Admin Panel</title>
</svelte:head>

<div class="mx-auto">
	<div class="my-12 w-388 rounded-lg bg-white">
		<section class="mt-4 items-center justify-between px-12 py-6">
			<div class="flex items-center gap-4">
				<h1 class="text-3xl font-bold">Support Center</h1>
			</div>

			<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium tracking-wide text-blue-600 uppercase">Total Tickets</p>
							<p class="mt-2 text-3xl font-bold text-blue-900">{ticketStats.totalTickets || 0}</p>
						</div>
						<div class="rounded-full bg-blue-500 p-3">
							<FileText class="text-white" />
						</div>
					</div>
				</div>

				<div
					class="rounded-xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-6"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium tracking-wide text-green-600 uppercase">
								Resolution Rate
							</p>
							<p class="mt-2 text-3xl font-bold text-green-900">{resolutionRate}%</p>
						</div>
						<div class="rounded-full bg-green-500 p-3">
							<BadgeCheck class="text-white" />
						</div>
					</div>
				</div>

				<div
					class="rounded-xl border border-amber-200 bg-linear-to-br from-amber-50 to-amber-100 p-6"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium tracking-wide text-amber-600 uppercase">
								Avg Resolution
							</p>
							<p class="mt-2 text-3xl font-bold text-amber-900">
								{formatResolutionTime(ticketStats.avgResolutionTimeHours || '0')}
							</p>
						</div>
						<div class="rounded-full bg-amber-500 p-3">
							<Clock class="text-white" />
						</div>
					</div>
				</div>

				<div
					class="rounded-xl border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-6"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium tracking-wide text-purple-600 uppercase">
								Satisfaction
							</p>
							<div class="mt-2 flex items-center">
								<p class="text-3xl font-bold text-purple-900">
									{parseFloat(ticketStats.satisfactionRatings?.averageRating || '0').toFixed(1)}
								</p>
								<div class="ml-2 flex">
									{#each Array(5) as _, i}
										<svg
											class="h-4 w-4 {i <
											Math.round(parseFloat(ticketStats.satisfactionRatings?.averageRating || '0'))
												? 'text-yellow-400'
												: 'text-gray-300'}"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											></path>
										</svg>
									{/each}
								</div>
							</div>
						</div>
						<div class="rounded-full bg-purple-500 p-3">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Status Breakdown</h3>
					<div class="space-y-3">
						{#each Object.entries(ticketStats.byStatus || {}) as [status, count]}
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {getStatusColor(
											status
										)}"
									>
										{status}
									</span>
									<span class="ml-3 text-sm text-gray-600">{count} tickets</span>
								</div>
								<div class="mx-4 flex-1">
									<div class="h-2 rounded-full bg-gray-200">
										<div
											class="h-2 rounded-full bg-blue-500"
											style="width: {ticketStats.totalTickets > 0
												? (Number(count) / ticketStats.totalTickets) * 100
												: 0}%"
										></div>
									</div>
								</div>
								<span class="text-sm font-medium text-gray-900"
									>{ticketStats.totalTickets > 0
										? Math.round((Number(count) / ticketStats.totalTickets) * 100)
										: 0}%</span
								>
							</div>
						{/each}
					</div>
				</div>

				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Priority Breakdown</h3>
					<div class="space-y-3">
						{#each Object.entries(ticketStats.byPriority || {}) as [priority, count]}
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {getPriorityColor(
											priority
										)}"
									>
										{priority}
									</span>
									<span class="ml-3 text-sm text-gray-600">{count} tickets</span>
								</div>
								<div class="mx-4 flex-1">
									<div class="h-2 rounded-full bg-gray-200">
										<div
											class="h-2 rounded-full bg-red-500"
											style="width: {ticketStats.totalTickets > 0
												? (Number(count) / ticketStats.totalTickets) * 100
												: 0}%"
										></div>
									</div>
								</div>
								<span class="text-sm font-medium text-gray-900"
									>{ticketStats.totalTickets > 0
										? Math.round((Number(count) / ticketStats.totalTickets) * 100)
										: 0}%</span
								>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Category Breakdown</h3>
					<div class="space-y-3">
						{#each Object.entries(ticketStats.byCategory || {}) as [category, count]}
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<span
										class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 capitalize"
									>
										{category.replace('_', ' ')}
									</span>
									<span class="ml-3 text-sm text-gray-600">{count} tickets</span>
								</div>
								<div class="mx-4 flex-1">
									<div class="h-2 rounded-full bg-gray-200">
										<div
											class="h-2 rounded-full bg-indigo-500"
											style="width: {ticketStats.totalTickets > 0
												? (Number(count) / ticketStats.totalTickets) * 100
												: 0}%"
										></div>
									</div>
								</div>
								<span class="text-sm font-medium text-gray-900"
									>{ticketStats.totalTickets > 0
										? Math.round((Number(count) / ticketStats.totalTickets) * 100)
										: 0}%</span
								>
							</div>
						{/each}
					</div>
				</div>

				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Service Type Breakdown</h3>
					<div class="space-y-3">
						{#each Object.entries(ticketStats.byServiceType || {}) as [serviceType, count]}
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<span
										class="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800 capitalize"
									>
										{serviceType}
									</span>
									<span class="ml-3 text-sm text-gray-600">{count} tickets</span>
								</div>
								<div class="mx-4 flex-1">
									<div class="h-2 rounded-full bg-gray-200">
										<div
											class="h-2 rounded-full bg-teal-500"
											style="width: {ticketStats.totalTickets > 0
												? (Number(count) / ticketStats.totalTickets) * 100
												: 0}%"
										></div>
									</div>
								</div>
								<span class="text-sm font-medium text-gray-900"
									>{ticketStats.totalTickets > 0
										? Math.round((Number(count) / ticketStats.totalTickets) * 100)
										: 0}%</span
								>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-6 flex flex-wrap gap-2">
				{#each displayCategories as category}
					<button
						class="pointer-events-auto cursor-pointer rounded-lg border px-4 py-2 {activeCategory ===
						category
							? 'border-amber-300 bg-amber-300/30'
							: 'bg-white'}"
						onclick={() => changeCategory(category)}
					>
						{category}
					</button>
				{/each}
				<button class="rounded-lg border px-4 py-2 text-orange-500" onclick={toggleAllCategories}>
					{showAllCategories ? 'Show Less' : 'Show More'}
				</button>
			</div>
		</section>
		<h2 class="mb-6 ml-12 text-2xl font-bold">
			Support Tickets{activeCategory !== 'All Tickets' ? ` - ${activeCategory}` : ''}
		</h2>
		<TableGroup {headings} invoices={filteredRiders} />

		<div class="my-10 flex items-center justify-between px-[5rem]">
			<p
				class="rounded-md border border-gray-300 bg-white px-2 py-3 text-sm text-gray-600 shadow-sm"
			>
				Page {currentPage} of {totalPages}
			</p>

			<nav
				class="inline-flex items-center space-x-1 mb-10 rounded-md border border-gray-300 bg-white px-2 py-3 shadow-sm"
			>
				<button
					onclick={() => goToPage(currentPage - 1)}
					class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
					disabled={currentPage === 1}
				>
					← Prev
				</button>

				{#each Array(totalPages)
					.fill(0)
					.slice(0, 6)
					.map((_, i) => i + currentPage - 2)
					.filter((p) => p >= 1 && p <= totalPages) as page}
					<button
						class="rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-100 {page === currentPage
							? 'bg-orange-500 text-white'
							: 'text-gray-700'}"
						onclick={() => goToPage(page)}
					>
						{page}
					</button>
				{/each}

				<button
					onclick={() => goToPage(currentPage + 1)}
					class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
					disabled={currentPage === totalPages}
				>
					Next →
				</button>
			</nav>
		</div>
	</div>
</div>
