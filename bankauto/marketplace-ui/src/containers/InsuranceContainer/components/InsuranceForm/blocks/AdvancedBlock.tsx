import React, { FC, useMemo } from 'react';
import { useBreakpoints } from '@marketplace/ui-kit';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { Input } from 'components/Fields';
import { Field } from 'react-final-form';
import flow from 'lodash/flow';

const uppercaseInputValue = (value: string) => value.toUpperCase();
const removeWhitespace = (value: string) => value.replace(/\s+/g, '');

const parsePTS = flow(removeWhitespace, uppercaseInputValue);

const AdvancedBlock: FC = () => {
  const { isMobile } = useBreakpoints();

  const templateAreas = useMemo(() => {
    return isMobile
      ? [['series'], ['vin'], ['ptsSeries'], ['ptsIssuedAt'], ['insuranceIssuedAt']]
      : [
          ['series', 'vin', 'ptsSeries'],
          ['ptsIssuedAt', 'insuranceIssuedAt', 'insuranceIssuedAt'],
        ];
  }, [isMobile]);

  return (
    <InputGroup templateAreas={templateAreas}>
      <Field name="isVehicleNotRegistered" subscription={{ value: true }}>
        {({ input: { value } }) => (
          <Input
            variant="outlined"
            area="series"
            placeholder="Гос. номер"
            name="series"
            parse={uppercaseInputValue}
            disabled={value}
          />
        )}
      </Field>
      <Input variant="outlined" area="vin" placeholder="VIN" name="vin" parse={uppercaseInputValue} />
      <Input variant="outlined" area="ptsSeries" placeholder="ПТС (серия и номер)" name="ptsSeries" parse={parsePTS} />
      <Input
        variant="outlined"
        useFormattedValue
        mask="##.##.####"
        area="ptsIssuedAt"
        placeholder="Дата выдачи ПТС"
        name="ptsIssuedAt"
      />
      <Input
        variant="outlined"
        useFormattedValue
        mask="##.##.####"
        area="insuranceIssuedAt"
        placeholder="Дата начала договора страхования"
        name="insuranceIssuedAt"
      />
    </InputGroup>
  );
};

export default AdvancedBlock;
