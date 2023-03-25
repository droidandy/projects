import API, { CancellableAxiosPromise } from 'api/request';
import { BDASpecialOffer, SpecialOfferItem, VehicleShort } from '@marketplace/ui-kit/types';

function getSpecialPrograms(): CancellableAxiosPromise<SpecialOfferItem[]> {
  return API.get('/banking/special-offers/');
}

function getSpecialProgram(slug: string): CancellableAxiosPromise<BDASpecialOffer> {
  return API.get(`/banking/special-offers/${slug}`);
}

function getVehiclesBySpecialProgram(id: number): CancellableAxiosPromise<VehicleShort[]> {
  return API.get(`/vehicle/special-offer/${id}`);
}

export { getSpecialPrograms, getSpecialProgram, getVehiclesBySpecialProgram };
