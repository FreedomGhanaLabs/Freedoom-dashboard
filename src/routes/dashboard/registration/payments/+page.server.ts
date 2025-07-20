// +page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/');
	}

	const page = url.searchParams.get('page') || '1';

	const res = await fetch(`https://api-freedom.com/api/v2/riders-program/payments?page=${page}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!res.ok) {
		throw error(res.status, `Failed to load payments (${res.status})`);
	}

	const payload = await res.json();

	return {
		payments: payload.data,
		pagination: payload.pagination,
		currentPage: Number(page)
	};
};
