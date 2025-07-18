// +page.server.ts
import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const token = cookies.get('admin_token');
        if (!token) throw redirect(303, '/login');

        const formData = await request.formData();

        const payload = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            otherName: formData.get('otherName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dateOfBirth: formData.get('dateOfBirth'),
            gender: formData.get('gender'),
            address: formData.get('address'),
            city: formData.get('city'),
            region: formData.get('region'),
            driverLicense: {
                licenseNumber: formData.get('licenseNumber'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                otherName: formData.get('otherName'),
                dateOfBirth: formData.get('dateOfBirth'),
                classOfLicense: formData.get('classOfLicense'),
                nationality: formData.get('licenseNationality'),
                issueDate: formData.get('licenseIssueDate'),
                expiryDate: formData.get('licenseExpiryDate')
            },
            ghanaCard: {
                personalIdNumber: formData.get('ghanaCardId'),
                lastName: formData.get('lastName'),
                firstName: formData.get('firstName'),
                otherName: formData.get('otherName'),
                sex: formData.get('gender'),
                dateOfBirth: formData.get('dateOfBirth'),
                height: formData.get('ghanaHeight'),
                expiryDate: formData.get('ghanaExpiryDate')
            },
            guarantor: {
                firstName: formData.get('guarantorFirstName'),
                lastName: formData.get('guarantorLastName'),
                otherName: formData.get('guarantorOtherName'),
                phone: formData.get('guarantorPhone'),
                email: formData.get('guarantorEmail'),
                relationship: formData.get('guarantorRelationship'),
                occupation: formData.get('guarantorOccupation'),
                address: formData.get('guarantorAddress'),
                landmark: formData.get('guarantorLandmark'),
                ghanaCard: {
                    personalIdNumber: formData.get('guarantorGhanaId'),
                    lastName: formData.get('guarantorLastName'),
                    firstName: formData.get('guarantorFirstName'),
                    otherName: formData.get('guarantorOtherName'),
                    sex: 'F',
                    dateOfBirth: '1988-03-20',
                    height: formData.get('guarantorHeight'),
                    expiryDate: formData.get('guarantorExpiryDate')
                }
            },
            bikeProgram: {
                bikeModel: formData.get('bikeModel'),
                bikePrice: Number(formData.get('bikePrice')),
                paymentDuration: Number(formData.get('paymentDuration')),
                startDate: formData.get('startDate')
            }
        };



        const driverLicense = formData.get('driverLicense');
        const ghanaCard = formData.get('ghanaCard');
        const proofOfAddress = formData.get('proofOfAddress');
        const guarantorGhanaCard = formData.get('guarantorGhanaCard');
        const guarantorProofOfAddress = formData.get('guarantorProofOfAddress');

        // multipart form submission
        const body = new FormData();
        body.append('driverData', JSON.stringify(payload));

        if (driverLicense instanceof File) body.append('driverLicense', driverLicense);
        if (ghanaCard instanceof File) body.append('ghanaCard', ghanaCard);
        if (proofOfAddress instanceof File) body.append('proofOfAddress', proofOfAddress);
        if (guarantorGhanaCard instanceof File) body.append('guarantorGhanaCard', guarantorGhanaCard);
        if (guarantorProofOfAddress instanceof File) body.append('guarantorProofOfAddress', guarantorProofOfAddress);

        const res = await fetch('https://api-freedom.com/api/v2/riders-program/drivers/register', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body
        });

        const responseData = await res.json();

        if (!res.ok) {
            console.error('Registration failed:', responseData);
            return fail(res.status, { error: responseData.message || 'Registration failed' });
        }

        return {
            success: true,
            message: responseData.message || 'Driver registered successfully',
            data: responseData.data // or whatever structure the API returns
        };

    }
};
