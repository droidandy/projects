import { useTranslation } from 'react-i18next';
import { createModule, useActions } from 'typeless';
import { ContainerSymbol, ContainerFormSymbol } from '../symbol';
import {
  validateLangString,
  validateNumber,
  validateMin,
  validateMax,
} from 'src/common/helper';
import { createForm } from 'typeless-form';
import React from 'react';
import * as R from 'remeda';
import { SaveButtons } from 'src/components/SaveButtons';
import { Modal } from 'src/components/Modal';
import { FormInput } from 'src/components/ReduxInput';
import { FormItem } from 'src/components/FormItem';
import { StrategicMapsActions } from '../interface';
import { AppStrategicMapGroup } from 'src/types-next';

export function ContainerModal() {
  useContainerForm();
  handle();
  const { isVisible, group } = getContainerState.useState();
  const { t } = useTranslation();
  const { close } = useActions(ContainerActions);
  const { submit } = useActions(ContainerFormActions);

  return (
    <Modal
      size="md"
      isOpen={isVisible}
      title={t(group ? 'Edit Container' : 'Add Container')}
      close={close}
    >
      <ContainerFormProvider>
        <FormItem label="Title" required>
          <FormInput name="title" langSuffix />
        </FormItem>
        <FormItem label="Columns" required>
          <FormInput name="columns" />
        </FormItem>
        <SaveButtons onCancel={close} onSave={submit} />
      </ContainerFormProvider>
    </Modal>
  );
}

interface ContainerState {
  isVisible: boolean;
  group: AppStrategicMapGroup | null;
}

export const [handle, ContainerActions, getContainerState] = createModule(
  ContainerSymbol
)
  .withActions({
    show: (group: AppStrategicMapGroup | null) => ({ payload: { group } }),
    close: null,
  })
  .withState<ContainerState>();

const initialState = {
  isVisible: false,
  group: null,
};

export interface ContainerFormValues {
  title_en: string;
  title_ar: string;
  columns: number;
}

export const [
  useContainerForm,
  ContainerFormActions,
  getContainerFormState,
  ContainerFormProvider,
] = createForm<ContainerFormValues>({
  symbol: ContainerFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'title');
    validateNumber(errors, values, 'columns');
    validateMin(errors, values, 'columns', 1);
    validateMax(errors, values, 'columns', 6);
  },
});

handle
  .epic()
  .on(ContainerActions.show, ({ group }) => {
    if (group) {
      return [
        ContainerFormActions.reset(),
        ContainerFormActions.changeMany({
          title_ar: group.name.ar,
          title_en: group.name.en,
          columns: group.columns.length,
        }),
      ];
    }
    return ContainerFormActions.reset();
  })
  .on(ContainerFormActions.setSubmitSucceeded, () => {
    const { group } = getContainerState();
    const { values } = getContainerFormState();
    const name = {
      ar: values.title_ar,
      en: values.title_en,
    };
    if (group) {
      const columns = Number(values.columns);
      const updatedGroup: AppStrategicMapGroup = {
        id: group.id,
        name,
        columns: R.range(0, columns).map(id => {
          const existing = group.columns[id];
          if (existing) {
            return {
              id: existing.id,
              items: [...existing.items],
            };
          }
          return {
            id: id + 1,
            items: [],
          };
        }),
      };
      const removedItems = R.flatMap(
        group.columns.slice(columns),
        x => x.items
      );
      if (removedItems.length) {
        const lastColumn = R.last(updatedGroup.columns);
        lastColumn.items.push(...removedItems);
      }
      return [
        StrategicMapsActions.groupUpdated(updatedGroup),
        ContainerActions.close(),
      ];
    } else {
      const newGroup: AppStrategicMapGroup = {
        id: -Date.now(),
        name,
        columns: R.range(0, Number(values.columns)).map(id => ({
          id: id + 1,
          items: [],
        })),
      };
      return [
        StrategicMapsActions.groupCreated(newGroup),
        ContainerActions.close(),
      ];
    }
  });

handle
  .reducer(initialState)
  .on(ContainerActions.show, (state, { group }) => {
    state.isVisible = true;
    state.group = group;
  })
  .on(ContainerActions.close, state => {
    state.isVisible = false;
  });
