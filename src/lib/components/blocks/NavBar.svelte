<script>
	import { Bell, Settings, RotateCw, LogOut, Radio, Menu, X } from 'lucide-svelte';
	import logo from '$lib/assets/Logo-02.png';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import { onMount, onDestroy } from 'svelte';

	// State to prevent multiple logout attempts
	let isLoggingOut = false;
	/**
	 * @type {number | undefined}
	 */
	let logoutTimeout;
	/**
	 * @type {number | undefined}
	 */
	let inactivityTimeout;

	// Navigation items
	const navItems = [
		{ text: 'Notification', href: '#', icon: Bell },
		{ text: 'Settings', href: 'navSettings', icon: Settings },
		{ text: 'Profile', href: 'navProfile', icon: Radio, radio: true },
		{ text: 'Logout', href: '/', icon: LogOut, action: handleSecureLogout }
	];

	const routeItems = [
		{ text: 'Operations', href: 'account' },
		{ text: 'Ride Management', href: 'ride' },
		{ text: 'Driver Management', href: 'driver' },
		{ text: 'Reports & Analytics', href: 'report' },
		{ text: 'Debt Management', href: 'debt' },
		{ text: 'Transactions', href: 'transaction' },
		{ text: 'Drivers Registration', href: 'registration' },
		{ text: 'Application', href: 'application' },
		{ text: 'Finacials', href: 'finacials' },
		{ text: 'System Alerts', href: 'system' },
		{ text: 'Logistics', href: 'logistics' },
		{ text: 'Commissions', href: 'comission' },
		{ text: 'User Management', href: 'user' },
		{ text: 'Support', href: 'support' },
		{ text: 'Activity Logs', href: 'activity' },
		{ text: 'Settings', href: 'settings' },
		{ text: 'Profile', href: 'profile' }
	];

	// Initialize session and inactivity tracking
	onMount(() => {
		// Absolute session timeout (24 hours)
		let sessionStartTime = localStorage.getItem('session_start_time');
		if (!sessionStartTime) {
			sessionStartTime = Date.now().toString();
			localStorage.setItem('session_start_time', sessionStartTime);
		}

		const timeElapsed = Date.now() - parseInt(sessionStartTime, 10);
		const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		if (timeElapsed >= twentyFourHours) {
			handleSecureLogout();
			return;
		}

		logoutTimeout = setTimeout(() => {
			handleSecureLogout();
		}, twentyFourHours - timeElapsed);

		// Inactivity timeout (1 hour)
		const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
		const resetInactivityTimer = () => {
			if (inactivityTimeout) clearTimeout(inactivityTimeout);
			inactivityTimeout = setTimeout(() => {
				toast.error('Session timed out due to inactivity');
				handleSecureLogout();
			}, oneHour);
		};

		// Reset timer on user activity
		['click', 'mousemove', 'keypress'].forEach((event) => {
			window.addEventListener(event, resetInactivityTimer);
		});

		// Start the initial inactivity timer
		resetInactivityTimer();

		return () => {
			if (logoutTimeout) clearTimeout(logoutTimeout);
			if (inactivityTimeout) clearTimeout(inactivityTimeout);
			['click', 'mousemove', 'keypress'].forEach((event) => {
				window.removeEventListener(event, resetInactivityTimer);
			});
		};
	});

	// Secure logout function
	async function handleSecureLogout() {
		if (isLoggingOut) return;

		isLoggingOut = true;

		try {
			const response = await fetch('/dashboard/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				console.warn('⚠️ Server-side logout failed:', response.status, response.statusText, data.error);
			}

			console.log('Logging out', {
				status: response.status,
				statusText: response.statusText,
				success: data.success,
				error: data.error
			});

			await clearClientStorage();
			removeCookie('admin_token');
			clearBrowserHistory();
			toast.success('Logged out successfully');
			window.location.replace('/');
		} catch (error) {
			console.error('❌ Error during logout:', error);
			await clearClientStorage();
			removeCookie('admin_token');
			clearBrowserHistory();
			toast.error('Logout completed (with errors)');
			window.location.replace('/');
		} finally {
			isLoggingOut = false;
			localStorage.removeItem('session_start_time');
		}
	}

	// Get cookie value by name
	/**
	 * @param {string} name
	 */
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			return parts.pop()?.split(';').shift() || null;
		}
		return null;
	}

	// Remove cookie by setting it to expire
	/**
	 * @param {string} name
	 */
	function removeCookie(name) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
	}

	// Clear all client-side storage
	async function clearClientStorage() {
		localStorage.removeItem('admin_token');
		localStorage.clear();
		sessionStorage.clear();

		try {
			const databases = await indexedDB.databases();
			databases.forEach((db) => {
				if (db.name) {
					indexedDB.deleteDatabase(db.name);
				}
			});
		} catch (error) {
			console.warn('Could not clear IndexedDB:', error);
		}
	}

	// Clear browser history to prevent back navigation
	function clearBrowserHistory() {
		replaceState('/', {});
	}

	let show = $state(false);
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
					' inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'}
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
						<li>
							{#if item.text === 'Logout'}
								<button
									on:click={item.action}
									class="block w-full rounded-lg border-2 px-1 py-2 {buttonVariants({
										variant: 'outline'
									})} text-gray-900 hover:bg-gray-100"
								>
									<span class="">
										<item.icon size={16} />
									</span>
									{item.text}
								</button>
							{:else}
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
							{/if}
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
					<li>
						{#if item.text === 'Logout'}
							<button
								on:click={item.action}
								class="flex w-full items-center space-x-2 rounded-lg border-2 px-1 py-2 text-gray-900 hover:bg-gray-100 {buttonVariants({
									variant: 'outline'
								})}"
							>
								<span><item.icon size={16} /></span>
								<span>{item.text}</span>
							</button>
						{:else}
							<a
								href={item.href}
								class="block rounded-lg border-2 px-1 py-2 {buttonVariants({
									variant: 'outline'
								})} text-gray-900 {item.radio
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