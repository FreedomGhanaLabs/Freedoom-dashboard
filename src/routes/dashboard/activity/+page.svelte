<script lang="ts">
	import {  Download,  Plus, Search } from 'lucide-svelte';
	import { type Debt } from '$lib/debt';
	import TableGroup from './TableGroup.svelte';
	import  { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';
	
    
	const { data } = $props<{ data: PageData }>();


    function formatTimestamp(isoString: string): string {
	return new Date(isoString).toLocaleString('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
}
  
	let activity = data.activity.map((entry: any) => ({
            ...entry,
            formattedTimestamp: formatTimestamp(entry.timestamp)
        }));

	let headings: {
		title: string;
		className: string;
		key: string ;
		}[] = [
		{ title: 'Id', className: 'rounded-s-2xl', key: '_id' },
		{ title: 'Admin ID',  className: '',          key: 'adminId'  },
		{ title: 'Action',    className: '',   	    key: 'action'    },
		{ title: 'Time Stamp',    className: '',  	        key: 'formattedTimestamp' },
		{ title: 'Ip Address', className: 'rounded-e-2xl', 	key: 'ipAddress' }
	]


   let searchTerm = '';


  let  filteredActivity = searchTerm

    ? activity.filter((d:any) => {
        const q = searchTerm.toLowerCase();
        return (
          d.recipientName?.toLowerCase().includes(q) ||
          d.recipientPhone?.toLowerCase().includes(q) ||
          d.packageName?.toLowerCase().includes(q) ||
          d.packageType?.toLowerCase().includes(q)
        );
      })
    : activity;

	function handleDownload() {
		downloadCSV(headings, activity, 'Activity.csv');
	}
</script>

<svelte:head>
  <title>Activity - Admin Panel</title>
</svelte:head>

<div class="mx-auto">

	<div class="my-12 w-388 rounded-lg bg-white">
		<div class="mt-4 flex items-center justify-between px-20 py-6">
			<h3 class="text-2xl">Activity Logs</h3>
			<div class="flex items-center space-x-5">
				<form class="mx-auto max-w-md">
					<label for="default-search" class="sr-only">Search</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<Search class="h-4 w-4 text-gray-500" />
						</div>
						<input
							type="search"
							id="default-search"
							bind:value={searchTerm}
							class="block w-fit max-w-52 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-none "
							placeholder="Search"
							required
						/>
					</div>
				</form>
				<button
					onclick={handleDownload}
					class="flex items-center gap-2 rounded-lg border border-gray-500  px-4 py-3 text-gray-800"
				>
					
					<Download class="h-5 w-5" />
					<span>Download CSV</span>
				</button>
			</div>
		</div>

		<TableGroup {headings} invoices={filteredActivity} />
	</div>
</div>
