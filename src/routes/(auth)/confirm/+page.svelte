<script lang="ts">
    import type { PageData } from './$types';
    import logo from '$lib/assets/freelogo2.svg';
	

	export let data: PageData;
	const { email } = data;

</script>

<div class="mx-auto w-full max-w-xl p-8 font-poppins">
	<div class="text-center">
		<img alt="Logo" class="mx-auto my-12 size-[5rem]" src={logo} />
	</div>
	<h2 class="mt-[-3rem] text-center text-[2rem] font-[500]">Forgot Password</h2>
	<div class="text-center text-[1.5rem] text-gray-500">
		<h1>Check Your Email</h1>
	</div>
    <p class="text-center text-[1.2rem] my-6 text-gray-500">
        If an account exists for the email <strong>{email}</strong>, you'll receive 
        password reset instructions shortly.
      </p>
	<p class="text-center text-[0.8rem] text-gray-500">
    Please check your spam folder if you don't see the email within a few minutes.
  </p>

  <p class="text-gray-700 text-center text-sm mt-5">
    <a href="/reset">Proceed to reset page</a>
</div>
