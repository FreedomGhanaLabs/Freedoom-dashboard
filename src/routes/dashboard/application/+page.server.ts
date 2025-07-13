// src/routes/dashboard/user/+page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/login');
	}

	// Fetch applications
	const applicationRes = await fetch('https://api-freedom.com/api/v2/riders/admin/applications', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!applicationRes.ok) {
		throw error(applicationRes.status, `Failed to load applications (${applicationRes.status})`);
	}

	const applicationPayload = await applicationRes.json();
	const application: any[] = applicationPayload.data ?? [];

	// Fetch statistics
	const statsRes = await fetch('https://api-freedom.com/api/v2/riders/admin/stats', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!statsRes.ok) {
		throw error(statsRes.status, `Failed to load statistics (${statsRes.status})`);
	}

	const statsPayload = await statsRes.json();
	const stats = statsPayload.data ?? {};

    console.log('Stats:', stats);

	return {
		application,
		stats
	};
};
