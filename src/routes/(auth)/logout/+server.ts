// src/routes/logout/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const token = cookies.get('admin_token');

	if (token) {
		await fetch('https://api-freedom.com/api/v2/admin/auth/logout', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
	}

	// Clear cookie regardless of API result
	cookies.delete('admin_token', { path: '/' });

	throw redirect(303, '/');
};
