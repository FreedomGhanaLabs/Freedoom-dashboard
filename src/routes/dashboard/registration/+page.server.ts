// +page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) throw redirect(303, '/');

	// Get page number from the query string
	const page = Number(url.searchParams.get('page') ?? '1');

	// Fetch paginated drivers
	const res = await fetch(`https://api-freedom.com/api/v2/riders-program/drivers?page=${page}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!res.ok) throw error(res.status, 'Failed to load driver data');

	const payload = await res.json();
    console.log('Driver data:', payload);

	return {
		drivers: payload.data,
		pagination: payload.pagination,
		currentPage: payload.pagination.current
	};
};
