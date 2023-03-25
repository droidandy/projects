import React, { FC, useCallback, useState } from 'react';
import { ContainerWrapper, Typography, useBreakpoints, Box } from '@marketplace/ui-kit';
import { CreditSubtype } from '@marketplace/ui-kit/types';
import cx from 'classnames';
import { PersonalData } from 'types/CreditFormDataTypes';
import { ComponentProps } from 'types/ComponentProps';
import { createCreditApplication } from 'api';
import { updateCreditStepsData } from 'api/application';
import { messageModalActions } from 'store/message-modal';
import { MessageModalName } from 'types/MessageModal';
import { useDispatch } from 'react-redux';
import { useNotifications } from 'store/notifications';
import { PersonalDataForm } from './components';
import { useStyles } from './DataSubmit.styles';

interface Props extends ComponentProps {
  slug?: string;
}

// фейковые данные для создания заявки
const createData = {
  vehicle_id: 0,
  sales_office_id: 0,
  initial_payment: 0,
  amount: 0,
  term: 0,
  subtype: '7' as unknown as CreditSubtype,
  rate: 0,
  monthly_payment: 0,
  vehicle_cost: 0,
};

const DataSubmit: FC<Props> = ({ className, slug }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const [loading, setLoading] = useState(false);
  const { notifyError } = useNotifications();
  const dispatch = useDispatch();

  const handleFormSubmit = useCallback(
    async (data: PersonalData) => {
      setLoading(true);
      try {
        const {
          data: { id, uuid },
        } = await createCreditApplication(createData);

        await updateCreditStepsData(
          id,
          {
            frontend_step: 0,
            frontend_data: JSON.stringify({ ...data, slug }),
          },
          uuid,
        );

        dispatch(messageModalActions.open(MessageModalName.SPECIAL_PROGRAM_REQUEST_CREATED));
      } catch (error) {
        notifyError('Не удалось отправить заявку');
      } finally {
        setLoading(false);
      }
    },
    [slug, dispatch, notifyError],
  );

  return (
    <>
      <ContainerWrapper>
        <Box mb={isMobile ? 2.5 : 7.5}>
          <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} align="center">
            Начните действовать &mdash; заполните заявку!
          </Typography>
        </Box>
        <Box className={cx(s.root, className)}>
          <PersonalDataForm onSubmit={handleFormSubmit} isLoading={loading} />
        </Box>
      </ContainerWrapper>
    </>
  );
};

export { DataSubmit };
