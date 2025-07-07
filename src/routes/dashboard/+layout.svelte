<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import NavBar from '$lib/components/blocks/NavBar.svelte';
	import Stat from '$lib/components/blocks/Stat.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from './sidebar/components/app-sidebar.svelte';
	import { page } from '$app/state';

	interface StatType {
		title: string;
		description?: string;
		value: string;
		Stats?: {
			number?: number;
			label: string;
		};
	}

	const statList: StatType[] = [
		{ title: 'Total Rides', description: '(This month)', value: '25,340' },
		{
			title: 'Total Revenue',
			value: 'GHS 1.2M',
			Stats: { number: 0.5, label: 'From GHS 980K last period' }
		},
		{ title: 'Pending Rides', value: '200', Stats: { number: 0.5, label: 'vs 1hr ago' } },
		{ title: 'Completed Rides', value: '245,000', Stats: { label: '(96.7% Completion Rate)' } }
	];

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<NavBar />

<Sidebar.Provider class="relative">
	<AppSidebar />
	<Sidebar.Inset class="bg-gray-200/40">
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="absolute -top-16 -ml-1" />
			</div>
		</header>
		<!-- <section
			class:sm:hidden={page.url.pathname.includes('mgmt') || page.url.pathname.includes('driver')}
			class="mx-auto hidden flex-row space-x-16 sm:flex"
		>
			{#each statList as stat}
				<div class="py-4">
					<Stat
						Title={stat.title}
						value={stat.value}
						{...stat.description ? { Description: stat.description } : {}}
						{...stat.Stats ? { Stats: stat.Stats } : {}}
					></Stat>
				</div>
			{/each}
		</section> -->
		{@render children?.()}
	</Sidebar.Inset>
</Sidebar.Provider>
