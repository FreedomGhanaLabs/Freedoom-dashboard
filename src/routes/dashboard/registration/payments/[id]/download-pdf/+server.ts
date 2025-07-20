// +server.ts inside [id]/download-pdf
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) throw redirect(303, '/login');

	const { id: driverId } = params;
	const startDate = url.searchParams.get('startDate');
	const endDate = url.searchParams.get('endDate');

	if (!startDate || !endDate) {
		throw error(400, 'Start date and end date are required');
	}

	const endpoint = `https://api-freedom.com/api/v2/riders-program/payments/drivers/${driverId}/statement?startDate=${startDate}&endDate=${endDate}`;

	const response = await fetch(endpoint, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		console.error('Failed to fetch PDF:', await response.text());
		throw error(response.status, 'Could not generate payment statement PDF');
	}

	const blob = await response.blob();
	return new Response(blob, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="driver-${driverId}-statement.pdf"`
		}
	});
};
