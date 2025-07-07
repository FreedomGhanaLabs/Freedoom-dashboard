<script lang="ts">
	import { Chart, Pie, Svg, Tooltip, AreaChart, Area } from 'layerchart';
	import { format } from 'date-fns';
	import { sum } from 'd3-array';
	import { dateSeriesData, invoices, keyColors, values } from '$lib/data';
	import { LinearGradient } from 'layerchart';
	import { Download, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';
	import { downloadCSV } from '$lib/csv';
	import type { PageData } from './$types';
	

	let dataSum = $derived(sum(values, (d: any) => d.value));
	let renderContext: 'svg' | 'canvas' = 'svg';
	let debug = false;

    
	const { data } = $props<{ data: PageData }>();
	let operations = data.operations;

	function formatToTwoDecimal(value: number): string {
	return value.toFixed(2);
	}



	function flattenRideData(operations: any) {
		return {
			...operations,
			'user.phone': operations.user?.phone || '-',
			'estimatedDistance.text': operations.estimatedDistance?.text || '-',
			'estimatedDuration.text': operations.estimatedDuration?.text || '-',
			'pickupLocation.address': operations.pickupLocation?.address || '-',
			'isMultiStop': operations.isMultiStop ? 'Yes' : 'No',
			'dropoffLocation.address': operations.dropoffLocation?.address || '-',
			'timeFare': formatToTwoDecimal(Number(operations.timeFare)),
			'distanceFare': formatToTwoDecimal(Number(operations.distanceFare)),
			'platformCommission': formatToTwoDecimal(Number(operations.platformCommission)),
			'driverEarnings': formatToTwoDecimal(Number(operations.driverEarnings)),
			'totalFare': formatToTwoDecimal(Number(operations.totalFare)),
			'paymentMethod': operations.paymentMethod || '-',
		};
	}

	let formattedRides = operations.map(flattenRideData);

	let headings: {
		title: string;
		className: string;
		key: string ;
		}[] = [
		{ title: 'Recipient Phone', className: 'rounded-s-2xl', key: 'user.phone' },
		{ title: 'Pick Up',  className: '',          key: 'pickupLocation.address'  },
		{ title: 'Drop Off',    className: '',   	    key: 'dropoffLocation.address'    },
		{ title: 'Mulit Stop',   className: '',            	key: 'isMultiStop'    },
		{ title: 'Estimated Distance',    className: '',  	        key: 'estimatedDistance.text'    },
		{ title: 'Estimated Duration',       className: '',          key: 'estimatedDuration.text'    },
		{ title: 'Ride Type', className: '', 					key: 'operationType' },
		{ title: 'Ride Fare',        className: '',         key: 'distanceFare'    },
		{ title: 'Discount',      className: '',            	key: 'discount'    },
		{ title: 'Commission',        className: '',             key: 'platformCommission'    },
		{ title: 'Driver Earnings',   className: '',           	key: 'driverEarnings'    },
		{ title: 'Total Fare', className: '', 					key: 'totalFare' },
		{ title: 'Payment Status',  className: '',           	key: 'paymentStatus'    },
		{ title: 'Payment Method', className: 'rounded-e-2xl', 	key: 'paymentMethod' }
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
  <title>Operations - Admin Panel</title>
</svelte:head>

<section class="mx-auto my-3 flex flex-col space-x-6 lg:flex-row">
	<!-- Line Chart -->
	<div class="space-y-10 rounded-2xl w-[62rem] bg-white p-8">
		<span class="flex flex-row items-center justify-between">
			<h3 class="text-2xl font-semibold">Cashflow</h3>
			<h3>Date</h3>
		</span>
		<div class="h-[20rem] w-[58rem] rounded border p-4">
			<AreaChart data={dateSeriesData} x="date" y="value" {renderContext} {debug}>
				<svelte:fragment slot="marks">
					<LinearGradient class="from-amber-200/50 to-orange-400/10" vertical let:gradient>
						<Area line={{ class: 'stroke-orange-500' }} fill={gradient} />
					</LinearGradient>
				</svelte:fragment>
			</AreaChart>
		</div>
	</div>

	<!-- Pie Chart -->
	<div class="h-[28rem] w-[33rem] rounded-2xl bg-white">
		<h2 class="ml-[2.4rem] mt-[2rem] text-[1.5rem] font-medium">Account Breakdown</h2>
		<div class="ml-[3rem] mt-[-1rem] size-[26rem] overflow-auto pr-[6rem]">
			<Chart data={values} x="value" c="date" cRange={keyColors} let:tooltip>
				<Svg center>
					<Pie {tooltip} />
				</Svg>
				<Tooltip.Root let:data>
					<Tooltip.Header>{format(data.date, 'eee, MMMM do')}</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="value" value={data.value} format="integer" valueAlign="right" />
						<Tooltip.Item
							label="percent"
							value={data.value / dataSum}
							format="percent"
							valueAlign="right"
						/>
					</Tooltip.List>
				</Tooltip.Root>
			</Chart>
		</div>
	</div>
</section>

<!-- Finance Report Table with Filtering and Searching -->
<section class="mx-auto my-[3rem] w-[97rem] rounded-lg bg-white">
	
	<div class="flex items-center space px-12 mb-4">
	<h3 class="text-[2rem] p-10 font-semibold">Operations Report</h3>
		
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