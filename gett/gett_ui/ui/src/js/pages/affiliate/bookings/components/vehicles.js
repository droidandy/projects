import { vehicles } from 'pages/shared/bookings/data';

const gettVehicleNames = ['BlackTaxi', 'BlackTaxiXL'];

export default vehicles.filter(vehicle => gettVehicleNames.includes(vehicle.name));
