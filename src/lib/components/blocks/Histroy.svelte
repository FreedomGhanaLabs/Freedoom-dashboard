<script lang="ts">
    import { Clock, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-svelte';

    type Ride = {
        route: string;
        date: string;
        fare: string;
        status: string;
    };

    const rides: Ride[] = [
        {
            route: "Accra Mall → Labadi Beach",
            date: "2024-12-27",
            fare: "GHS 25.00",
            status: "Verified"
        },
        {
            route: "Accra Mall → Labadi Beach",
            date: "2024-12-27",
            fare: "GHS 25.00",
            status: "Verified"
        },
        {
            route: "Accra Mall → Labadi Beach",
            date: "2024-12-27",
            fare: "GHS 25.00",
            status: "Verified"
        }
    ];
</script>

<div class='w-[50rem] h-[32rem]  border bg-white rounded-xl '>
	<!-- Recent Rides Header -->
	<h1 class="mt-6 ml-10 text-2xl font-bold">Recent Rides</h1>

	<!-- Rides List -->
	<div class="space-y-4">
        {#each rides as ride}
            <div class="flex items-center border w-[45rem] mx-auto justify-between rounded-lg p-6 shadow-sm">
                <div class="flex items-center space-x-4">
                    <span class="text-2xl text-orange-500 p-4 bg-[#FFB230]/30 rounded-lg">
                        <Clock class="size-6" />
                    </span>
                    <div>
                        <p class="text-gray-800">{ride.route}</p>
                        <p class="text-sm text-gray-500">{ride.date}</p>
                    </div>
                </div>
                <div class="flex flex-col items-center space-x-2">
                    <p class="font-normal text-[#EA9300]">{ride.fare}</p>
                    <p class="flex items-center border border-[#0BDF00] text-black py-1 px-2 bg-[#0BDF00]/40 rounded-lg">
                        <span class="mr-1">
                            <BadgeCheck class="size-4" />
                        </span> {ride.status}
                    </p>
                </div>
            </div>
        {/each}
	</div>


	
</div>