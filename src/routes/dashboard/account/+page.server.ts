// +page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) throw redirect(303, '/login');

	// ✅ use the query parameter here
	const page = Number(url.searchParams.get('page') ?? '1');

	const res = await fetch(`https://api-freedom.com/api/v2/admins/operations?page=${page}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!res.ok) throw error(res.status, 'Failed to load operations');

	const payload = await res.json();

	return {
		operations: payload.data ?? [],
		currentPage: payload.currentPage ?? page,
		totalPages: payload.totalPages ?? 1
	};
};
