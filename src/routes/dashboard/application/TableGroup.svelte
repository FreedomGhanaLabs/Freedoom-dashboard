<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { Application } from '$lib/application'; // Import Application type
	import { page } from '$app/state';

	// Helper function to get status styles
	function getStatusStyle(status: string) {
		const styles: Record<string, string> = {
			active: 'bg-green-200 text-[#0BDF00]',
			pending: ' text-[black]',
			approved: 'bg-green-100 text-green-800',
			resolved: 'bg-green-100 text-green-800',
			closed: 'bg-gray-100 text-gray-800',
			open: 'bg-blue-100 text-blue-800',
		};
		// Normalize status to lowercase to handle case sensitivity
		return `rounded px-2 py-1 ${styles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`;
	}

	interface Heading {
		title: string;
		className?: string;
		key?: string;
	}

	interface Props {
		headings: Heading[];
		invoices: Application[]; // Use Application type instead of User
	}

	let { headings, invoices }: Props = $props();

	// Add pagination items array
	const paginationItems = [
		{ type: 'prev', label: 'Prev Page', href: '#' },
		{ type: 'page', label: '1', href: '#' },
		{ type: 'page', label: '2', href: '#' },
		{ type: 'page', label: '3', href: '#', active: true },
		{ type: 'page', label: '4', href: '#' },
		{ type: 'next', label: 'Next Page', href: '#' },
	];

	// Debug: Log props to verify data
	console.log('TableGroup Headings:', headings);
	console.log('TableGroup Invoices:', invoices);

	// Helper: Derive a key from heading title if not explicitly provided
	function deriveKey(title: string): string {
		const key = title.replace(/\s+/g, '');
		const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
		return lowerKey === 'ridesCompleted' ? 'rideCompleted' : lowerKey;
	}

	function getCellContent(invoice: Application, key: string) {
		// Directly use the key if it exists in invoice
		if (key in invoice) {
			return invoice[key as keyof Application] ?? '-';
		}

		// Special cases for differently named properties
		const keyMap: Record<string, string> = {
			pickupLocation: 'pickup',
			dropOffLocation: 'dropoff',
			driverId: 'id',
			accountId: 'id',
		};

		const mappedKey = keyMap[key];
		if (mappedKey && mappedKey in invoice) {
			return invoice[mappedKey as keyof Application] ?? '-';
		}

		return '-';
	}
</script>

<Table.Root class="relative mx-auto mt-3 w-368 rounded-3xl">
	
	<Table.Header class="bg-slate-200/70 py-12">
		<Table.Row>
			{#each headings as { className, title }}
				<Table.Head scope="col" class={[className, `py-6 text-lg text-black`]}>
					{title}
				</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each invoices as invoice, i (i)}
			<Table.Row>
				{#each headings as heading}
					{#if page.url.href.includes('application')}
						<Table.Cell class="{heading.className} border-b cursor-pointer border-dashed border-gray-300">
							<a
								class="flex items-center cursor-pointer space-x-2"
								href={invoice && '_id' in invoice ? `/dashboard/application/${invoice._id}` : '#'}
							>
								{#if heading.key === 'status' && 'status' in invoice}
									<span class={getStatusStyle(invoice.status)}>{invoice.status}</span>
								{:else}
									{getCellContent(invoice, heading.key || deriveKey(heading.title))}
								{/if}
							</a>
						</Table.Cell>
					{:else}
						<Table.Cell class="{heading.className} border-b border-dashed border-gray-300">
							{#if heading.key === 'status' && 'status' in invoice}
								<span class={getStatusStyle(invoice.status)}>{invoice.status}</span>
							{:else if heading.key === 'actions'}
								<div class="flex items-center gap-2 text-[#0BDF00]">
									{#if 'actions' in invoice}
										<span>{invoice.actions}</span>
									{/if}
									<ArrowUpRight class="h-4 w-4" />
								</div>
							{:else}
								{getCellContent(invoice, heading.key || deriveKey(heading.title))}
							{/if}
						</Table.Cell>
					{/if}
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>