import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) throw redirect(303, '/login');

    const { id: driverId } = params;

    const response = await fetch(`https://api-freedom.com/api/v2/riders-program/payments/driver/${driverId}/statement`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
   
   
    if (!response.ok) {
        console.error('Failed to fetch PDF:', await response.text());
        throw error(response.status, 'Could not generate profile PDF');
    }

    // Stream the PDF back to the browser
    const blob = await response.blob();
    return new Response(blob, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="driver-${driverId}-profile.pdf"`
        }
    });
};