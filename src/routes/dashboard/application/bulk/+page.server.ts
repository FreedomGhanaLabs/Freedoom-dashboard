
import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/login');
	}

	const applicationRes = await fetch('https://api-freedom.com/api/v2/riders/admin/applications', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!applicationRes.ok) {
		throw error(applicationRes.status, `Failed to load applications (${applicationRes.status})`);
	}

	const applicationPayload = await applicationRes.json();
	const applications: any[] = applicationPayload.data ?? [];

	return {
		applications
	};
};

export const actions: Actions = {
	bulkUpdate: async ({ request, cookies, fetch }) => {
		const token = cookies.get('admin_token');
		if (!token) {
			throw redirect(303, '/');
		}

		const formData = await request.formData();
		const applicationIds = formData.getAll('applicationIds') as string[];
		const status = formData.get('status') as string;
		const reviewNotes = formData.get('reviewNotes') as string;

		if (!applicationIds.length) {
			return fail(400, {
				error: 'Please select at least one application'
			});
		}

		if (!status) {
			return fail(400, {
				error: 'Please select a status'
			});
		}

		try {
			const response = await fetch('https://api-freedom.com/api/v2/riders/admin/applications/bulk-update', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					applicationIds,
					status,
					reviewNotes: reviewNotes || undefined
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, {
					error: errorData.message || `Failed to update applications (${response.status})`
				});
			}

			const result = await response.json();
			
			return {
				success: true,
				message: `Successfully updated ${applicationIds.length} application(s) to ${status}`,
				updatedCount: applicationIds.length,
				data: result.data
			};

		} catch (err) {
			console.error('Bulk update error:', err);
			return fail(500, {
				error: 'An unexpected error occurred while updating applications'
			});
		}
	}
};