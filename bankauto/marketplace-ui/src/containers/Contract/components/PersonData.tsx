import React, { FC, memo } from 'react';
import { Grid, PHONE_INPUT_FORMAT } from '@marketplace/ui-kit';
import { Input, InputDate } from 'components/Fields';
import { TitleProps, FormBlock, FormBlockInner, EndAdornment } from './index';

type Props = { prefix: string; isBuyer?: boolean } & Pick<TitleProps, 'title' | 'tooltipText'>;

const PersonDataFieldSetRoot: FC<Props> = ({ prefix, isBuyer, title, tooltipText }) => {
  return (
    <FormBlock title={title} tooltipText={tooltipText}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Input name={`${prefix}Surname`} placeholder="Фамилия" variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input name={`${prefix}Name`} placeholder="Имя" variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input name={`${prefix}SecondName`} placeholder="Отчество" variant="outlined" />
        </Grid>
        {isBuyer ? (
          <>
            <Grid item xs={12} sm={4}>
              <Input mask={PHONE_INPUT_FORMAT} name="phone" placeholder="Телефон" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={8} />
          </>
        ) : null}
        <Grid item xs={12} sm={4}>
          <InputDate name={`${prefix}Birthday`} placeholder="Дата рождения" variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Input name={`${prefix}BirthPlace`} placeholder="Место рождения" variant="outlined" />
        </Grid>
      </Grid>
      <FormBlockInner title="Паспорт">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <InputDate name={`${prefix}PassportDate`} placeholder="Дата выдачи" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name={`${prefix}PassportSeries`} placeholder="Серия" variant="outlined" mask="####" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input name={`${prefix}PassportNumber`} placeholder="Номер" variant="outlined" mask="######" />
          </Grid>
          <Grid item xs={12}>
            <Input
              name={`${prefix}PassportIssuer`}
              placeholder="Кем выдан"
              endAdornment={<EndAdornment text="Кем выдан" />}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name={`${prefix}Address`}
              placeholder="Адрес регистрации"
              endAdornment={<EndAdornment text="Адрес регистрации" />}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </FormBlockInner>
    </FormBlock>
  );
};
const PersonDataFieldSet = memo(PersonDataFieldSetRoot);
export { PersonDataFieldSet };
