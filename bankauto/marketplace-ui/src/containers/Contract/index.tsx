import React, { FC, useCallback } from 'react';
import { Form } from 'react-final-form';
import { Grid, Typography, Divider } from '@marketplace/ui-kit';
import { createContractPdf } from 'api';
import { useVehicleCreateData } from 'store/catalog/create/data';
import { FormSpyData } from 'containers/VehicleCreate/FormSpyData';
import { makeValidateSync } from 'components/Fields/validation';
import { setFieldDataOptions } from 'helpers/formUtils';
import { ContractButton, DateAndPlaceFieldSet, PersonDataFieldSet, VehicleDataFieldSet } from './components';
import { ContractFormSchema } from './schema';
import { useStyles } from './Contract.styles';

const validate = makeValidateSync(ContractFormSchema);

const getPdf = async (params: object = {}, isDownload: boolean = false) => {
  const {
    data: { url },
  } = await createContractPdf(params);
  if (isDownload) {
    window.open(url);
    return;
  }
  window.open(url)?.print();
};

const getNameById = (
  options: Record<string, string | number>[],
  id?: string | number | null,
  valueFieldName: string = 'value',
  labelFieldName: string = 'label',
) => {
  if (!id) return undefined;
  const option = options.find((item) => item[valueFieldName] === id);
  return option ? option[labelFieldName] : undefined;
};

const FORM_CONTRACT = 'FORM_CONTRACT';

export const ContractContainer: FC = () => {
  const texVariant = 'subtitle1';
  const { mainDescriptionWrapper, dividerWrapper, formWrapper, root, block, formFooter, dividerWhite } = useStyles();
  const {
    state: { data: vehicleCreateData },
  } = useVehicleCreateData();

  const printOrDownloadContract = useCallback(
    (values: Record<string, any>, isDownload: boolean = false) =>
      () => {
        const { brand: brandId, model: modelId, body: bodyId, color: colorId, year: vehicleYear, ...rest } = values;
        const vehicleBrand = getNameById(vehicleCreateData.brand, brandId);
        const vehicleModel = getNameById(vehicleCreateData.model, modelId);
        const vehicleType = getNameById(vehicleCreateData.body, bodyId, 'id', 'name');
        const color = getNameById(vehicleCreateData.color, colorId, 'id', 'name');
        const data = { vehicleBrand, vehicleModel, vehicleType, vehicleYear, color, ...rest };
        getPdf(data, isDownload);
      },
    [vehicleCreateData],
  );

  const printCliarContract = useCallback(() => {
    getPdf();
  }, []);

  return (
    <div className={root}>
      <Form
        onSubmit={() => {}}
        validate={validate}
        initialValues={{}}
        subscription={{ values: true }}
        mutators={{ setFieldDataOptions }}
      >
        {({ values }) => (
          <form name={FORM_CONTRACT}>
            <FormSpyData />
            <Typography component="h1" variant="h3">
              Договор купли-продажи автомобиля
            </Typography>
            <Grid container justify="space-between" alignItems="flex-end" spacing={2}>
              <Grid item xs={12} sm={6} className={mainDescriptionWrapper}>
                <Typography variant={texVariant}>
                  {`Договор купли-продажи необходимо распечатать в трех экземплярах (продавцу, покупателю \n и для
                  предоставления в ГИБДД) и подписать каждый экземпляр обеими сторонами сделки. \n Скачайте пустой бланк
                  или заполните его онлайн.`}
                </Typography>
              </Grid>
              <ContractButton text="Скачать договор в PDF" onClick={printOrDownloadContract(values, true)} />
            </Grid>
            <div className={dividerWrapper}>
              <Divider />
            </div>

            <Grid container className={formWrapper}>
              <DateAndPlaceFieldSet />
              <Grid item xs={12}>
                <Divider className={dividerWhite} />
              </Grid>
              <PersonDataFieldSet
                title="Текущий владелец транспортного средства"
                tooltipText="Текущий владелец транспортного средства"
                prefix="seller"
              />
              <Grid item xs={12}>
                <Divider className={dividerWhite} />
              </Grid>
              <PersonDataFieldSet
                title="Покупатель транспортного средства"
                tooltipText="Покупатель транспортного средства"
                prefix="buyer"
                isBuyer
              />
              <Grid item xs={12}>
                <Divider className={dividerWhite} />
              </Grid>

              <VehicleDataFieldSet />

              <Grid container spacing={2} className={formFooter}>
                <Grid item xs={12} sm={6}>
                  <Typography variant={texVariant}>
                    {`Договор купли-продажи необходимо распечатать в трех экземплярах (продавцу, \n покупателю и для
                    предоставления в ГИБДД) и подписать каждый экземпляр обеими \n сторонами сделки.`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="center" spacing={4}>
                    <ContractButton text="Распечатать пустой бланк" variant="outlined" onClick={printCliarContract} />
                    <ContractButton text="Распечатать договор" onClick={printOrDownloadContract(values)} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Form>
      <Grid container className={block}>
        <Grid item xs={12} sm={6}>
          <Typography variant={texVariant}>
            {`Указанная форма договора купли-продажи является справочной. Администрация Сайта \n
          не несет ответственности за действительность данного договора, а также за его \n
          соответствие требованиям ГИБДД России.`}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};
