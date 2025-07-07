<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/favicon.png';
	import { Button } from '$lib/components/ui/button';
	import { Check, Copy } from 'lucide-svelte';

	let { data, form }: PageProps = $props();
	let copied = $state(false);
	const copySecret = () => {
		navigator.clipboard.writeText(form?.secret ?? '');
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	};
</script>

<div class="font-poppins mx-auto max-w-md p-8">
	<div class="text-center">
		<img src={logo} alt="Logo" class="mx-auto my-14 size-20" />
	</div>

	{#if form?.secret}
		<!-- After form POST succeeds, form.secret contains the secret string -->
		<h2 class="mb-4 text-center text-2xl font-medium">Scan this QR code with your authenticator</h2>
		<div class="mb-6 flex justify-center">
			<img src={form?.qrCode} alt="QR Code" class="mx-auto my-6 size-60" />
		</div>
		<h3>Can't scan QR code?</h3>
		<span class="flex items-center justify-center">
			<h4>Click here to copy the secret key below and paste it into your authenticator app.</h4>
			<Button onclick={copySecret}>
				<Copy class={copied ? 'hidden' : 'inline-block'} />
				<Check class={copied ? 'inline-block' : 'hidden'} />
			</Button>
		</span>
		<p class="text-center text-sm text-gray-600">
			After scanning click <a class="underline" href="/enable">here</a> to validate.
		</p>
	{:else}
		<!-- Before POST or if no secret, show the form -->
		<h2 class="mb-4 text-center text-2xl font-medium">Activate TOTP for your account</h2>
		<p class="mb-6 text-center text-gray-500">
			Click the button below to generate your secret key.
		</p>

		<form method="POST" use:enhance class="flex justify-center">
			<button
				type="submit"
				class="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
			>
				Generate Secret Key
			</button>
		</form>
	{/if}
</div>
