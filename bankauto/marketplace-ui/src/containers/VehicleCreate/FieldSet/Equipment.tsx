import React, { FC, memo } from 'react';
import { Grid } from '@marketplace/ui-kit';
import { useVehicleCreateDataProperties } from 'store/catalog/create/data';
import { FormControlBlock, FormControlBlockProps } from 'components/FormControlBlock';
import {
  EquipmentSelectNode,
  EquipmentSelectBody,
  EquipmentSelectGeneration,
} from '../../../components/Fieldsets/EquipmentSelect';
import { SelectNode } from '../../../components/Fields/SelectNode';

type FCProps = Pick<FormControlBlockProps, 'useScroll'>;

const RestEquipmentFieldSet: FC<FCProps> = ({ useScroll }) => {
  const { modification } = useVehicleCreateDataProperties();
  return (
    <FormControlBlock show={!!modification.length} useScroll={useScroll} register>
      <Grid container spacing={4} style={{ marginTop: '1rem' }}>
        <Grid item xs={12} sm={4}>
          <SelectNode name="modification" placeholder="Модификация" variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectNode name="color" placeholder="Цвет" variant="outlined" />
        </Grid>
      </Grid>
    </FormControlBlock>
  );
};

export const VehicleEquipmentFieldSet: FC<FCProps> = memo(({ useScroll }) => {
  return (
    <>
      <EquipmentSelectBody name="body" title="Тип кузова" />
      <EquipmentSelectGeneration name="generation" title="Поколение" />
      <EquipmentSelectNode name="engine" title="Двигатель" />
      <EquipmentSelectNode name="drive" title="Привод" />
      <EquipmentSelectNode name="transmission" title="Коробка передач" />
      <RestEquipmentFieldSet useScroll={useScroll} />
    </>
  );
});
