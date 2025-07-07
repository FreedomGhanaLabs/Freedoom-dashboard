<script lang="ts">
	import { page } from '$app/state';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let {
		items,
		active
	}: {
		items: {
			title: string;
			url: string;
			// this should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
		active?: boolean;
	} = $props();

	const routeItems = [
		{ text: 'Account Overview', href: 'account' },
		{ text: 'Ride Management', href: 'ride' },
		{ text: 'Driver Management', href: 'driver' },
		{ text: 'Reports & Analytics', href: 'report' },
		{ text: 'Transactions', href: 'transaction' },
		{ text: 'Finacials', href: 'finacials' },		
		{ text: 'Debt Management', href: 'debt' },
		{ text: 'Commissions', href: 'commission' },
		{ text: 'User Management', href: 'user' },
		{ text: 'System Alerts', href: 'system' },
		{ text: 'Logistics', href: 'logistics' },
		{ text: 'Activity Logs', href: 'activity' },
		{ text: 'Support', href: 'support' }
	];

	let currentRoute = $derived(page.url.pathname.split('/')[2]);

	// Find the matching route and extract its text
	const matchedRoute = $derived(routeItems.find((item) => item.href === currentRoute));
</script>

<Sidebar.Group>
	<!-- <Sidebar.GroupLabel class='bg-[#F59E0B] pl-[30px]' style="background-color: rgba(245, 158, 11, 0.07);">Dashboard Overview</Sidebar.GroupLabel> -->
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger>
							{#snippet child({ props })}
								<a href={'/dashboard/' + mainItem.url} {...props}>
									<Sidebar.MenuButton
										{...props}
										class="mt-[1rem] {matchedRoute?.href === mainItem.url
											? 'border-2 border-amber-400 bg-amber-300/20 text-amber-500 hover:bg-amber-400'
											: ''} "
									>
										{#snippet tooltipContent()}
											{mainItem.title}
										{/snippet}
										{#if mainItem.icon}
											<mainItem.icon />
										{/if}
										<span class="text-[1rem]">{mainItem.title}</span>
										{#if matchedRoute?.href === mainItem.url}
											<ChevronRight class="transition-transform duration-200" />
										{/if}
									</Sidebar.MenuButton>
								</a>
							{/snippet}
						</Collapsible.Trigger>
						<!-- <Collapsible.Content>
							{#if mainItem.items}
								<Sidebar.MenuSub>
									{#each mainItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content> -->
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
