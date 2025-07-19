
import { redirect, error } from '@sveltejs/kit';

export const load = async ({ params, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) {
        throw redirect(303, '/login');
    }

    const { id } = params;
    console.log(`Starting load function for ID: ${id}`);

    const url = `https://api-freedom.com/api/v2/riders-program/payments/drivers/${id}`;
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

    console.log(`Driver payment data for ID: ${id}`, result.data);
    console.log(`Summary for ID: ${id}`, result.summary);
    console.log(`Pagination info for ID: ${id}`, result.pagination);

    return {
        id,
        ride: result.data,
        summary: result.summary,
        pagination: result.pagination
    };

};

