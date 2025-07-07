<script lang="ts">
	import { Activity, BadgeCheck, Banknote, Bike, Mail, MapPin, Maximize2, PartyPopper, Phone, Star } from 'lucide-svelte';
	import Driver from '$lib/assets/driver.png';
	
</script>


<div class="w-[70rem] mx-auto">
    	<!-- Performance Metrics and Driver Notes -->
	<div class="grid grid-cols-2 gap-6">
		<div class="rounded-lg bg-gray-50 p-4 shadow-sm">
			<h3 class="mb-4 text-lg font-semibold">Performance Metrics</h3>
			<div class="space-y-4">
				<div>
					<p class="mb-1 text-gray-800">Completion Rate</p>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div class="h-2.5 rounded-full bg-green-500" style="width: 95%"></div>
					</div>
					<p class="mt-1 text-sm text-gray-600">95%</p>
				</div>
				<div>
					<p class="mb-1 text-gray-800">Cancel Rate</p>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div class="h-2.5 rounded-full bg-red-500" style="width: 3%"></div>
					</div>
					<p class="mt-1 text-sm text-gray-600">3%</p>
				</div>
				<p class="text-gray-800">
					Average Response Time <span class="text-orange-500">45 sec</span>
				</p>
			</div>
		</div>
		<div class="rounded-lg bg-gray-50 p-6  shadow-sm">
			<h3 class="mb-4 text-lg font-semibold ml-1">Driver Notes</h3>
			<textarea
				class="h-32 w-full resize-none rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
				placeholder="Add notes about this driver"
			></textarea>
		</div>
	</div>
      

</div> 