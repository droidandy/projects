import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Icon,
  InputPhone,
  Typography,
  useBreakpoints,
} from '@marketplace/ui-kit';
import * as Yup from 'yup';
import { ReactComponent as IconSuccessNew } from 'icons/iconSuccessNew.svg';
import { Form, Field } from 'react-final-form';
import { ModalLight } from 'components/ModalLight';
import { Input } from 'components/Fields';
import { makeValidateSync } from 'components/Fields/validation';
import { licenseDocumentsLinks } from 'constants/licenseDocumentsLinks';
import { createApplicationExpress } from 'api/lead';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { pushCriteoAnalyticsEvent } from 'helpers/analytics';
import { fireExpressApplicationAnalytics } from 'helpers/analytics/events/booking';
import { ExpressFormSchema } from './ExpressForm.schema';
import { useStyles } from './ExpressModal.styles';

type ExpressFormValues = {
  phone: string;
  name: string;
};

const initialValues: ExpressFormValues = {
  name: '',
  phone: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleChangeVisibility: (val: boolean) => void;
  needTradeIn: boolean;
  needCredit: boolean;
  showSuccessContent?: boolean;
}

const validationSchema = Yup.object().shape({}).concat(ExpressFormSchema);
const validate = makeValidateSync(validationSchema);

export const ExpressModal: FC<Props> = ({
  isOpen,
  showSuccessContent = false,
  onClose,
  handleChangeVisibility,
  needCredit,
  needTradeIn,
}) => {
  const { vehicle } = useVehicleItem();
  const [isShowSuccessContent, setIsShowSuccessContent] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  const onSubmit = async (values: ExpressFormValues) => {
    setIsLoading(true);
    try {
      const app = await createApplicationExpress({
        ...values,
        needCredit,
        needTradeIn,
        vehicleId: vehicle!.id,
        vehicleColor: vehicle!.color.name,
      });
      fireExpressApplicationAnalytics({ withCredit: needCredit, withTradeIn: needTradeIn });
      pushCriteoAnalyticsEvent({
        rtrgAction: 'transaction',
        rtrgData: {
          transaction_id: app.data.id,
          products: [
            {
              id: vehicle?.id,
              price: vehicle?.price,
            },
          ],
        },
      });
      setIsShowSuccessContent(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const subtitle =
    'Наш менеджер свяжется с вами в течение \n 3 минут и подберёт автомобиль \n по лучшей цене на ваших условиях';

  const showSuccess = showSuccessContent || isShowSuccessContent;

  return (
    <ModalLight
      classes={{
        root: s.rootModal,
      }}
      isOpen={isOpen}
      handleOpened={handleChangeVisibility}
      onClose={onClose}
    >
      {!showSuccess ? (
        <Form onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
          {({ handleSubmit, hasValidationErrors }) => (
            <form onSubmit={handleSubmit}>
              <Grid container direction="column">
                <Box pb={5} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant={isMobile ? 'h4' : 'h3'}>Получить лучшее предложение</Typography>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" pb={3.5}>
                  {isMobile ? (
                    <Typography align="left" variant="subtitle2">
                      {subtitle}
                    </Typography>
                  ) : (
                    <Typography component="pre" align="center" variant="h5">
                      {subtitle}
                    </Typography>
                  )}
                </Box>

                <Grid item xs={12}>
                  <Field name="phone">
                    {({ input, meta }) => (
                      <InputPhone
                        variant="standard"
                        value={input.value}
                        onChange={input.onChange}
                        onBlur={input.onBlur}
                        error={!!meta.touched && meta.error}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Input name="name" placeholder="Имя" capitalize />
                </Grid>

                <Grid item xs={12}>
                  <Box py={2.5}>
                    <Checkbox
                      label={
                        <div>
                          Я принимаю{' '}
                          <a className={s.link} href={licenseDocumentsLinks.agreement} rel="noreferrer" target="_blank">
                            условия использования
                          </a>{' '}
                          сервиса bankauto.ru
                        </div>
                      }
                      checked={isChecked}
                      onChange={(e, value) => setIsChecked(value)}
                      className={s.checkbox}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    disabled={isLoading || hasValidationErrors || !isChecked}
                    type="submit"
                    variant="contained"
                    size="large"
                    color="primary"
                    fullWidth
                  >
                    {isLoading && (
                      <Box position="absolute" left="calc(50% - 1rem)" top="calc(50% - 1rem)">
                        <CircularProgress size="2rem" />
                      </Box>
                    )}
                    <Typography variant="h5">Отправить заявку</Typography>
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Form>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" bgcolor="common.white">
          <Box pb={2}>
            <Icon component={IconSuccessNew} className={s.icon} viewBox="0 0 80 80" />
          </Box>

          <Box pb={2.5}>
            <Typography variant="h5">Ваша заявка отправлена</Typography>
          </Box>

          <Box pb={isMobile ? 2.5 : 5}>
            <Typography component="pre" variant="body1">
              {'Наш менеджер свяжется с вами \n в течение 3 минут'}
            </Typography>
          </Box>

          <Button type="button" onClick={onClose} variant="contained" size="large" color="primary" fullWidth>
            <Typography variant="h5" component="span">
              Закрыть
            </Typography>
          </Button>
        </Box>
      )}
    </ModalLight>
  );
};
