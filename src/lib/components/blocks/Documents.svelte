<script lang="ts">
	import { BadgeCheck, Maximize2 } from 'lucide-svelte';
    import Document from '$lib/assets/document.svg';

    
</script>

    <!-- Documents List -->
    <div class=" mt-4 w-[50rem] p-4 border bg-white rounded-xl space-y-3">
        <!-- Driver's License -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div class="flex items-center space-x-3">
               <img src={Document} alt="Document" class="size-[3.5rem] p-3 bg-orange-500/30 rounded-lg" />
                <div>
                    <p class="text-gray-800 font-semibold">Driver's License</p>
                    <p class="text-gray-500 text-sm">Expires: 2025-06-15</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <p class=" flex items-center rounded-lg bg-green-300/30 px-2 py-1  text-green-500">
					<span class="mr-1"><BadgeCheck class="size-4" /></span> Verified
				</p>
                <button class="text-orange-500 flex px-2 py-1 items-center hover:underline">View <span class="ml-2"><Maximize2 class="size-3"  /></span></button>
            </div>
        </div>

        <!-- Motorcycle Registration -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <img src={Document} alt="Document" class="size-[3.5rem] p-3 bg-orange-500/30 rounded-lg" />
                <div>
                    <p class="text-gray-800 font-semibold">Motorcycle Registration</p>
                    <p class="text-gray-500 text-sm">Expires: 2025-06-15</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <p class=" flex items-center rounded-lg bg-green-300/30 px-2 py-1  text-green-500">
					<span class="mr-1"><BadgeCheck class="size-4" /></span> Verified
				</p>
                <button class="text-orange-500 flex px-2 py-1 items-center hover:underline">View <span class="ml-2"><Maximize2 class="size-3"  /></span></button>
            </div>
        </div>

        <!-- Insurance -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <img src={Document} alt="Document" class="size-[3.5rem] p-3 bg-orange-500/30 rounded-lg" />
                <div>
                    <p class="text-gray-800 font-semibold">Insurance</p>
                    <p class="text-gray-500 text-sm">Expires: 2025-06-15</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <p class=" flex items-center rounded-lg bg-green-300/30 px-2 py-1  text-green-500">
					<span class="mr-1"><BadgeCheck class="size-4" /></span> Verified
				</p>
                <button class="text-orange-500 flex px-2 py-1 items-center hover:underline">View <span class="ml-2"><Maximize2 class="size-3"  /></span></button>
            </div>
        </div>

        <!-- Police Clearance -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <img src={Document} alt="Document" class="size-[3.5rem] p-3 bg-orange-500/30 rounded-lg" />
                <div>
                    <p class="text-gray-800 font-semibold">Police Clearance</p>
                    <p class="text-gray-500 text-sm">Expires: 2025-06-15</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <p class=" flex items-center rounded-lg  px-2 py-1 bg-yellow-100 text-yellow-500">
					<span class="mr-1"><BadgeCheck class="size-4" /></span> Pending
				</p>
                <button class="text-orange-500 flex px-2 py-1 items-center hover:underline">View <span class="ml-2"><Maximize2 class="size-3"  /></span></button>
            </div>
           
        </div>
    </div>