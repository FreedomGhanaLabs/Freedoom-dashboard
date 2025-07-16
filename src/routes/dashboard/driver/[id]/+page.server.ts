
import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/login');
	}

	const { id } = params;
	console.log(`Starting load function for ID: ${id}`);

	const url = `https://api-freedom.com/api/v2/driver/driver/${id}`;
	console.log(`Fetching from API: ${url}`);

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	});

	console.log(`Fetch response status: ${response.status}`);

	if (!response.ok) {
		console.error(`Fetch failed with status: ${response.status}`);
		throw error(response.status, 'Failed to fetch delivery details');
	}

	const result = await response.json();

	if (!result.success) {
		console.error(`API returned success: false for ID: ${id}`);
		throw error(404, 'Delivery not found');
	}

	return {
		id,
		driver: result.data,
		transaction: null
	};
};

export const actions: Actions = {
	delete: async ({ params, cookies, fetch }) => {
		const token = cookies.get('admin_token');
		if (!token) {
			throw redirect(303, '/login');
		}

		const { id } = params;
		const deleteUrl = `https://api-freedom.com/api/v2/driver/deleteDriver${id}`;

		console.log(`Attempting to delete driver ID: ${id}`);
		 
		
		const response = await fetch(deleteUrl, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});

		if (!response.ok) {
			console.error(`Failed to delete driver. Status: ${response.status}`);
			return fail(response.status, { message: 'Failed to delete driver' });
		}

		console.log(`Driver ID ${id} deleted successfully`);
		throw redirect(303, '/dashboard/driver'); 
	}
};
