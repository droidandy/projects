import React from 'react';
import * as R from 'remeda';
import { useTranslation } from 'react-i18next';
import { SkipConfirmSymbol } from '../symbol';
import { createModule, useActions } from 'typeless';
import { Button } from 'src/components/Button';
import {
  TransString,
  UserKpiReport,
  KPISeriesReportValidationItem,
} from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import styled from 'styled-components';
import { Modal } from 'src/components/Modal';
import { Checkbox } from 'src/components/Checkbox';

const Par = styled.div`
  padding: 0 30px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  margin: 15px 0;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f9fc;
  padding: 16px 30px;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 5px;
  color: #244159;
`;

export function SkipConfirmModal() {
  handle();
  const { t } = useTranslation();
  const { isVisible, items, nameMap } = getSkipConfirmState.useState();
  const { onResult } = useActions(SkipConfirmActions);
  const ids = R.pipe(
    items,
    R.flatMap(x => x.items),
    R.uniq()
  );

  const total = ids.length;
  const [selected, setSelected] = React.useState(0);
  return (
    <Modal
      isOpen={isVisible}
      close={() => onResult('close')}
      size="sm"
      buttons={
        <>
          <Button onClick={() => onResult('close')} styling="secondary">
            {t('Cancel')}
          </Button>
          <Button
            onClick={() => onResult('skip')}
            styling="primary"
            disabled={total !== selected}
          >
            {t('Save')}
          </Button>
        </>
      }
      title={t('Submit KPI')}
      subTitle={t('Department KPIs will be submitted for approval.')}
    >
      <Par>3 {t('KPIs have incomplete data/evidence.')}</Par>
      <Par>
        {t(
          'Please confirm that you want to skip these KPIs to continue with the submission.'
        )}
      </Par>
      {ids.map(id => (
        <ItemWrapper key={id}>
          <DisplayTransString value={nameMap[id]} />
          <Checkbox
            noMargin
            onChange={e => {
              setSelected(selected + (e.target.checked ? 1 : -1));
            }}
          >
            {t('Skip')}
          </Checkbox>
        </ItemWrapper>
      ))}
    </Modal>
  );
}
export const [handle, SkipConfirmActions, getSkipConfirmState] = createModule(
  SkipConfirmSymbol
)
  .withActions({
    show: (
      unitReport: UserKpiReport,
      items: KPISeriesReportValidationItem[],
      nameMap: { [x: number]: TransString }
    ) => ({ payload: { unitReport, items, nameMap } }),
    close: null,
    onResult: (skipResult: 'close' | 'skip') => ({ payload: { skipResult } }),
  })
  .withState<SkipConfirmState>();

handle.epic().on(SkipConfirmActions.onResult, () => {
  return SkipConfirmActions.close();
});

interface SkipConfirmState {
  isVisible: boolean;
  isSaving: boolean;
  items: KPISeriesReportValidationItem[];
  unitReport: UserKpiReport;
  nameMap: { [x: number]: TransString };
}

const initialState: SkipConfirmState = {
  isVisible: false,
  isSaving: false,
  items: [],
  unitReport: null!,
  nameMap: {},
};

handle
  .reducer(initialState)
  .replace(
    SkipConfirmActions.show,
    (state, { unitReport, items, nameMap }) => ({
      ...initialState,
      unitReport,
      items,
      nameMap,
      isVisible: true,
    })
  )
  .on(SkipConfirmActions.close, state => {
    state.isVisible = false;
  });
