import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import * as Rx from 'src/rx';
import { Alert } from 'src/components/Alert';
import { useTranslation } from 'react-i18next';
import { Table, Th, Td } from 'src/components/Table';
import { Checkbox } from 'src/components/Checkbox';
import { createModule, useActions } from 'typeless';
import { EditMeasuresSymbol, EditMeasuresSymbolForm } from '../symbol';
import { getScorecardsState, ScorecardsActions } from '../interface';
import { Kpi } from 'src/types-next';
import { formatCalendarPeriod, catchErrorAndShowModal } from 'src/common/utils';
import { createForm } from 'typeless-form';
import { validateNumber } from 'src/common/helper';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { Button } from 'src/components/Button';
import { SaveButtons } from 'src/components/SaveButtons';
import { GlobalActions } from 'src/features/global/interface';
import { updateDataSeries, getKpi } from 'src/services/API-next';

interface EditMeasuresTabProps {
  className?: string;
}

const Scroll = styled.div`
  max-height: 350px;
  overflow: auto;
  margin-bottom: 20px;
`;

const Center = styled.div`
  text-align: center;
  margin-top: 15px;
`;

export const EditMeasuresTab = (props: EditMeasuresTabProps) => {
  handle();
  useEditMeasuresForm();
  const { className } = props;
  const { t } = useTranslation();
  const { data, selectedPeriod, isSaving } = getEditMeasuresState.useState();
  const kpi = getScorecardsState.useState().resource as Kpi;
  const { setPeriod, save } = useActions(EditMeasuresActions);
  const { submit } = useActions(EditMeasuresFormActions);
  const selectedPeriodText = React.useMemo(() => {
    if (!selectedPeriod) {
      return '';
    }
    const current = kpi.dataSeries.find(x => x.id === selectedPeriod);
    return formatCalendarPeriod(current!);
  }, [selectedPeriod, kpi]);
  return (
    <div className={className}>
      <Alert
        type="info"
        icon={<i className="flaticon-questions-circular-button" />}
      >
        {t('From table select the period you want to update its value')}
      </Alert>
      <h3>{t('KPI Values')}</h3>
      <Scroll>
        <Table>
          <thead>
            <tr>
              <Th style={{ width: 40, minWidth: 0 }}></Th>
              <Th>{t('Period')}</Th>
              <Th>{t('Actual Value')}</Th>
              <Th>{t('Target')}</Th>
            </tr>
          </thead>
          <tbody>
            {kpi.dataSeries
              .filter(x => x.periodFrequency === kpi.periodFrequency)
              .map(item => (
                <tr key={item.id}>
                  <Td style={{ minWidth: 0 }}>
                    <Checkbox
                      checked={item.id === selectedPeriod}
                      onChange={() => {
                        setPeriod(item.id);
                      }}
                      radio
                      style={{ marginBottom: 0 }}
                    />
                  </Td>
                  <Td>{formatCalendarPeriod(item)}</Td>
                  <Td>{data[item.id]}</Td>
                  <Td>{item.target}</Td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Scroll>
      {selectedPeriod && (
        <EditMeasuresFormProvider>
          {t(
            'Please fill the following fields to calculate the actual value for '
          )}
          {selectedPeriodText}
          <form
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
          >
            <FormItem label={t('Value')} required>
              <FormInput name="fixedValue" />
            </FormItem>
            <Center>
              <Button>{t('Apply')}</Button>
            </Center>
          </form>
        </EditMeasuresFormProvider>
      )}
      <SaveButtons onSave={save} isSaving={isSaving} />
    </div>
  );
};

export const [handle, EditMeasuresActions, getEditMeasuresState] = createModule(
  EditMeasuresSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    setPeriod: (selectedPeriod: number) => ({ payload: { selectedPeriod } }),
    setValue: (period: number, value: number) => ({
      payload: { period, value },
    }),
    save: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    initData: (data: { [x: string]: number }) => ({ payload: { data } }),
  })
  .withState<EditMeasuresState>();

export interface EditMeasuresState {
  isSaving: boolean;
  selectedPeriod?: number | null;
  data: { [x: string]: number };
}

const initialState: EditMeasuresState = {
  isSaving: false,
  selectedPeriod: null,
  data: {},
};

export interface EditMeasuresFormValues {
  fixedValue: number | string;
}

export const [
  useEditMeasuresForm,
  EditMeasuresFormActions,
  getEditMeasuresFormState,
  EditMeasuresFormProvider,
] = createForm<EditMeasuresFormValues>({
  symbol: EditMeasuresSymbolForm,
  validator: (errors, values) => {
    validateNumber(errors, values, 'fixedValue', true);
  },
});

handle
  .epic()
  .on(EditMeasuresActions.$mounted, () => {
    const kpi = getScorecardsState().resource as Kpi;

    return EditMeasuresActions.initData(
      kpi.dataSeries.reduce((ret, item) => {
        ret[item.id] = item.value;
        return ret;
      }, {} as { [x: string]: number })
    );
  })
  .on(EditMeasuresFormActions.setSubmitSucceeded, () => {
    const { selectedPeriod } = getEditMeasuresState();
    const {
      values: { fixedValue },
    } = getEditMeasuresFormState();
    return EditMeasuresActions.setValue(
      selectedPeriod!,
      fixedValue == null || fixedValue === '' ? null! : Number(fixedValue)
    );
  })
  .on(EditMeasuresActions.save, () => {
    const { data } = getEditMeasuresState();
    const kpi = getScorecardsState().resource as Kpi;
    const dataSeries = kpi.dataSeries.map(item => ({
      ...item,
      value: data[item.id],
    }));
    const originalDataSeries = R.indexBy(kpi.dataSeries, x => x.id);
    return Rx.concatObs(
      Rx.of(EditMeasuresActions.setSaving(true)),
      Rx.from(dataSeries).pipe(
        Rx.mergeMap(item => {
          const original = originalDataSeries[item.id];
          if (original.value !== item.value) {
            return updateDataSeries(item.id, {
              KPIDataSeries: item,
              GetPerformance: true,
            });
          } else {
            return Rx.empty();
          }
        }),
        Rx.toArray(),
        Rx.mergeMap(() => getKpi(kpi.id)),
        Rx.mergeMap(updated => {
          return [
            ScorecardsActions.resourceUpdated(updated),
            ScorecardsActions.setSelectedTab('overview'),
            GlobalActions.showNotification(
              'success',
              'KPI Values updated successfully'
            ),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(EditMeasuresActions.setSaving(false))
    );
  });

handle
  .reducer(initialState)
  .replace(EditMeasuresActions.$init, () => initialState)
  .on(EditMeasuresActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(EditMeasuresActions.initData, (state, { data }) => {
    state.data = data;
  })
  .on(EditMeasuresActions.setPeriod, (state, { selectedPeriod }) => {
    state.selectedPeriod = selectedPeriod;
  })
  .on(EditMeasuresActions.setValue, (state, { period, value }) => {
    state.data[period] = value;
  });
