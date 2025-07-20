// +page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) throw redirect(303, '/');

	// Get page number from the query string
	const page = Number(url.searchParams.get('page') ?? '1');

	// Fetch paginated drivers
	const driverRes = await fetch(`https://api-freedom.com/api/v2/riders-program/drivers?page=${page}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!driverRes.ok) throw error(driverRes.status, 'Failed to load driver data');
	const driverPayload = await driverRes.json();
	

	// Fetch driver statistics
	const statsRes = await fetch(`https://api-freedom.com/api/v2/riders-program/drivers/stats`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!statsRes.ok) throw error(statsRes.status, 'Failed to load driver statistics');
	const stats = await statsRes.json();
	console.log('Driver stats:', stats.data);

	return {
		drivers: driverPayload.data,
		pagination: driverPayload.pagination,
		currentPage: driverPayload.pagination.current,
		stats
	};
};
