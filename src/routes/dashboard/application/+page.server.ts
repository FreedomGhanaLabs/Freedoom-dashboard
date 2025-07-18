// src/routes/dashboard/applications/+page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/');
	}

	const page = Number(url.searchParams.get('page') ?? '1');

	// Fetch applications with pagination
	const applicationRes = await fetch(`https://api-freedom.com/api/v2/riders/admin/applications?page=${page}`, {
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
	

	const application = applicationPayload.data ?? [];
	const pagination = applicationPayload.pagination ?? { current: 1, pages: 1, total: 0 };

	// Fetch stats
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

	return {
		application,
		stats,
		currentPage: pagination.current,
		totalPages: pagination.pages,
		totalItems: pagination.total
	};
};
