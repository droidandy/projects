import React, { FC } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_INSTALMENT_STATUS,
  APPLICATION_TRADE_IN_STATUS,
  APPLICATION_TYPE,
} from '@marketplace/ui-kit/types';
import { Status } from '../Status';

interface Props {
  applicationType: APPLICATION_TYPE;
  creditStatus?: APPLICATION_CREDIT_STATUS;
  tradeInStatus?: APPLICATION_TRADE_IN_STATUS;
  instalmentStatus?: APPLICATION_INSTALMENT_STATUS;
}

const DealInfo: FC<Props> = ({ applicationType, creditStatus, tradeInStatus, instalmentStatus }) => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      {applicationType === APPLICATION_TYPE.VEHICLE && (
        <>
          {creditStatus === APPLICATION_CREDIT_STATUS.APPROVED && (
            <Box pt={isMobile ? 1.25 : 2.5}>
              <Status text="Кредит одобрен" />
            </Box>
          )}
          {tradeInStatus === APPLICATION_TRADE_IN_STATUS.CALCULATED && (
            <Box pt={1.25}>
              <Status text="Трейд-ин рассчитан" />
            </Box>
          )}
        </>
      )}
      {applicationType === APPLICATION_TYPE.INSTALMENT && (
        <Box pt={2.5}>
          {instalmentStatus === APPLICATION_INSTALMENT_STATUS.SUCCESS && <Status text="Рассрочка одобрена" />}
          {creditStatus === APPLICATION_CREDIT_STATUS.REFUSE && <Status text="Заявка отклонена" icon="prohibit" />}
          {instalmentStatus === APPLICATION_INSTALMENT_STATUS.CANCEL && (
            <Status text="Вы отменили сделку" icon="prohibit" />
          )}
        </Box>
      )}
      {applicationType === APPLICATION_TYPE.C2C && (
        <Box pt={2.5}>
          {creditStatus === APPLICATION_CREDIT_STATUS.APPROVED && <Status text="Кредит одобрен" />}
          {creditStatus === APPLICATION_CREDIT_STATUS.REFUSE && <Status text="Заявка отклонена" icon="prohibit" />}
        </Box>
      )}
    </>
  );
};

export { DealInfo };
