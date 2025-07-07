export const cleaner = (data: any) => {

    return {
        driverId: data.driverId,
        driverName: data.driverName,
        status: data.status,
        rides: data.rides,
        rating: data.rating,
        earnings: data.earnings,
        actions: data.actions,
        idName: data.driverId + data.driverName,
        firstName: data.driverName.split(' ')[0],
        lastName: data.driverName.split(' ')[1]
    };
};