<!--
@component
- This component is critical to the dashboard's structure and navigation.
- Unauthorized or incorrect modifications may break the dashboard, disrupt user access, or cause major navigation failures.
- All changes are monitored. Proceed with extreme caution—violations may result in immediate rollback or restricted access.
-->
<script lang="ts" module>
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Bot from 'lucide-svelte/icons/bot';
	import Book from 'lucide-svelte/icons/contact';
	import Headset from 'lucide-svelte/icons/headphones';
	import Activity from 'lucide-svelte/icons/activity';
	import Credit from 'lucide-svelte/icons/credit-card';
	import Coins from 'lucide-svelte/icons/coins';
	import ChartPie from 'lucide-svelte/icons/chart-pie';
	import Command from 'lucide-svelte/icons/command';
	import Frame from 'lucide-svelte/icons/frame';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import Map from 'lucide-svelte/icons/map';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import File from 'lucide-svelte/icons/file-user';
	import HandCoins from 'lucide-svelte/icons/hand-coins';
	import Landmark from 'lucide-svelte/icons/landmark';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';
	import { AppWindow } from 'lucide-svelte';
	import Logo from '$lib/assets/freelogo2.png';
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavProjects from './nav-projects.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { onMount, type ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { Head } from '$lib/components/ui/table';

	// This is sample data.
	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		teams: [
			{
				name: '',
				logo: Logo,
				plan: '',
				url: '/dashboard'
			}
		],
		navMain: [
			{
				title: 'Operations',
				url: 'account',
				icon: AppWindow,
				isActive: false,
				items: [
					{
						title: 'History',
						url: '#'
					},
					{
						title: 'Starred',
						url: '#'
					},
					{
						title: 'Settings',
						url: '#'
					}
				]
			},
			{
				title: 'Ride Management',
				url: 'ride',
				icon: SquareTerminal,
				isActive: false,
				items: [
					{
						title: 'History',
						url: '#'
					},
					{
						title: 'Starred',
						url: '#'
					},
					{
						title: 'Settings',
						url: '#'
					}
				]
			},
			{
				title: 'Driver Management',
				url: 'driver',
				icon: Bot,
				isActive: false,
				items: [
					{
						title: 'Genesis',
						url: '#'
					},
					{
						title: 'Explorer',
						url: '#'
					},
					{
						title: 'Quantum',
						url: '#'
					}
				]
			},
			{
				title: 'User Management',
				url: 'user',
				icon: Book,
				isActive: false,
				items: [
					{
						title: 'Genesis',
						url: '#'
					},
					{
						title: 'Explorer',
						url: '#'
					},
					{
						title: 'Quantum',
						url: '#'
					}
				]
			},
			{
				title: 'Applications',
				url: 'application',
				icon: File,
				isActive: false,
				items: [
					{
						title: 'Genesis',
						url: '#'
					},
					{
						title: 'Explorer',
						url: '#'
					},
					{
						title: 'Quantum',
						url: '#'
					}
				]
			},
			{
				title: 'Reports & Analytics',
				url: 'report',
				icon: BookOpen,
				isActive: false,
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Transactions',
				url: 'transaction',
				icon: HandCoins,
				isActive: false,
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Financials',
				url: 'finacials',
				icon: Landmark,
				isActive: false,
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Commmissions',
				url: 'commission',
				icon: Coins,
				isActive: false,
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Debt Management',
				url: 'debt',
				icon: Credit,
				isActive: false,
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Support',
				url: 'support',
				icon: Headset,
				isActive: false,
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Activiy logs',
				url: 'activity',
				icon: Activity,
				isActive: false,
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Logistics',
				url: 'logistics',
				icon: Settings2,
				isActive: false,
				items: []
			}
		]
		
	};

	let active: boolean = false;

	onMount(() => {
		const currentPath = page.url.pathname.toLowerCase();
		data.navMain.forEach((item) => {
			const firstWord = item.title.split(' ')[0].toLowerCase();
			item.isActive = currentPath.includes(firstWord);
		});		
		active = data.navMain.some((item) => item.isActive);
	});

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header class="">
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content class="-mt-6">
		<NavMain items={data.navMain} />
	
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
