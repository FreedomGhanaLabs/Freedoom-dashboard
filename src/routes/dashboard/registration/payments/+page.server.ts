// +page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/');
	}

	const page = url.searchParams.get('page') || '1';

	// Fetch payments list
	const paymentsRes = await fetch(`https://api-freedom.com/api/v2/riders-program/payments?page=${page}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!paymentsRes.ok) {
		throw error(paymentsRes.status, `Failed to load payments (${paymentsRes.status})`);
	}

	const paymentsData = await paymentsRes.json();

	// Fetch payment statistics
	const statsRes = await fetch(`https://api-freedom.com/api/v2/riders-program/payments/stats`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!statsRes.ok) {
		throw error(statsRes.status, `Failed to load payment statistics (${statsRes.status})`);
	}

	const statsData = await statsRes.json();
	console.log('Payment statistics:', statsData.data);

	return {
		payments: paymentsData.data,
		pagination: paymentsData.pagination,
		currentPage: Number(page),
		stats: statsData.data // ← now available in your page as `data.stats`
	};
};
