import React, { FC, FormEvent, SyntheticEvent } from 'react';
import { Box, Button, CircularProgress, Divider, PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core/styles';
import { InfoTooltip, SwitchPanel } from 'components';
import { addMonths, format } from 'date-fns';
import { DATE_FORMAT } from 'helpers/validations/date';
import { BaseStateProperties } from 'store/types';
import { CardInfoModal } from '../../../../components';
import { useModal } from '../../../../hooks/modal';
import { getRatewithoutPercentWithdrawal } from '../../../../helpers/getRatewithoutPercentWithdrawal';

interface Props extends Pick<BaseStateProperties, 'loading' | 'error'> {
  amount: number;
  term: number;
  withoutPercentWithdrawal: boolean;
  onSubmit: () => void;
  depositRate: number;
  addition: number;
  expensesType: number;
  setExpensesType: React.Dispatch<React.SetStateAction<number>>;
}

const useStyles = makeStyles(() => ({
  modalTrigger: {
    cursor: 'pointer',
  },
}));

const Summary: FC<Props> = ({
  amount,
  term,
  onSubmit,
  loading,
  error,
  depositRate,
  withoutPercentWithdrawal,
  addition,
  expensesType,
  setExpensesType,
}) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const { isModalOpened, openModal, closeModal } = useModal();

  const handleChangeExpensesType = (event: FormEvent<HTMLFieldSetElement>) => {
    const input = event.target as HTMLInputElement;
    setExpensesType(+input.value);
  };

  const handleOpenModal = (event: SyntheticEvent) => {
    event.preventDefault();
    openModal();
  };

  let finalRate = depositRate;
  if (withoutPercentWithdrawal) {
    finalRate = getRatewithoutPercentWithdrawal(depositRate, term);
  }
  const resultAmount = Math.round(amount + (amount / 100) * finalRate * (term / 12));

  const depositEndDate = format(addMonths(new Date(), term), DATE_FORMAT);

  return (
    <>
      <Box>
        <Box pb="1.25rem">
          <Typography variant={isMobile ? 'h6' : 'h5'} component="span">
            Ежемесячные расходы{' '}
            <Typography
              variant={isMobile ? 'subtitle2' : 'subtitle1'}
              color="primary"
              className={s.modalTrigger}
              component="span"
              onClick={handleOpenModal}
            >
              по карте «АвтоДрайв»
            </Typography>
            <InfoTooltip
              title={
                <Box color="primary.contrastText">
                  <Typography variant="body1">
                    Сумма безналичных расходных операций по банковской карте за месяц в рамках маркетинговой акции
                    «Автодрайв»
                  </Typography>
                </Box>
              }
            />
          </Typography>
        </Box>
        <SwitchPanel
          items={[
            <>
              <Box>менее</Box>
              <Box>10 000 ₽</Box>
            </>,
            <>
              <Box>от 10 000 ₽</Box>
              <Box>до 50 000 ₽</Box>
            </>,
            <>
              <Box>50 000 ₽</Box>
              <Box>и более</Box>
            </>,
          ]}
          activeItem={expensesType}
          onChange={handleChangeExpensesType}
        />
        <Box display="flex" justifyContent="space-between" p="1.125rem 0">
          <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
            Надбавка к ставке
          </Typography>
          <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
            {loading && <CircularProgress size={isMobile ? '0.875rem' : '1rem'} />}
            {error && 'Ошибка сети'}
            {!loading && !error && `${addition.toFixed(2)}%`}
          </Typography>
        </Box>
        <Divider />
      </Box>

      <Box display="flex" justifyContent="space-between" p="1.125rem 0">
        <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
          Доходность по вкладу
          <InfoTooltip
            title={
              <Box color="primary.contrastText">
                <Typography variant="body1">
                  С учетом дополнительного дохода при выплате процентов в конце срока вклада (капитализация)
                </Typography>
              </Box>
            }
          />
        </Typography>
        {/* eslint-disable-next-line no-nested-ternary */}
        <Typography variant={error ? (isMobile ? 'subtitle2' : 'subtitle1') : isMobile ? 'h5' : 'h4'} color="primary">
          {loading && <CircularProgress size={isMobile ? '0.875rem' : '1rem'} />}
          {error && 'Ошибка сети'}
          {!loading && !error && `${finalRate.toFixed(2)}%`}
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" p="1.125rem 0">
        <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
          Сумма в конце вклада
        </Typography>
        <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
          {loading && <CircularProgress size={isMobile ? '0.875rem' : '1rem'} />}
          {error && 'Ошибка сети'}
          {!loading && !error && <PriceFormat value={resultAmount} />}
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" p="1.125rem 0">
        <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
          Доход по вкладу
        </Typography>
        <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
          {loading && <CircularProgress size={isMobile ? '0.875rem' : '1rem'} />}
          {error && 'Ошибка сети'}
          {!loading && !error && <PriceFormat value={resultAmount - amount} />}
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" p="1.125rem 0" mb="0.625rem">
        <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
          Дата окончания вклада
        </Typography>
        <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="span">
          {depositEndDate}
        </Typography>
      </Box>
      <Button fullWidth variant="contained" size="large" color="primary" onClick={onSubmit}>
        <Typography variant="h5" component="span">
          Открыть вклад
        </Typography>
      </Button>
      {isModalOpened ? <CardInfoModal closeModal={closeModal} /> : <></>}
    </>
  );
};

export { Summary };
