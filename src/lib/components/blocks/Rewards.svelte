<script lang="ts">
	import { Gift } from 'lucide-svelte';


    type Benefit = {
        label: string;
        buttonText: string;
    };

    export const benefits: Benefit[] = [
        { label: "Priority Matching", buttonText: "Active" },
        { label: "Exclusive Discounts", buttonText: "Active" },
        { label: "Premium Support", buttonText: "Active" },
        { label: "Flexible Cancellation", buttonText: "Next Tier" }
    ];
</script>

<div class="w-200 h-168 border bg-white rounded-xl">
	<!-- Loyalty Program Header -->
	<h1 class="mt-6 ml-8 text-2xl">Loyalty Program – <span class="text-gray-500"> Premium Level</span></h1>

	<!-- Points Display -->
	<div class="mt-4 rounded-lg w-184 mx-auto h-36 bg-linear-to-r text-center from-[#0CEA00] to-[#B0FF93] p-6  text-black shadow-md"
	>
		<h2 class="text-5xl mt-3 font-semibold">1250</h2>
		<p class="text-[1.7em]">Points Available</p>
	</div>

	<!-- Benefits List -->
	<div class="space-y-4 w-184 h-96 rounded-lg py-7 px-8 border mx-auto mt-8">
		{#each benefits as benefit}
			<div class="flex items-center justify-between rounded-lg bg-[#0BDF00]/15 border border-[#0BDF00]/50 p-4 shadow-sm">
				<div class="flex items-center space-x-3">
					<span class="text-xl text-green-500"><Gift /></span>
					<p class="text-gray-800">{benefit.label}</p>
				</div>
				<button
					class="rounded-md bg-linear-to-r text-center from-[#0CEA00] to-[#B0FF93] px-4 py-2 text-sm font-semibold text-green-800">
					{benefit.buttonText}
				</button>
			</div>
		{/each}
	</div>
</div>
