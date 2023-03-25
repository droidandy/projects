import React from 'react';
import * as Rx from 'src/rx';
import { Modal } from 'src/components/Modal';
import { createModule, useActions } from 'typeless';
import { CreateScorecardSymbol, CreateScorecardFormSymbol } from '../symbol';
import { createForm } from 'typeless-form';
import { validateLangString, validateOption } from 'src/common/helper';
import { useTranslation } from 'react-i18next';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormInput } from 'src/components/ReduxInput';
import { FormItem } from 'src/components/FormItem';
import { createScorecard } from 'src/services/API-next';
import { getGlobalState } from 'src/features/global/interface';
import { catchErrorAndShowModal } from 'src/common/utils';
import { BalancedScorecard } from 'src/types-next';
import { FormSelect } from 'src/components/FormSelect';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useLanguage } from 'src/hooks/useLanguage';
import { SelectOption } from 'src/types';

export function CreateScorecardModal() {
  useCreateScorecardForm();
  useCreateScorecardModule();
  const { isVisible, isLoading } = getCreateScorecardState.useState();
  const { organizationUnits } = getGlobalState.useState();
  const { t } = useTranslation();
  const { close } = useActions(CreateScorecardActions);
  const { submit } = useActions(CreateScorecardFormActions);
  const lang = useLanguage();
  const unitIdOptions = (organizationUnits || []).map(unit => ({
    label: <DisplayTransString value={unit.name} />,
    value: unit.id,
    filterName: unit.name[lang],
  }));

  return (
    <Modal
      size="lg"
      isOpen={isVisible}
      title={t('Create Scorecard')}
      close={close}
    >
      <CreateScorecardFormProvider>
        <FormItem label="Name" required>
          <FormInput name="name" langSuffix />
        </FormItem>
        <FormItem label="Description" required>
          <FormInput name="description" langSuffix multiline />
        </FormItem>
        <FormItem label="Responsible Unit" required>
          <FormSelect name="unitId" options={unitIdOptions} />
        </FormItem>
        <SaveButtons onCancel={close} onSave={submit} isSaving={isLoading} />
      </CreateScorecardFormProvider>
    </Modal>
  );
}

export const [
  handle,
  CreateScorecardActions,
  getCreateScorecardState,
] = createModule(CreateScorecardSymbol)
  .withActions({
    show: null,
    close: null,
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    scorecardCreated: (scorecard: BalancedScorecard) => ({
      payload: { scorecard },
    }),
  })
  .withState<CreateScorecardState>();

const initialState = {
  isVisible: false,
  isLoading: false,
};

const useCreateScorecardModule = () => handle();

interface CreateScorecardState {
  isVisible: boolean;
  isLoading: boolean;
}

export interface CreateScorecardFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  unitId: SelectOption;
}

export const [
  useCreateScorecardForm,
  CreateScorecardFormActions,
  getCreateScorecardFormState,
  CreateScorecardFormProvider,
] = createForm<CreateScorecardFormValues>({
  symbol: CreateScorecardFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateOption(errors, values, 'unitId');
  },
});

handle
  .epic()
  .on(CreateScorecardActions.show, () => CreateScorecardFormActions.reset())
  .on(CreateScorecardFormActions.setSubmitSucceeded, () => {
    const { values } = getCreateScorecardFormState();
    const { currentPlanId } = getGlobalState();
    return Rx.concatObs(
      Rx.of(CreateScorecardActions.setLoading(true)),
      createScorecard({
        name: {
          en: values.name_en,
          ar: values.name_ar,
        },
        description: {
          en: values.description_en,
          ar: values.description_ar,
        },
        strategicPlanId: currentPlanId,
        unitId: values.unitId.value,
      }).pipe(
        Rx.mergeMap(scorecard => {
          return [
            CreateScorecardActions.scorecardCreated(scorecard),
            CreateScorecardActions.close(),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(CreateScorecardActions.setLoading(false))
    );
  });

handle
  .reducer(initialState)
  .on(CreateScorecardActions.show, state => {
    state.isVisible = true;
  })
  .on(CreateScorecardActions.close, state => {
    state.isVisible = false;
  })
  .on(CreateScorecardActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  });
