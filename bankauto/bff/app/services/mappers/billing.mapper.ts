import { CURRENCY, PaymentOrder, PAYMENT_ORDER_STATUS } from '@marketplace/ui-kit/types';
import { PaymentOrderDTO } from 'types/dtos/billing.dto';

export const PaymentOrderMapper = <T>(item: T, dto: PaymentOrderDTO): T & PaymentOrder => {
  return {
    ...item,
    id: dto.id,
    amount: dto.amount,
    gateway: dto.gateway,
    status: dto.status as PAYMENT_ORDER_STATUS,
    currency: dto.currency as CURRENCY,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    externalId: dto.external_id,
    failUrl: dto.fail_url,
    returnUrl: dto.return_url,
    signature: dto.signature,
    holdUrl: dto.hold_url,
  };
};
