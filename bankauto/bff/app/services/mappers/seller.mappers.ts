import { Seller } from '@marketplace/ui-kit/types';
import { SellerInfoDTO } from '../../types/dtos/seller.dto';

export const SellerInfoMapper = (dto: SellerInfoDTO): Seller => ({
  phoneNumber: dto.phone,
  firstName: dto.first_name,
  lastName: (dto.last_name && dto.last_name) || undefined,
});
