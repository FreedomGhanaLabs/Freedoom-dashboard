<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';

	import logo from '$lib/assets/freelogo2.png';
	import type { PageProps } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { form }: PageProps = $props();
	let sending = $state(false);


	let otpDigits = $state(['', '', '', '', '', '']);

	function handleInput(index: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const value = input.value;

	
		if (value && !/^\d+$/.test(value)) {
			otpDigits[index] = '';
			return;
		}

	
		if (value.length > 1) {
			otpDigits[index] = value[value.length - 1];
		}


		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			if (nextInput) {
				nextInput.focus();
			}
		}
	}

	function handleKeyDown(index: number, event: KeyboardEvent) {
	
		if (event.key === 'Backspace') {
			if (!otpDigits[index] && index > 0) {
				const prevInput = document.getElementById(`otp-${index - 1}`);
				if (prevInput) {
					prevInput.focus();
				}
			}
		}
	}
	let pin = $state('');

	$inspect(pin);
</script>

<div class="font-poppins mx-auto w-full max-w-md p-8">
	<div class="text-center">
		<img alt="Logo" class="mx-auto my-14 size-20" src={logo} />
	</div>
	<h2 class="-mt-12 text-center text-[2rem] font-medium">Enter Authenication Code to Activate 2FA</h2>

	<div class="text-center text-[0.8rem] text-gray-500">
		<p>Please enter the 6-digit code from your authentication app</p>
	</div>
	<form
		method="POST"
		use:enhance={async ({ formData }) => {
			sending = true;

			return async ({ result, update }) => {
				await update();
				sending = false;

				if (result.type === 'redirect') {
					return;
				}
			};
		}}
		class="mt-8 space-y-6"
	>
		<input type="hidden" name="pin" bind:value={pin} />
		<InputOTP.Root class="flex  justify-center" maxlength={6} bind:value={pin}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 3) as cell}
						<InputOTP.Slot {cell} class="size-14" />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(3, 6) as cell}
						<InputOTP.Slot {cell} class="size-14" />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
		{#if form?.error}
			<p class="text-center text-red-500">{form.error}</p>
		{/if}

	
		{#if form?.success}
			<div
				class="mt-4 flex flex-col items-center space-y-2 rounded-md bg-green-100 p-4 text-green-800"
			>
				<p>✅ Enabled successfully!</p>
				<a href="/" class="underline hover:text-green-900"> Go to Login → </a>
			</div>
		{/if}

		<div>
			<button
				class="group relative flex w-full justify-center rounded-md border border-transparent bg-[#170614] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
				type="submit"
			>
				{#if sending}
					Enabling...
				{:else}
					Enable
				{/if}
			</button>
		</div>
		<p class="-mt-4 text-center text-sm text-gray-700">
			<Button variant="link" onclick={() => window.history.back()}>Back to Login</Button>
		</p>
	</form>
</div>
