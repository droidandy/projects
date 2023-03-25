import React from 'react';
import { SidePanel } from 'src/components/SidePanel';
import { useTranslation } from 'react-i18next';
import { SkipConfirmSymbol } from '../symbol';
import { createModule, useActions } from 'typeless';
import { SaveButtonsWrapper } from 'src/components/SaveButtonsWrapper';
import { Button } from 'src/components/Button';
import { ReportValidationItem, TransString } from 'src/types-next';
import { DisplayTransString } from 'src/components/DisplayTransString';

export function SkipConfirmModal() {
  handle();
  const { t } = useTranslation();
  const { isVisible, items, nameMap } = getSkipConfirmState.useState();
  const { close, skip } = useActions(SkipConfirmActions);

  return (
    <SidePanel isOpen={isVisible} title={t('Confirm')} close={close}>
      <h3>
        {t('The following items need to be fixed, do you want to skip them?')}
      </h3>
      {items.map((group, i) => (
        <div key={i}>
          <h4>
            {group.status === 'MissingEvidence'
              ? t('Missing Evidence')
              : 'Missing Data Series'}
            :
          </h4>
          <ul>
            {group.items.map(id => (
              <li key={id}>
                <DisplayTransString value={nameMap[id]} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <SaveButtonsWrapper>
        <Button block onClick={close}>
          {t("Let's fix")}
        </Button>
        <Button block onClick={skip}>
          {t('Skip')}
        </Button>
      </SaveButtonsWrapper>
    </SidePanel>
  );
}
export const [handle, SkipConfirmActions, getSkipConfirmState] = createModule(
  SkipConfirmSymbol
)
  .withActions({
    show: (
      items: ReportValidationItem[],
      nameMap: { [x: number]: TransString }
    ) => ({ payload: { items, nameMap } }),
    close: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    skip: null,
  })
  .withState<SkipConfirmState>();

handle.epic().on(SkipConfirmActions.skip, () => {
  return [SkipConfirmActions.close()];
});

interface SkipConfirmState {
  isVisible: boolean;
  isSaving: boolean;
  items: ReportValidationItem[];
  nameMap: { [x: number]: TransString };
}

const initialState: SkipConfirmState = {
  isVisible: false,
  isSaving: false,
  items: [],
  nameMap: {},
};

handle
  .reducer(initialState)
  .replace(SkipConfirmActions.show, (state, { items, nameMap }) => ({
    ...initialState,
    items,
    nameMap,
    isVisible: true,
  }))
  .on(SkipConfirmActions.close, state => {
    state.isVisible = false;
  });
