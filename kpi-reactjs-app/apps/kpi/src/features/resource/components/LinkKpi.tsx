import * as React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import styled from 'styled-components';
import { createModule, useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { SelectOption } from 'src/types';
import { createForm } from 'typeless-form';
import { validateOption, validateNumber } from 'src/common/helper';
import { Modal } from 'src/components/Modal';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { Kpi, TransString } from 'src/types-next';
import { FormSelect } from 'src/components/FormSelect';
import { convertToOption, catchErrorAndShowModal } from 'src/common/utils';
import { getAllKpi } from 'src/services/API-next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { getResourceFormState, ResourceFormActions } from '../resource-form';
import { getLinkedKpiProp } from '../utils';
import { LinkKpiFormSymbol, LinkKpiSymbol } from '../symbol';

const ButtonWrapper = styled.div`
  margin: 15px 0;
  display: flex;
  justify-content: flex-end;
`;

export function LinkKpi() {
  handle();
  useLinkKpiForm();
  const { isVisible, kpis, kpiData } = getLinkKpiState.useState();
  const { values, errors, touched } = getResourceFormState.useState();
  const { close, show } = useActions(LinkKpiActions);
  const { submit } = useActions(LinkKpiFormActions);
  const kpiOptions = React.useMemo(() => {
    if (!kpis) {
      return null;
    }
    const used = R.indexBy(values.linkedKpis || [], x => x);
    if (kpiData) {
      delete used[kpiData.kpi];
    }
    return kpis.filter(x => !used[x.id]).map(convertToOption);
  }, [kpis, values.linkedKpis]);

  const { t } = useTranslation();
  return (
    <>
      <ButtonWrapper>
        <div>
          <Button onClick={() => show(null)}>{t('Link KPI')}</Button>
          {(!values.linkedKpis || values.linkedKpis.length === 0) &&
            errors.linkedKpis &&
            touched.linkedKpis && (
              <ErrorMessage>{errors.linkedKpis}</ErrorMessage>
            )}
        </div>
      </ButtonWrapper>
      <Modal size="lg" isOpen={isVisible} title={t('Link KPI')} close={close}>
        <LinkKpiFormProvider>
          <FormItem label="KPI" required>
            <FormSelect
              name="kpi"
              options={kpiOptions || []}
              isLoading={kpiOptions == null}
            />
          </FormItem>
          <FormItem label="Weight" required>
            <FormInput name="weight" />
          </FormItem>
          <SaveButtons onCancel={close} onSave={submit} />
        </LinkKpiFormProvider>
      </Modal>
    </>
  );
}

export const [handle, LinkKpiActions, getLinkKpiState] = createModule(
  LinkKpiSymbol
)
  .withActions({
    show: (kpiData: LinkKpiData | null) => ({ payload: { kpiData } }),
    kpisLoaded: (kpis: Kpi[]) => ({ payload: { kpis } }),
    close: null,
  })
  .withState<LinkKpiState>();

interface LinkKpiData {
  kpi: number;
  name: TransString;
  weight: number;
}

interface LinkKpiState {
  isVisible: boolean;
  kpiData: LinkKpiData | null;
  kpis: Kpi[] | null;
}

export interface LinkKpiFormValues {
  kpi: SelectOption;
  weight: number;
}

export const [
  useLinkKpiForm,
  LinkKpiFormActions,
  getLinkKpiFormState,
  LinkKpiFormProvider,
] = createForm<LinkKpiFormValues>({
  symbol: LinkKpiFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'kpi');
    validateNumber(errors, values, 'weight');
    if (!errors.weight) {
      if (values.weight < 1 || values.weight > 100) {
        errors.weight = 'Weight must be between 1-100';
      }
    }
  },
});

handle
  .epic()
  .on(LinkKpiActions.show, ({ kpiData }) => {
    if (!kpiData) {
      return LinkKpiFormActions.reset();
    } else {
      return [
        LinkKpiFormActions.reset(),
        LinkKpiFormActions.changeMany({
          kpi: {
            label: <DisplayTransString value={kpiData.name} />,
            value: kpiData.kpi,
          },
          weight: kpiData.weight,
        }),
      ];
    }
  })
  .on(LinkKpiActions.show, () =>
    getAllKpi().pipe(
      Rx.map(ret => LinkKpiActions.kpisLoaded(ret)),
      catchErrorAndShowModal()
    )
  )
  .on(LinkKpiFormActions.setSubmitSucceeded, () => {
    const { kpis } = getLinkKpiState();
    if (!kpis) {
      return Rx.empty();
    }
    const { values } = getLinkKpiFormState();
    const { values: infoValues } = getResourceFormState();
    const linkedKpis = [...(infoValues.linkedKpis || [])];
    const id = values.kpi.value as number;
    const kpi = kpis.find(x => x.id === id)!;
    if (!linkedKpis.includes(id)) {
      linkedKpis.push(id);
    }
    return [
      LinkKpiActions.close(),
      ResourceFormActions.changeMany({
        linkedKpis,
        [getLinkedKpiProp(id, 'weight')]: values.weight,
        [getLinkedKpiProp(id, 'name')]: kpi.name,
      }),
    ];
  });

const initialState: LinkKpiState = {
  isVisible: false,
  kpiData: null,
  kpis: null,
};

handle
  .reducer(initialState)
  .on(LinkKpiActions.show, (state, { kpiData }) => {
    Object.assign(state, initialState);
    state.isVisible = true;
    state.kpiData = kpiData;
  })
  .on(LinkKpiActions.close, state => {
    state.isVisible = false;
  })
  .on(LinkKpiActions.kpisLoaded, (state, { kpis }) => {
    state.kpis = kpis;
  });
