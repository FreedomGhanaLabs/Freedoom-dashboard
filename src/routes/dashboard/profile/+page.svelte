<script lang="ts">
	import type { PageData } from './$types';
	import { Progress } from '$lib/components/ui/progress/index.js';
	let { data }: { data: PageData } = $props();

	let completionRate = 33;
	let cancelRate = 33;
</script>

<div class="rounded-lg border border-gray-400 p-4">
	<h3>Performance Metrics</h3>
	<p>Completion Rate</p>
	<div class="flex w-full items-center space-x-4">
		<Progress class="ml-3 mr-3 h-3 bg-gray-300" value={completionRate} />
		{completionRate}%
	</div>
</div>
