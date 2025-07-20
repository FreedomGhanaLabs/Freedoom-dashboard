
import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ params, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) {
        throw redirect(303, '/login');
    }

    const { id } = params;
    console.log(`Starting load function for ID: ${id}`);

    const url = `https://api-freedom.com/api/v2/riders-program/drivers/${id}`;
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


    return {
        id,
        ride: result.data,

    };

};
export const actions: Actions = {
    approveDriver: async ({ request, params, fetch, cookies }) => {
        const token = cookies.get('admin_token');
        if (!token) throw redirect(303, '/login');

        const { id } = params;
        const formData = await request.formData();
        const notes = formData.get('notes')?.toString() || '';

        const response = await fetch(`https://api-freedom.com/api/v2/riders-program/drivers/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                registrationStatus: 'approved',
                notes
            })
        });

        if (!response.ok) {
            const result = await response.json();
            console.error(result);
            return fail(response.status, {
                message: 'Failed to approve driver'
            });
        }

        return {
            success: true
        };
    },

    extendPayment: async ({ request, params, fetch, cookies }) => {
        const token = cookies.get('admin_token');
        if (!token) throw redirect(303, '/login');

        const { id } = params;
        const formData = await request.formData();

        const extensionMonths = Number(formData.get('extensionMonths'));
        const reason = formData.get('reason')?.toString() || '';

        const response = await fetch(`https://api-freedom.com/api/v2/riders-program/drivers/${id}/extend`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ extensionMonths, reason })
        });

        if (!response.ok) {
            const result = await response.json();
            console.error(result);
            return fail(response.status, {
                message: 'Failed to extend payment duration'
            });
        }

        return { success: true };
    }
};


