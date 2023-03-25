import * as Rx from 'src/rx';
import {
  ExcellenceRequirement,
  ExcellenceCriteria,
  ExcellenceTheme,
  ExcellenceRequirementStatus,
} from 'src/types-next';
import { createModule, useActions } from 'typeless';
import {
  ExcellenceDetailsSymbol,
  ExcellenceDetailsFormSymbol,
} from '../symbol';
import React from 'react';
import { Modal } from 'src/components/Modal';
import { useTranslation } from 'react-i18next';
import {
  getAllExcellenceTheme,
  searchExcellenceCriteria,
} from 'src/services/API-next';
import {
  catchErrorAndShowModal,
  getSelectOption,
  dateToInputFormat,
  convertToOption,
} from 'src/common/utils';
import { createForm } from 'typeless-form';
import { validateLangString, validateOption } from 'src/common/helper';
import { SelectOption } from 'src/types';
import { Row, Col } from 'src/components/Grid';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { booleanOptions, requirementStatusOptions } from 'src/common/options';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import styled from 'styled-components';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { saveExcellence } from '../save';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { ExcellenceActions } from '../interface';

const Buttons = styled.div`
  margin-top: 20px;
`;

export function ExcellenceModal() {
  handle();
  useExcellenceDetailsForm();
  const {
    isVisible,
    isAdding,
    isEditing,
    isSaving,
    criteria,
    themes,
  } = getExcellenceDetailsState.useState();
  const { organizationUnits } = getGlobalState.useState();
  const { save, close } = useActions(ExcellenceDetailsActions);
  const { t } = useTranslation();
  const responsibleUnitOptions = useSelectOptions(organizationUnits);
  const criteriaOptions = useSelectOptions(criteria);
  const themeOptions = useSelectOptions(themes);
  return (
    <Modal
      size="lg"
      isOpen={isVisible}
      title={t(
        isAdding
          ? 'Add Excellence'
          : isEditing
          ? 'Edit Excellence'
          : 'View Excellence'
      )}
      close={close}
    >
      <ExcellenceFormProvider>
        <Row>
          <Col>
            <FormItem label="Name" required={isEditing}>
              <FormInput name="name" langSuffix readOnlyText={!isEditing} />
            </FormItem>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Is Completed" required={isEditing}>
              <FormSelect
                name="isCompleted"
                options={booleanOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Is Active" required={isEditing}>
              <FormSelect
                name="isActive"
                options={booleanOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="Description" required={isEditing}>
          <FormInput
            multiline
            name="description"
            langSuffix
            readOnlyText={!isEditing}
          />
        </FormItem>
        <Row>
          <Col>
            <FormItem label="Start date" required={isEditing}>
              <FormInput
                name="startDate"
                type="date"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Start end" required={isEditing}>
              <FormInput name="endDate" type="date" readOnlyText={!isEditing} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Requirement Status" required={isEditing}>
              <FormSelect
                name="requirementStatus"
                options={requirementStatusOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Responsible Unit" required={isEditing}>
              <FormSelect
                name="responsibleUnit"
                options={responsibleUnitOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Excellence Criteria" required={isEditing}>
              <FormSelect
                name="criteria"
                options={criteriaOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Owner Unit" required={isEditing}>
              <FormSelect
                name="ownerUnit"
                options={responsibleUnitOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Excellence Theme" required={isEditing}>
              <FormSelect
                name="theme"
                options={themeOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col></Col>
        </Row>
        {isEditing && (
          <Buttons>
            <SaveButtonsNext
              isSaving={isSaving}
              save={save}
              cancelAdd={close}
            />
          </Buttons>
        )}
      </ExcellenceFormProvider>
    </Modal>
  );
}

export const [
  handle,
  ExcellenceDetailsActions,
  getExcellenceDetailsState,
] = createModule(ExcellenceDetailsSymbol)
  .withActions({
    show: (
      type: 'view' | 'add' | 'edit',
      excellence?: ExcellenceRequirement
    ) => ({ payload: { type, excellence } }),
    close: null,
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    loaded: (criteria: ExcellenceCriteria[], themes: ExcellenceTheme[]) => ({
      payload: {
        criteria,
        themes,
      },
    }),
    save: (draft: boolean) => ({ payload: { draft } }),
  })
  .withState<ExcellenceDetailsState>();

interface ExcellenceDetailsState {
  isVisible: boolean;
  isLoading: boolean;
  isEditing: boolean;
  isAdding: boolean;
  isSaving: boolean;
  excellence: ExcellenceRequirement | null;
  criteria: ExcellenceCriteria[];
  themes: ExcellenceTheme[];
}

const initialState: ExcellenceDetailsState = {
  isVisible: false,
  isLoading: false,
  isEditing: false,
  isAdding: false,
  isSaving: false,
  excellence: null,
  criteria: [],
  themes: [],
};

handle
  .epic()
  .on(ExcellenceDetailsActions.show, ({ excellence }) =>
    Rx.concatObs(
      Rx.of(ExcellenceDetailsActions.setLoading(true)),
      Rx.forkJoin([
        searchExcellenceCriteria({
          pageSize: 1e5,
          hasParent: true,
        }).pipe(Rx.map(x => x.items)),
        getAllExcellenceTheme(),
      ]).pipe(
        Rx.mergeMap(([criteria, themes]) => {
          const actions = [
            ExcellenceFormActions.reset(),
            ExcellenceDetailsActions.loaded(criteria, themes),
          ];
          if (excellence) {
            actions.push(
              ExcellenceFormActions.changeMany({
                name_en: excellence.name.en,
                name_ar: excellence.name.ar,
                description_en:
                  excellence.description && excellence.description.en,
                description_ar:
                  excellence.description && excellence.description.ar,
                isCompleted: getSelectOption(
                  booleanOptions,
                  excellence.isCompleted
                )!,
                isActive: getSelectOption(
                  booleanOptions,
                  excellence.isCompleted
                )!,
                requirementStatus: getSelectOption(
                  requirementStatusOptions,
                  excellence.requirementStatus
                )!,
                startDate: dateToInputFormat(excellence.startDate),
                endDate: dateToInputFormat(excellence.endDate),
                criteria: convertToOption(excellence.excellenceCriteria)!,
                theme: convertToOption(excellence.excellenceTheme)!,
                responsibleUnit: convertToOption(excellence.responsibleUnit)!,
                ownerUnit: convertToOption(excellence.ownerUnit!)!,
              })
            );
          }

          return actions;
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(ExcellenceDetailsActions.setLoading(false))
    )
  )
  .on(ExcellenceDetailsActions.save, ({ draft }, { action$ }) => {
    const { isAdding } = getExcellenceDetailsState();
    return Rx.concatObs(
      Rx.of(ExcellenceFormActions.submit()),
      action$.pipe(
        Rx.waitForType(ExcellenceFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(ExcellenceDetailsActions.setSaving(true)),
            saveExcellence(draft).pipe(
              Rx.mergeMap(resource => {
                return [
                  ExcellenceActions.load(),
                  ExcellenceDetailsActions.close(),
                  GlobalActions.showNotification(
                    'success',
                    isAdding ? 'Saved successfully' : 'Updated successfully'
                  ),
                ];
              }),
              catchErrorAndShowModal()
            ),
            Rx.of(ExcellenceDetailsActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(ExcellenceFormActions.setSubmitFailed))
        )
      )
    );
  });

handle
  .reducer(initialState)
  .replace(ExcellenceDetailsActions.show, (state, { excellence, type }) => ({
    ...initialState,
    isVisible: true,
    isAdding: type === 'add',
    isEditing: type !== 'view',
    excellence: excellence || null,
  }))
  .on(ExcellenceDetailsActions.close, state => {
    state.isVisible = false;
  })
  .on(ExcellenceDetailsActions.loaded, (state, { criteria, themes }) => {
    state.criteria = criteria;
    state.themes = themes;
  })
  .on(ExcellenceDetailsActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ExcellenceDetailsActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

export interface ExcellenceFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  isCompleted: SelectOption<boolean>;
  isActive: SelectOption<boolean>;
  requirementStatus: SelectOption<ExcellenceRequirementStatus>;
  responsibleUnit: SelectOption;
  ownerUnit: SelectOption;
  startDate: string;
  endDate: string;
  criteria: SelectOption;
  theme: SelectOption;
}

export const [
  useExcellenceDetailsForm,
  ExcellenceFormActions,
  getExcellenceFormState,
  ExcellenceFormProvider,
] = createForm<ExcellenceFormValues>({
  symbol: ExcellenceDetailsFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateOption(errors, values, 'isCompleted');
    validateOption(errors, values, 'isActive');
    validateOption(errors, values, 'requirementStatus');
    validateOption(errors, values, 'criteria');
    validateOption(errors, values, 'theme');
    validateOption(errors, values, 'responsibleUnit');
    validateOption(errors, values, 'ownerUnit');

    if (!errors.isActive && !errors.requirementStatus) {
      if (values.isActive.value && values.requirementStatus.value !== 'Exist') {
        errors.isActive = 'You cannot set Active if Exist is not true';
      }
    }

    if (!errors.isCompleted && !errors.isActive) {
      if (values.isCompleted.value && !values.isActive.value) {
        errors.isCompleted = 'You cannot set completed if Active not true';
      }
    }
  },
});
