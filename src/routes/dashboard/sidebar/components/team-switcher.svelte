<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Plus from 'lucide-svelte/icons/plus';

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { teams }: { teams: { name: string; logo: any; plan: string; url: string }[] } = $props();
	const sidebar = useSidebar();

	let activeTeam = $state(teams[0]);
	let side: 'expanded' | 'collapsed' | string = $state('');

	$effect(() => {
		side = sidebar.state;
	});
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="h-16 w-full data-[state=open]:bg-sidebar-accent data-[state=open]:bg-white"
		>
			<a href={teams[0].url}>
				<div class="grid flex-1 text-left text-sm leading-tight">
					<span class="truncate font-semibold">
						{activeTeam.name}
					</span>
					<div
						class="flex {side == 'collapsed'
							? 'hidden'
							: ''} h-32 w-28 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground"
					>
						<img src={activeTeam.logo} alt="Logo" class="size-14" />
					</div>
				</div>
			</a>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
