<script lang="ts">
	interface StatsType {
		number?: number;
		label: string;
	}

	interface Props {
		Title: string;
		Description?: string;
		Stats?: StatsType;
		value: string;
	}
	let { Title, Description, value, Stats }: Props = $props();

	import { Maximize2, SquareUser, VenetianMask, UserSearch } from 'lucide-svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { ArrowUpRight } from 'lucide-svelte';

	let icon1 = $state(VenetianMask);

	switch (Title) {
		case 'Total Rides':
			icon1 = VenetianMask;
			break;
		case 'Pending Rides':
			icon1 = UserSearch;
			break;
		case 'Total Revenue':
			icon1 = SquareUser;
			break;
		case 'Completed Rides':
			icon1 = UserSearch;
		default:
			break;
	}
</script>

<Card.Root class="relative min-h-40 w-84 p-1">
	<Card.Header>
		<div class="flex flex-row items-center">
			<div class="rounded-lg bg-slate-200 p-2">
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={icon1} />
			</div>
			<span>
				<Card.Title class="ml-4 text-base font-normal text-black">{Title}</Card.Title>
				<Card.Description class="ml-4 text-sm font-normal text-black"
					>{Description}</Card.Description
				>
			</span>
			<span class="ml-[5.8rem] rounded-lg border-2 border-[#888888] p-2 text-[#888888]">
				<Maximize2 class="text-[#888888]" />
			</span>
		</div>
	</Card.Header>
	<Card.Content class="absolute bottom-0">
		<p class="text-[1rem] font-bold">{value}</p>
		{#if Stats}
			<span class="mt-3 flex flex-row items-center space-x-3 text-sm">
				{#if Stats?.number}
					<p class="flex items-center font-normal text-[#17CE06]">
						<ArrowUpRight />
						{Stats?.number}%
					</p>
				{/if}
				<p class="text-gray-500">
					{Stats?.label}
				</p>
			</span>
		{/if}
	</Card.Content>
</Card.Root>
