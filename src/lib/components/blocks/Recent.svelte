<script lang="ts">
	import { Activity } from 'lucide-svelte';
    
</script>

    <!-- Recent Activity List -->
    <div class="mt-6 w-[50rem] p-6 bg-white border rounded-xl space-y-3">
        <div class="space-y-4">
            <!-- Ride Completed -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <span class="bg-orange-100 text-orange-500 p-3 rounded"><Activity /></span>
                    <div>
                        <p class="text-gray-800 font-semibold">Ride Completed</p>
                        <p class="text-gray-500 -mt-[0.2rem] text-sm">Airport - East Legon</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-gray-800 font-semibold">GHS 45</p>
                    <p class="text-gray-500 text-sm">2024-03-20</p>
                </div>
            </div>

            <!-- Motorcycle Registration -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <span class="bg-orange-100 text-orange-500 p-3 rounded"><Activity /></span>
                    <div>
                        <p class="text-gray-800 font-semibold">Motorcycle Registration</p>
                        <p class="text-gray-500 -mt-[0.2rem] text-sm">Expires: 2025-06-15</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-gray-800 font-semibold">GHS 45</p>
                    <p class="text-gray-500 text-sm">2024-03-20</p>
                </div>
            </div>

            <!-- Insurance -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <span class="bg-orange-100 text-orange-500 p-3 rounded"><Activity /></span>
                    <div>
                        <p class="text-gray-800 font-semibold">Insurance</p>
                        <p class="text-gray-500 -mt-[0.2rem] text-sm">Expires: 2025-06-15</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-gray-800 font-semibold">GHS 45</p>
                    <p class="text-gray-500 text-sm">2024-03-20</p>
                </div>
            </div>

            <!-- Police Clearance -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <span class="bg-orange-100 text-orange-500 p-3 rounded"><Activity /></span>
                    <div>
                        <p class="text-gray-800 font-semibold">Police Clearance</p>
                        <p class="text-gray-500 -mt-[0.2rem] text-sm">Expires: 2025-06-15</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-gray-800 font-semibold">GHS 45</p>
                    <p class="text-gray-500 text-sm">2024-03-20</p>
                </div>
            </div>
        </div>
    </div>
