<script lang="ts">
	import { ListFilter, Plus, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
    import { downloadCSV } from '$lib/csv';


	import { goto } from '$app/navigation';
	import { Download } from '@lucide/svelte';
	import type { PageData } from './$types';
  
	 export let data: PageData;
    
	let transactions = data.transactions ?? []; 

    function formatToTwoDecimal(value: number): string {
        return value.toFixed(2);
        }


	function formatDate(isoDateString: string): string {
	if (!isoDateString) return '-';

	const date = new Date(isoDateString);

	// Format: 08 Jun 2025, 10:00 AM
	return date.toLocaleString('en-US', {
		day: '2-digit',
		month: 'numeric',
		year: 'numeric',
	});
	}


	function flattenRideData(transactions: any) {
		return {
			...transactions,
			id: transactions.id,
			'user.name': transactions.user?.name || '-',
            'user.phone': transactions.user?.phone || '-',
			'ride.pickupLocation': transactions.ride?.pickupLocation?.address || '-',
			'ride.dropoffLocation': transactions.ride?.dropoffLocation?.address || '-',
			'metadata.servicetype': transactions.metadata?.serviceType || '-',
			'ride.duration': transactions.dropoffLocation?.duration || '-',
			'amount': formatToTwoDecimal(Number(transactions.amount.toFixed(2))),
			'status': transactions.status || '-',		
			'createdAt': formatDate(transactions.createdAt),	
		};
	}

	let formattedRides = transactions.map(flattenRideData);

	let headings: {
		title: string;
		className: string;
		key: string ;
		}[] = [
        { title: 'Date',        className: 'rounded-s-2xl',         key: 'createdAt'    },
		{ title: 'Phone',  className: '',          key: 'user.phone'  },
		{ title: 'Pick Up',    className: '',   	    key: 'ride.pickupLocation'    },
		{ title: 'Drop Off',   className: '',            	key: 'ride.dropoffLocation'    },
        { title: 'Service Type',      className: '',            	key: 'metadata.servicetype'},
		{ title: 'Amount',    className: '',  	        key: 'amount'    },
		{ title: 'Currency',       className: '',          key: 'currency'    },
		{ title: 'Status', className: '', 					key: 'status' },
		{ title: 'Payment Method',        className: '',         key: 'paymentMethod'    },
		{ title: 'Reference', className: 'rounded-e-2xl', 	key: 'reference' }
	]


   let searchTerm = '';


  let  filteredFinanceReport = searchTerm

    ? formattedRides.filter((d:any) => {
        const q = searchTerm.toLowerCase();
        return (
          d.recipientName?.toLowerCase().includes(q) ||
          d.recipientPhone?.toLowerCase().includes(q) ||
          d.packageName?.toLowerCase().includes(q) ||
          d.packageType?.toLowerCase().includes(q)
        );
      })
    : formattedRides;

	// --- CSV download logic ---
	function handleDownload() {
		downloadCSV(headings, formattedRides, 'Rides.csv');
	}


  </script>

  <svelte:head>
  <title>Transaction  - Admin Panel</title>
</svelte:head>
  
 

<section class="mx-auto my-[3rem] w-[97rem] rounded-lg bg-white">
	
	<div class="flex items-center space px-12 mb-4">
	<h3 class="text-[2rem] p-10 font-semibold">Transaction Report</h3>
		
		<!-- Search Input -->
		<div class="relative ml-auto mr-5">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search by reference"
				class="border rounded p-3 pl-8 w-64"
			/>
			<Search class="absolute left-2 top-1/2 transform -translate-y-1/2" size={16} />
		</div>
		<button
					onclick={handleDownload}
					class="flex items-center gap-2 rounded-lg border border-gray-500   px-4 py-3 text-gray-800"
				>
					<!-- You can swap in any icon here -->
					<Download class="h-5 w-5" />
					<span>Download CSV</span>
				</button>
	</div>
	<TableGroup {headings} invoices={filteredFinanceReport} />
</section>