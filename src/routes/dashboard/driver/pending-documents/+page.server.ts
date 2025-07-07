import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
    const token = cookies.get('admin_token');
    if (!token) {
        throw redirect(303, '/login');
    }

    // Fetch pending document verifications
    const pendingDocsRes = await fetch('https://api-freedom.com/api/v2/driver/document/pending-verifications', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    if (!pendingDocsRes.ok) {
        throw error(
            pendingDocsRes.status,
            `Failed to load pending document verifications (${pendingDocsRes.status})`
        );
    }

    const pendingDocsPayload = await pendingDocsRes.json();
    const pendingDocumentVerifications = pendingDocsPayload.data ?? [];

    console.log('pendingDocsPayload', pendingDocsPayload);

    return {
        pendingDocumentVerifications
    };
};

export const actions: Actions = {
    approve: async ({ cookies, request, fetch }) => {
        const token = cookies.get('admin_token');
        if (!token) {
            throw redirect(303, '/login');
        }

        const data = await request.formData();
        const documentId = data.get('documentId');
        const documentType = data.get('documentType');
        const driverId = data.get('driverId');
        const comments = data.get('comments'); // Optional comments

        if (!documentId || !documentType || !driverId) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            const requestBody: any = {
                driverId,
                documentType,
                status: 'approved'
            };

            // Add comments if provided
            if (comments && comments.toString().trim()) {
                requestBody.comments = comments.toString().trim();
            }

            const response = await fetch('https://api-freedom.com/api/v2/driver/document/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Approval failed:', errorData);
                return fail(response.status, { 
                    error: errorData.message || 'Failed to approve document' 
                });
            }

            const result = await response.json();
            console.log('Document approved:', result);

            return {
                success: true,
                message: `${documentType} approved successfully`
            };

        } catch (err) {
            console.error('Error approving document:', err);
            return fail(500, { error: 'Internal server error' });
        }
    },

    reject: async ({ cookies, request, fetch }) => {
        const token = cookies.get('admin_token');
        if (!token) {
            throw redirect(303, '/login');
        }

        const data = await request.formData();
        const documentId = data.get('documentId');
        const documentType = data.get('documentType');
        const driverId = data.get('driverId');
        const comments = data.get('comments'); // Optional comments

        if (!documentId || !documentType || !driverId) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            const requestBody: any = {
                driverId,
                documentType,
                status: 'rejected'
            };

            // Add comments if provided
            if (comments && comments.toString().trim()) {
                requestBody.comments = comments.toString().trim();
            }

            const response = await fetch('https://api-freedom.com/api/v2/driver/document/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Rejection failed:', errorData);
                return fail(response.status, { 
                    error: errorData.message || 'Failed to reject document' 
                });
            }

            const result = await response.json();
            console.log('Document rejected:', result);

            return {
                success: true,
                message: `${documentType} rejected successfully`
            };

        } catch (err) {
            console.error('Error rejecting document:', err);
            return fail(500, { error: 'Internal server error' });
        }
    }
};