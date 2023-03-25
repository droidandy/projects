import { Partner } from '@marketplace/ui-kit/types';
import { DealerPartnersDTO } from '../../types/dtos/dealerPartnersDTO';

export const PartnerMapper = <T>(item: T, dto: DealerPartnersDTO): T & Partner => ({
  ...item,
  name: dto.name,
  logo: dto.logo,
  status: dto.status,
  id: dto.id,
});
