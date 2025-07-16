
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/');
	}

	const page = Number(url.searchParams.get('page') ?? '1');

	const res = await fetch(`https://api-freedom.com/api/v2/transactions/all?page=${page}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!res.ok) {
		throw error(res.status, `Failed to load transactions (${res.status})`);
	}

	const payload = await res.json();
	const transactions = payload.transactions ?? [];
	const pagination = payload.pagination ?? { page: 1, pages: 1, total: 0, limit: 10 };



	return {
		transactions,
		currentPage: pagination.page,
		totalPages: pagination.pages,
		totalItems: pagination.total
	};
};
