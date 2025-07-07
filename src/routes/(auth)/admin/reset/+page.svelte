<script lang="ts">
    import type { PageData } from './$types';

    import logo from '$lib/assets/freelogo2.png';
	import { Lock, Eye, EyeOff } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';


	let { data, form }: PageProps = $props();
	
	let password = $state('');
	let confirmPassword = $state('');

	let showPassword = $state(false);

	let sending = $state(false);

	$inspect(password);
	$inspect(confirmPassword);
	
   
</script>

<div class="mx-auto w-full max-w-md p-8 font-poppins">
	<div class="text-center">
		<img alt="Logo" class="mx-auto my-14 size-20" src={logo} />
	</div>
	<h2 class="-mt-12 text-center text-[2rem] font-medium">Reset Password</h2>
	<div class="text-center text-[0.8rem] text-gray-500">
		<p>Enter your new password</p>
		<p>and confirm it</p>
	</div>
	<form
		method="POST"
		use:enhance={() => {
			sending = true;
			return ({ update }) => {
				// Set invalidateAll to false if you don't want to reload page data when submitting
				update({ invalidateAll: true }).finally(async () => {
					password = '';
					sending = false;
				});
			};
		}}
		class="mt-3 space-y-6"
	>
		<div class="rounded-md">
			<section>
				<label class="text-[.9rem] font-semibold" for="email-address">New Password</label>
				<div class="relative flex items-center">
					<span
						class="absolute left-2 z-20 flex size-6 items-center rounded-md bg-[#F59E0B] p-[0.35rem] text-yellow-400"
						style="background-color: rgba(245, 158, 11, 0.07);"
					>
						<Lock />
					</span>


					<input
					id="password"
					name="password"
					bind:value={password}
					placeholder="Enter your new password"
					type={showPassword ? 'text' : 'password'}
					class="relative mb-2 mt-2 block w-full rounded-md bg-yellow-50 px-5 py-2 pl-10 text-gray-700 placeholder-gray-500 transition-colors duration-700 focus:z-10 focus:outline-none sm:text-sm"
					required
					/>
					<button
						type="button"
						class="absolute right-2 z-20 flex size-7 items-center p-[0.35rem] text-gray-500"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<Eye />
						{:else}
							<EyeOff />
						{/if}
					</button>
				</div>
				
			</section>
			
            <section>
				<label class="text-[.9rem] font-semibold" for="email-address"> Confirm Password </label>
				<div class="relative flex items-center">
					<span
						class="absolute left-2 z-20 flex size-6 items-center rounded-md bg-[#F59E0B] p-[0.35rem] text-yellow-400"
						style="background-color: rgba(245, 158, 11, 0.07);"
					>
						<Lock />
					</span>
					<input
					id="confirm-password"
					name="confirmPassword"
					type={showPassword ? 'text' : 'password'}
					bind:value={confirmPassword}
					placeholder="Re-enter your new password"
					class="relative mb-2 mt-2 block w-full rounded-md bg-yellow-50 px-5 py-2 pl-10 text-gray-700 placeholder-gray-500 transition-colors duration-700 focus:z-10 focus:outline-none sm:text-sm"
					required
					/>
					<button
						type="button"
						class="absolute right-2 z-20 flex size-7 items-center p-[0.35rem] text-gray-500"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<Eye />
						{:else}
							<EyeOff />
						{/if}
					</button>
				</div>
				
			</section>
		</div>
		<div>
			<button
				class="group relative flex w-full justify-center rounded-md border border-transparent bg-[#170614] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
				type="submit"
			>
				{#if sending}
					Reseting..
				{:else}
					Reset Password
				{/if}
			</button>
		</div>
        <p class="text-gray-700 text-center text-sm -mt-5"></p>
           
	</form>
</div>