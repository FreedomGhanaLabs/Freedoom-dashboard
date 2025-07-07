<script lang="ts">

import type { PageProps } from './$types';
    import { enhance } from '$app/forms';
    import logo from '$lib/assets/freelogo2.svg';
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
  
  <div class="mx-auto max-w-md p-8 font-poppins">
    <div class="text-center">
      <img src={logo} alt="Logo" class="mx-auto my-14 size-[5rem]" />
    </div>
  
    {#if form?.secret}
      <!-- After form POST succeeds, form.secret contains the secret string -->
      <h2 class="text-center text-2xl font-medium mb-4">
        Scan this QR code with your authenticator
      </h2>
      <div class="flex justify-center mb-6">
          <img src={form?.qrCode} alt="QR Code" class="mx-auto my-6 size-[15rem]" />
      </div>
      <h3>Can't scan QR code?</h3>
      <span class="flex justify-center items-center">

        <h4> Click here to copy the secret key below and paste it into your authenticator app.</h4>
        <Button onclick={copySecret}>
          <Copy class={copied ? 'hidden' : 'inline-block'}/>
          <Check class={copied ? 'inline-block' : 'hidden'}/>
        </Button>
      </span>
      <p class="text-center text-sm text-gray-600">
        After scanning click <a class="underline" href="/enable">here</a> to validate.
      </p>
    {:else}
      <!-- Before POST or if no secret, show the form -->
      <h2 class="text-center text-2xl font-medium mb-4">
        Activate TOTP for your account
      </h2>
      <p class="text-center text-gray-500 mb-6">
        Click the button below to generate your secret key.
      </p>
  
      <form method="POST" use:enhance class="flex justify-center">
          <button
            type="submit"
            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
          Generate Secret Key
          </button>
      </form>
    {/if}
  </div>