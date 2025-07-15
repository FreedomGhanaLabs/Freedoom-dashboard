<script lang="ts">
	import type { PageData } from './$types';

	import logo from '$lib/assets/freelogo2.png';
	import { Mail, Lock, Eye, EyeOff, AlertTriangle, Info } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';

	let { form }: PageProps = $props();

	let email = $state('');
	let sending = $state(false);
</script>

<div class="font-poppins mx-auto w-full max-w-md p-8">
	<div class="text-center">
		<img alt="Logo" class="mx-auto my-12 size-20" src={logo} />
	</div>
	<h2 class="-mt-12 text-center text-[2rem] font-medium">Forgot Password</h2>
	<div class="text-center text-[0.8rem] text-gray-500">
		<p>Enter your email address and we'll send you</p>
		<p>a link to reset you password</p>
	</div>
	<form
		method="POST"
		use:enhance={() => {
			sending = true;
			return ({ update }) => {
			
				update({ invalidateAll: true }).finally(async () => {
					email = '';
					sending = false;
				});
			};
		}}
		class="mt-3 space-y-6"
	>
		<div class="rounded-md">
			<section>
				<label class="text-[.9rem] font-semibold" for="email-address"> Email address </label>
				<div class="relative flex items-center">
					<span
						class="absolute left-2 z-20 flex size-6 items-center rounded-md bg-[#F59E0B] p-[0.35rem] text-yellow-400"
						style="background-color: rgba(245, 158, 11, 0.07);"
					>
						<Mail />
					</span>
					<input
						autocomplete="email"
						bind:value={email}
						class="relative mt-2 mb-2 block w-full rounded-md bg-yellow-50 px-5 py-2 pl-10 text-gray-700 placeholder-gray-500 transition-colors duration-700 focus:z-10 focus:outline-none sm:text-sm"
						id="email-address"
						name="email"
						placeholder="Enter your email"
						type="email"
					/>
				</div>
			</section>
		</div>
		<div>
			<button
				class="group relative flex w-full justify-center rounded-md border border-transparent bg-[#170614] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
				type="submit"
			>
				{#if sending}
					Sending...
				{:else}
					Send
				{/if}
			</button>
		</div>
		<p class="-mt-5 text-center text-sm text-gray-700">
			<a href="/">Back to Login</a>
		</p>
	</form>
</div>
