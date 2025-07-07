<script lang="ts">
	import logo from '$lib/assets/freelogo2.png';
	import { Mail, Lock, Eye, EyeOff, AlertTriangle, Info } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';

	let { form }: PageProps = $props();

	let showPassword = $state(false);

	let email = $state('');
	let password = $state('');
	let sending = $state(false);
</script>

<div class="font-poppins mx-auto w-full max-w-md p-8">
	<div class="text-center">
		<img alt="Logo" class="mx-auto my-14 size-20" src={logo} />
	</div>
	<h2 class="-mt-12 text-center text-[2rem] font-medium">Welcome Back!</h2>
	<div class="text-center text-[0.8rem] text-gray-500">
		<p>Please log in to your account to</p>
		<p>continue</p>
	</div>
	<form
		method="POST"
		use:enhance={() => {
			sending = true;
			return ({ update }) => {
				// Set invalidateAll to false if you don't want to reload page data when submitting
				update({ invalidateAll: true }).finally(async () => {
					email = '';
					password = '';
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
						class="relative {form?.error_email && !email
							? 'border border-red-500'
							: ''} mt-2 mb-2 block w-full rounded-md bg-yellow-50 px-5 py-2 pl-10 text-gray-700 placeholder-gray-500 transition-colors duration-700 focus:z-10 focus:outline-none sm:text-sm"
						id="email-address"
						name="email"
						placeholder="Enter your email"
						type="email"
					/>
				</div>
				{#if form?.error_email && !email}
					<p in:fade out:fade class="flex flex-row gap-1 text-sm text-red-500">
						<Info class="mt-[0.1rem] size-4 fill-red-500 text-white" />
						{form?.error_email}
					</p>
				{/if}
			</section>
			<section>
				<label for="password"> Password </label>
				<div class="relative flex items-center">
					<span
						class="absolute left-2 z-20 flex size-6 items-center rounded-md bg-[#F59E0B] p-[0.35rem] text-yellow-400"
						style="background-color: rgba(245, 158, 11, 0.07);"
					>
						<Lock />
					</span>
					<input
						autocomplete="current-password"
						class="relative mb-2 {form?.error_password && !password
							? 'border border-red-500'
							: ''} mt-2 block w-full rounded-md bg-yellow-50 px-5 py-2 pl-10 text-gray-700 placeholder-gray-500 transition-colors duration-700 focus:z-10 focus:outline-none sm:text-sm"
						id="password"
						name="password"
						bind:value={password}
						placeholder="Enter your password"
						type={showPassword ? 'text' : 'password'}
					/>
					<button
						type="button"
						class="absolute right-2 z-20 flex size-7 items-center p-[0.35rem] text-gray-500"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if form?.error_password && !password}
							<AlertTriangle class="fill-red-500 text-white" />
						{:else if showPassword}
							<Eye />
						{:else}
							<EyeOff />
						{/if}
					</button>
				</div>
				{#if form?.error_password && !password}
					<p in:fade out:fade class="flex flex-row gap-1 text-sm text-red-500">
						<Info class="mt-[0.1rem] size-4 fill-red-500 text-white" />
						{form?.error_password}
					</p>
				{/if}
			</section>
		</div>
		<p class="-mt-5 text-sm text-gray-700"><a href="/forgot">Forgot Password?</a></p>
		<div>
			<button
				class="group relative flex w-full justify-center rounded-md border border-transparent bg-[#170614] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
				type="submit"
			>
				{#if sending}
					Logging in...
				{:else}
					Log in
				{/if}
			</button>
		</div>
	</form>
</div>
