<script lang="ts">
    
    import Shield from '$lib/assets/shield-broken.svg'
    import Emergency from '$lib/assets/emergency.svg'
</script>

<!-- Security Options -->
<div class="bg-white p-6 rounded-lg shadow-sm border w-[50rem] border-gray-200">
    <!-- Security Settings Header -->
    <h1 class="text-2xl font-normal ml-8 mb-4">Security Settings</h1>

    <!-- Two-Factor Authentication -->
    <div class="flex items-center justify-between py-5 px-5 border rounded-lg border-gray-200">
        <div class="flex items-center space-x-3">
            <img src={Shield} alt="" class="size-12" />
            <div>
                <p class="text-gray-800 font-semibold">Two-Factor Authentication</p>
                <p class="text-gray-500 text-sm">Secure your account</p>
            </div>
        </div>
        <button class="border text-gray-800 px-4 py-2 border-gray-200 rounded-lg">Enable</button>
    </div>

    <!-- Emergency Contacts -->
    <div class="flex items-center mt-6 justify-between py-5 px-5 border rounded-lg border-gray-200 mb-5">
        <div class="flex items-center space-x-3">
            <img src={Emergency} alt="" class="size-12" />
            <div>
                <p class="text-gray-800 font-semibold">Emergency Contacts</p>
                <p class="text-gray-500 text-sm">Secure your account</p>
            </div>
        </div>
        <button class="border text-gray-800 px-4 py-2 border-gray-200 rounded-lg">Manage</button>
    </div>
</div>