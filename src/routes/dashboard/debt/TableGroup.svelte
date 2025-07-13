<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { Debt } from '$lib/debt';
	import { page } from '$app/state';

	type Status = 'Active' | 'Pending' | 'Inactive';

	function getStatusStyle(status: Status | string) {
		const styles = {
			Active: 'bg-green-200 text-[#0BDF00]',
			Pending: 'bg-yellow-200 text-[#FFA40A]',
			Inactive: 'bg-red-200 text-[#E31D1C]',
			Resolved: 'bg-green-100 text-green-800',
			Closed: 'bg-gray-100 text-gray-800',
			Open: 'bg-blue-100 text-blue-800'
		};
		return `rounded px-2 py-1 ${styles[status as Status] || ''}`;
	}

	interface Heading {
		title: string;
		className?: string;
		key?: string;
	}

	interface Props {
		headings: Heading[];
		invoices: (
			
			 Debt
			
		)[];
	}

	let { headings, invoices }: Props = $props();

	const paginationItems = [
		{ type: 'prev', label: 'Prev Page', href: '#' },
		{ type: 'page', label: '1', href: '#' },
		{ type: 'page', label: '2', href: '#' },
		{ type: 'page', label: '3', href: '#', active: true },
		{ type: 'page', label: '4', href: '#' },
		{ type: 'next', label: 'Next Page', href: '#' }
	];

	function deriveKey(title: string): string {
		const key = title.replace(/\s+/g, '');
		const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
		return lowerKey === 'ridesCompleted' ? 'rideCompleted' : lowerKey;
	}

	function getCellContent(
		invoice:
			
			| Debt,
			
		key: string
	) {
		if (key in invoice) {
			return invoice[key as keyof typeof invoice];
		}

		const keyMap: Record<string, string> = {
			pickupLocation: 'pickup',
			dropOffLocation: 'dropoff',
			driverId: 'id',
			accountId: 'id'
		};

		const mappedKey = keyMap[key];
		if (mappedKey && mappedKey in invoice) {
			return invoice[mappedKey as keyof typeof invoice];
		}

		return '';
	}
</script>

<Table.Root class="relative mx-auto mt-3 w-368 rounded-3xl">
	<Table.Caption>
		<div class="my-5 flex flex-row items-center justify-between">
			<div class="w-fit rounded-md border border-gray-400 bg-white/70 p-4 text-center">
				Page 1 of 30
			</div>
			<div>
				<ol
					class="flex justify-center space-x-2 rounded-lg border border-gray-500 bg-slate-400/30 p-2 px-4 text-xs font-medium"
				>
					{#each paginationItems as item}
						{#if item.type === 'prev'}
							<li>
								<a
									href={item.href}
									class="inline-flex size-8 items-center justify-center rounded-sm border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
								>
									<span class="sr-only">{item.label}</span>
									<ChevronLeft />
								</a>
							</li>
						{:else if item.type === 'next'}
							<li>
								<a
									href={item.href}
									class="inline-flex size-8 items-center justify-center rounded-sm border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
								>
									<span class="sr-only">{item.label}</span>
									<ChevronRight />
								</a>
							</li>
						{:else}
							<li
								class={item.active
									? 'block size-8 rounded-sm border border-orange-600 bg-white text-center leading-8 text-orange-400'
									: 'block size-8  rounded-sm border border-gray-100 bg-slate-100 text-center leading-8 text-red-500 '}
							>
								{#if !item.active}
									<a href={item.href}>{item.label}</a>
								{:else}
									{item.label}
								{/if}
							</li>
						{/if}
					{/each}
				</ol>
			</div>
		</div>
	</Table.Caption>
	<Table.Header class="bg-slate-200/70 py-12">
		<Table.Row>
			{#each headings as { className, title }}
				<Table.Head scope="col" class={[className, ` py-6 text-lg text-black`]}>
					{title}
				</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each invoices as invoice, i (i)}
			<Table.Row>
				{#each headings as heading, i}
					{#if page.url.href.includes('debt')}
						<Table.Cell class="{heading.className} border-b border-dashed border-gray-300 ">
							<a
								class="flex items-center space-x-2"
								href={invoice && '_id' in invoice ? `/dashboard/debt/${invoice._id}` : '#'}
							>
								{#if heading.key === 'status' && 'status' in invoice}
								{:else}
									{getCellContent(invoice, heading.key || deriveKey(heading.title))}
								{/if}
							</a>
						</Table.Cell>
					{:else}
						<Table.Cell class="{heading.className} border-b border-dashed border-gray-300 ">
							{#if heading.key === 'status' && 'status' in invoice}
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
