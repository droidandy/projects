import React, { FC, memo } from 'react';
import { Grid } from '@marketplace/ui-kit';
import { Input, InputNumber, InputDate, InputPrice } from 'components/Fields';
import { EndAdornment, FormBlock, FormBlockInner } from './index';
import { SelectBase } from 'components/Fields/SelectBase';
import { SelectNode } from 'components/Fields/SelectNode';

const VehicleDataFieldSetRoot: FC = () => {
  return (
    <FormBlock title="Транспортное средство" tooltipText="Транспортное средство">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <SelectBase name="brand" placeholder="Марка" variant="outlined" useScroll={false} show />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectBase name="model" placeholder="Модель" variant="outlined" useScroll={false} show />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectBase name="year" placeholder="Год" variant="outlined" useScroll={false} show />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input name="vehicleVin" placeholder="VIN" variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectNode name="body" placeholder="Тип ТС" variant="outlined" />
        </Grid>
      </Grid>

      <FormBlockInner title="Модель и номер двигателя">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Input name="engineModel" placeholder="Модель" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name="engineNumber" placeholder="Номер" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4} />
          <Grid item xs={12} sm={4}>
            <Input name="chassisNumber" placeholder="Номер шасси/рамы" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name="bodyNumber" placeholder="Номер кузова" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectNode name="color" placeholder="Цвет" variant="outlined" />
          </Grid>
        </Grid>
      </FormBlockInner>

      <FormBlockInner title="Мощность и объем двигателя">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <InputNumber name="power" suffix=" л.с" placeholder="Мощность" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputNumber name="volume" suffix=" л" placeholder="Объём" variant="outlined" />
          </Grid>
        </Grid>
      </FormBlockInner>

      <FormBlockInner title="Паспорт ТС (ПТС)">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <InputDate name="vehiclePassportDate" placeholder="Дата выдачи" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name="vehiclePassportSeries" placeholder="Серия" variant="outlined" uppercase />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name="vehiclePassportNumber" placeholder="Номер" variant="outlined" mask="######" />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="vehiclePassportIssuer"
              placeholder="Кем выдан"
              endAdornment={<EndAdornment text="Кем выдан" />}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </FormBlockInner>

      <FormBlockInner title="Свидетельство о регистрации (СТС)" tooltipText="Свидетельство о регистрации (СТС)">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <InputDate name="registerPassportDate" placeholder="Дата выдачи" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name="registerPassportSeries" placeholder="Серия" variant="outlined" uppercase />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name="registerPassportNumber" placeholder="Номер" variant="outlined" mask="######" />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="registerPassportIssuer"
              placeholder="Кем выдан"
              endAdornment={<EndAdornment text="Кем выдан" />}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputNumber name="mileage" suffix=" км" placeholder="Пробег" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name="number" placeholder="Госномер" variant="outlined" uppercase />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputPrice name="price" placeholder="Стоимость" variant="outlined" />
          </Grid>
        </Grid>
      </FormBlockInner>
    </FormBlock>
  );
};
const VehicleDataFieldSet = memo(VehicleDataFieldSetRoot);
export { VehicleDataFieldSet };
