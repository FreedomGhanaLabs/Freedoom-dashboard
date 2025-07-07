<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let statusCode = $derived(page.status);
	let errorMessage = $derived(page.error?.message || 'An unexpected error occurred.');

	function goHome() {
		goto('/dashboard/account');
	}

	function reloadPage() {
		window.location.reload();
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
	<Card class="w-full max-w-md rounded-lg p-6 text-center shadow-lg">
		<CardHeader>
			<CardTitle class="text-6xl font-bold text-red-500">
				{page.status}
			</CardTitle>
			<CardDescription class="mt-2 text-xl text-gray-700 dark:text-gray-300">
				Oops! Something went wrong.
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<p class="text-lg text-gray-600 dark:text-gray-400">
				{errorMessage}
			</p>
			<div class="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
				<Button onclick={goHome} class="w-full sm:w-auto">Go to Homepage</Button>
				<Button onclick={reloadPage} variant="outline" class="w-full sm:w-auto">Reload Page</Button>
			</div>
		</CardContent>
	</Card>
</div>
