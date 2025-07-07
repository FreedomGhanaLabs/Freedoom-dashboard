// src/routes/dashboard/logistics/+page.server.ts
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ params, cookies, fetch }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/login');
	}

	const { id } = params;
	console.log(`Starting load function for ID: ${id}`);

	const url = `https://api-freedom.com/api/v2/admins/deliveries/${id}`;
	console.log(`Fetching from API: ${url}`);

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}` // ✅ Add token back
		}
	});

	console.log(`Fetch response status: ${response.status}`);

	if (!response.ok) {
		console.error(`Fetch failed with status: ${response.status}`);
		throw error(response.status, 'Failed to fetch delivery details'); // Better error
	}

	const result = await response.json();

	if (!result.success) {
		console.error(`API returned success: false for ID: ${id}`);
		throw error(404, 'Delivery not found');
	}

	console.log('Fetched delivery data:', result.data);

	return {
		id,
		delivery: result.data.delivery,
		transaction: result.data.transaction
	};
};
