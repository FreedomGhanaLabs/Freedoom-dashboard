<script>
	import { Bell, Settings, RotateCw, LogOut, Radio, Menu, X } from 'lucide-svelte';
	const navItems = [
		{ text: 'Notification', href: '#', icon: Bell },
		{ text: 'Settings', href: 'navSettings', icon: Settings },
		// { text: 'Refresh', href: '#', icon: RotateCw },
		{ text: 'Profile', href: 'navProfile', icon: Radio, radio: true },
		{ text: 'Logout', href: '/', icon: LogOut, action: handleLogout }
	];
	let show = $state(false);
	import logo from '$lib/assets/Logo-02.png';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { page } from '$app/state';

	const routeItems = [
		{ text: 'Operations', href: 'account' },
		{ text: 'Ride Management', href: 'ride' },
		{ text: 'Driver Management', href: 'driver' },
		{ text: 'Reports & Analytics', href: 'report' },
		{ text: 'Debt Management', href: 'debt' },
		{ text: 'Transactions', href: 'transaction' },
		{ text: 'Finacials', href: 'finacials' },
		{ text: 'System Alerts', href: 'system' },
		{ text: 'Logistics', href: 'logistics' },
		{ text: 'Commissions', href: 'comission' },
		{ text: 'Logistics', href: 'logistics' },
		{ text: 'User Management', href: 'user' },
		{ text: 'Support', href: 'support' },
		{ text: 'Activity Logs', href: 'activity' },
		{ text: 'Settings', href: 'settings' },
		{ text: 'Profile', href: 'profile' }
	];

	async function handleLogout() {
		try {
			const response = await fetch('https://api-freedom.com/api/v2/admin/auth/logout', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('admin_token')}`
				}
			});

			if (!response.ok) {
				console.error('❌ Logout API failed');
			}

			// Clear client-side storage regardless
			localStorage.removeItem('admin_token');
			sessionStorage.clear();

			// Redirect to login or landing page
			window.location.replace('/');
			window.history.pushState(null, '', '/');
		} catch (err) {
			console.error('❌ Error during logout:', err);
		}
	}

	let currentRoute = $derived(page.url.pathname.split('/')[2]);

	let activeRoute = $derived(routeItems.find((item) => item.href === currentRoute));
</script>

<nav class="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
	<div class="mx-auto flex flex-wrap items-center justify-between p-4">
		<div>
			<!-- Don't remove the div -->
		</div>
		<div>
			<h3 class="-ml-20 text-2xl font-normal">{activeRoute?.text}</h3>
		</div>

		<div>
			<!-- Don't remove the div -->
		</div>

		<!-- Mobile -->
		<Sheet.Root>
			<Sheet.Trigger
				class={buttonVariants({ variant: 'outline' }) +
					'inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'}
				aria-controls="navbar-solid-bg"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<Menu class={show ? 'hidden' : 'block'} />
				<X class={show ? 'block' : 'hidden'} />
			</Sheet.Trigger>
			<Sheet.Content side="right">
				<Sheet.Header>
					<Sheet.Title>Navigation</Sheet.Title>
					<Sheet.Description>
						<!-- Add a description for the sheet -->
					</Sheet.Description>
				</Sheet.Header>
				<ul class="mt-4 flex flex-col space-y-3 rounded-lg font-medium rtl:space-x-reverse">
					{#each navItems as item}
						<li class="">
							<a
								href={item.href}
								class="block w-full rounded-lg border-2 px-1 py-2 {buttonVariants({
									variant: 'outline'
								})} text-gray-900 hover:bg-gray-100"
							>
								<span class="">
									<item.icon size={16} />
								</span>
								{item.text}
							</a>
						</li>
					{/each}
				</ul>
			</Sheet.Content>
		</Sheet.Root>
		<!-- Desktop -->
		<div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
			<ul
				class="mt-4 flex flex-col rounded-lg font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-transparent"
			>
				{#each navItems as item}
					<li class="">
						{#if item.text === 'Logout'}
							<button
								on:click={item.action}
								class="flex w-full items-center space-x-2 rounded-lg border-2 px-1 py-2 text-gray-900 hover:bg-gray-100 {buttonVariants(
									{ variant: 'outline' }
								)}"
							>
								<span><item.icon size={16} /></span>
								<span>{item.text}</span>
							</button>
						{:else}
							<a
								href={item.href}
								class="block rounded-lg border-2 px-1 py-2 {buttonVariants({
									variant: 'outline'
								})}  text-gray-900 {item.radio
									? 'bg-amber-500! text-white hover:bg-orange-600 hover:text-white'
									: 'bg-white hover:bg-gray-100'}"
							>
								<span><item.icon size={16} /></span>
								{item.text}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>
