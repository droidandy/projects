import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { Tooltip } from '@material-ui/core';
import { useBreakpoints, Grid, Button } from '@marketplace/ui-kit';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { FilterButtonSubmit } from 'components/FilterButton';
import { Link } from 'components/Link';
import { AsyncAutocompleteNew as AsyncAutocomplete } from 'components/Fields';
import { ServiceStep } from 'types/Service';
import { setFieldDataOptions } from 'helpers/formUtils';
import { PageContainer } from '../../components';
import { pushAnalyticsEvent } from '../../helpers';
import { useWorkTypes } from '../../hooks/api';
import { useStyles } from './SelectWorkType.styles';
import { Btn } from './Btn';

type SelectWorkTypeProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  header: any;
};

const UremontDetails = () => {
  const s = useStyles();
  return (
    <div>
      <p className={s.uremont}>
        <a className={s.link} href="https://uremont.com/" target="_blank">
          UREMONT.COM
        </a>{' '}
        - это:
      </p>
      <ul>
        <li className={s.uremont}>16 000 проверенных автосервисов в России,</li>
        <li className={s.uremont}>Поддержка пользователей 24/7,</li>
        <li className={s.uremont}>10 минут среднее время записи на ремонт в автосервис,</li>
        <li className={s.uremont}>Гарантированный кешбэк 10% при оплате услуг онлайн,</li>
        <li className={s.uremont}>98,5% положительных отзывов автовладельцев о портале.</li>
      </ul>
      <br />
      <p className={s.uremont}>Свидетельство на товарный знак UREMONT №600792 зарегистрировано 27.01.2017г.</p>
    </div>
  );
};

export const SelectWorkType = ({ initialValues, data, navigate, onChange, onSet, header }: SelectWorkTypeProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const loadOptions = useWorkTypes();

  const handleContinue = (values: any) => {
    onSet(values);
    navigate(ServiceStep.BRAND);
    pushAnalyticsEvent({ form_step: 1 });
  };

  return (
    <PageContainer>
      {header}
      <Form
        onSubmit={handleContinue}
        initialValues={initialValues}
        mutators={{ setFieldDataOptions }}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <div>
            <div className={s.containerOptions}>
              <Btn label="Получить предложение от нескольких сервисов" active={true} />
              <Link href="/service/map">
                <Btn label="Выбрать сервис на карте" active={false} />
              </Link>
            </div>
            <p className={s.label}>Опишите работы по вашему авто</p>
            {isMobile ? (
              <>
                <Grid container direction="column" spacing={1} wrap="nowrap">
                  <Grid item>
                    <AsyncAutocomplete
                      className={s.control}
                      name="workType"
                      area="workType"
                      placeholder="Укажите работу"
                      variant="outlined"
                      loadOptions={loadOptions}
                      filterOptions={(options: any) => options}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      className={s.btn}
                      variant="contained"
                      color="primary"
                      size="large"
                      type="button"
                      fullWidth
                      disabled={!data?.workType}
                      onClick={handleSubmit}
                    >
                      Создать заявку
                    </Button>
                  </Grid>
                </Grid>
              </>
            ) : (
              <div className={s.desktop}>
                <InputGroup className={s.desktopGroup} templateAreas={[['workType']]}>
                  <AsyncAutocomplete
                    className={s.control}
                    name="workType"
                    area="workType"
                    placeholder="Укажите работу"
                    variant="outlined"
                    loadOptions={loadOptions}
                    filterOptions={(options: any) => options}
                  />
                </InputGroup>
                <FilterButtonSubmit disabled={!data?.workType} type="button" onClick={handleSubmit}>
                  <p className={s.btnText}>Создать заявку</p>
                </FilterButtonSubmit>
              </div>
            )}
            <p className={s.text}>
              Услуги по подбору автосервисов оказывает{' '}
              <Tooltip title={<UremontDetails />} enterTouchDelay={0} placement="top-end">
                <a className={s.link} href="https://uremont.com/" target="_blank">
                  UREMONT.COM
                </a>
              </Tooltip>
            </p>
            <FormSpy subscription={{ values: true }} onChange={onChange} />
          </div>
        )}
      </Form>
    </PageContainer>
  );
};
