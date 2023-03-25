import React from 'react';
import * as R from 'remeda';
import { Col, Row } from 'src/components/Grid';
import { FormItem } from 'src/components/FormItem';
import { FormSelect } from 'src/components/FormSelect';
import { createForm } from 'typeless-form';
import { SelectOption } from 'src/types';
import {
  validateOption,
  UnreachableCaseError,
  validateNumber,
} from 'src/common/helper';
import { getStrategicDocument } from 'src/features/global/selectors';
import {
  useSelector,
  useMappedState,
  useActions,
  createModule,
} from 'typeless';
import { FormInput } from 'src/components/ReduxInput';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import { formatCalendarPeriod } from 'src/common/utils';
import { PeriodFrequency, KPICalendarPeriod } from 'src/types-next';
import { getResourceFormState, ResourceFormActions } from '../resource-form';
import { KpiPeriodSymbol, AddPeriodFormSymbol } from '../symbol';

function generateOptions(
  frequency: PeriodFrequency,
  year: number
): Array<{
  value: KPICalendarPeriod;
  label: React.ReactNode;
  filterName: PeriodFrequency;
}> {
  switch (frequency) {
    case 'Annually': {
      const value = {
        id: undefined,
        type: frequency,
        year,
        periodNumber: 0,
      };
      return [
        {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        },
      ];
    }
    case 'SemiAnnually':
      return R.range(1, 3).map(half => {
        const value = {
          id: undefined,
          type: frequency,
          year,
          periodNumber: half,
        };
        return {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        };
      });
    case 'Quarterly':
      return R.range(1, 5).map(quarter => {
        const value = {
          id: undefined,
          type: frequency,
          year,
          periodNumber: quarter,
        };
        return {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        };
      });
    case 'Monthly':
      return R.range(1, 12).map(month => {
        const value = {
          id: undefined,
          type: frequency,
          year,
          periodNumber: month,
        };
        return {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        };
      });
    default:
      throw new UnreachableCaseError(frequency);
  }
}

function usePeriodOptions() {
  const doc = useSelector(getStrategicDocument)!;
  const { frequency, periods } = useMappedState(
    [getResourceFormState],
    state => ({
      frequency: state.values.frequency,
      periods: state.values.periods,
    })
  );
  const usedPeriod = React.useMemo(() => {
    return (periods || []).reduce((ret, item) => {
      ret[formatCalendarPeriod(item)] = true;
      return ret;
    }, {} as { [x: string]: true });
  }, [periods]);
  if (!frequency) {
    return [];
  }
  const options = R.pipe(
    R.range(doc.startYear, doc.endYear + 1),
    R.flatMap(year => generateOptions(frequency.value, year))
  );
  if (frequency.value !== 'Annually') {
    const yearOptions = R.range(doc.startYear, doc.endYear + 1).map(
      year => generateOptions('Annually', year)[0]
    );
    options.unshift(...yearOptions);
  }
  return options.filter(item => !usedPeriod[formatCalendarPeriod(item.value)]);
}

const ButtonWrapper = styled.div`
  padding-top: 15px;
  display: flex;
  align-items: center;
  height: 100%;
`;

export function KpiPeriodForm() {
  handle();
  useAddPeriodForm();
  const periodOptions = usePeriodOptions();
  const { t } = useTranslation();
  const { submit } = useActions(AddPeriodFormActions);
  return (
    <AddPeriodFormProvider>
      <Row>
        <Col>
          <FormItem label="Period" required>
            <FormSelect name="period" options={periodOptions} />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="Target">
            <FormInput name="target" style={{ width: 60 }} />
          </FormItem>
        </Col>
        <Col grow={2}>
          <ButtonWrapper>
            <Button
              small
              onClick={e => {
                submit();
              }}
            >
              {t('Add')}
            </Button>
          </ButtonWrapper>
        </Col>
      </Row>
    </AddPeriodFormProvider>
  );
}

export interface AddPeriodFormValues {
  period: SelectOption;
  target: string;
  aggregated: boolean;
}

export const [
  useAddPeriodForm,
  AddPeriodFormActions,
  getAddPeriodFormState,
  AddPeriodFormProvider,
] = createForm<AddPeriodFormValues>({
  symbol: AddPeriodFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'period');
    validateNumber(errors, values, 'target', true);
  },
});

export const [handle, KpiPeriodActions] = createModule(
  KpiPeriodSymbol
).withActions({});

handle.epic().on(AddPeriodFormActions.setSubmitSucceeded, () => {
  const periods = getResourceFormState().values.periods || [];
  getAddPeriodFormState();
  const { values } = getAddPeriodFormState();
  const period = values.period.value as KPICalendarPeriod;
  const target = values.target ? Number(values.target) : null;
  const key = formatCalendarPeriod(period);
  const prefix = `period_${key}_`;
  return [
    ResourceFormActions.changeMany({
      periods: [...periods, period],
      [`${prefix}target`]: target,
    }),
    AddPeriodFormActions.reset(),
  ];
});
