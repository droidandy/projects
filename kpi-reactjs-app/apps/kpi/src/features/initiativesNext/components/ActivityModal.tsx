import * as R from 'remeda';
import * as Rx from 'src/rx';
import { createModule, useActions } from 'typeless';
import { ActivitySymbol } from '../symbol';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  isNullOrEmpty,
  catchErrorAndShowModal,
  dateToInputFormat,
} from 'src/common/utils';
import { SaveButtons } from 'src/components/SaveButtons';
import { SidePanel } from 'src/components/SidePanel';
import { Initiative, InitiativeItemType } from 'src/types-next';
import { SectionTitle } from 'src/components/SectionTitle';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { SkillForm } from './SkillForm';
import { SkillsTable } from './SkillsTable';
import {
  useActivityForm,
  ActivityFormActions,
  ActivityFormProvider,
  getActivityFormState,
} from '../activity-form';
import { getInitiativesState } from '../interface';
import {
  getInitiativeById,
  updateInitiative,
  createInitiative,
  createInitiativeSkill,
  deleteInitiativeSkill,
} from '../../../services/API-next';
import { DetailsSkeleton } from '../../../components/DetailsSkeleton';
import { getGlobalState } from '../../global/interface';

export function ActivityModal() {
  handle();
  useActivityForm();
  const {
    isVisible,
    isLoading,
    isSaving,
    activity,
  } = getActivityState.useState();
  const { close } = useActions(ActivityActions);
  const { submit } = useActions(ActivityFormActions);
  const { t } = useTranslation();
  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <ActivityFormProvider>
        <SectionTitle>{t('Basic Info')}:</SectionTitle>

        <FormItem label="Name" required>
          <FormInput name="name" langSuffix />
        </FormItem>
        <FormItem label="Description" required>
          <FormInput multiline name="description" langSuffix />
        </FormItem>
        <FormItem label="Start Date" required>
          <FormInput name="startDate" type="date" />
        </FormItem>
        <FormItem label="End Date" required>
          <FormInput name="endDate" type="date" />
        </FormItem>
        <FormItem label="Budget">
          <FormInput name="budget" />
        </FormItem>
        <SkillForm />
        <SkillsTable />
        <SaveButtons onCancel={close} onSave={submit} isSaving={isSaving} />
      </ActivityFormProvider>
    );
  };
  return (
    <SidePanel
      isOpen={isVisible}
      title={t(activity || isLoading ? 'Edit Activity' : 'Add Activity')}
      close={close}
    >
      {renderDetails()}
    </SidePanel>
  );
}

export const [handle, ActivityActions, getActivityState] = createModule(
  ActivitySymbol
)
  .withActions({
    showById: (id: number) => ({ payload: { id } }),
    show: (activity: Initiative | null) => ({
      payload: { activity },
    }),
    loaded: (activity: Initiative) => ({
      payload: { activity },
    }),
    close: null,
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    activityCreated: (activity: Initiative) => ({
      payload: { activity },
    }),
    activityUpdated: (activity: Initiative) => ({
      payload: { activity },
    }),
    activityDeleted: (activity: Initiative) => ({
      payload: { activity },
    }),
  })
  .withState<ActivityState>();

interface ActivityState {
  isVisible: boolean;
  isLoading: boolean;
  isSaving: boolean;
  activity: Initiative | null;
}

const initialState: ActivityState = {
  isVisible: false,
  isLoading: false,
  isSaving: false,
  activity: null,
};

const getFormActions = (activity: Initiative | null) => {
  if (!activity) {
    return [ActivityFormActions.reset()];
  } else {
    return [
      ActivityFormActions.reset(),
      ActivityFormActions.changeMany({
        name_en: activity.name.en,
        name_ar: activity.name.ar,
        description_en: activity.description.en,
        description_ar: activity.description.ar,
        startDate: dateToInputFormat(activity.startDate),
        endDate: dateToInputFormat(activity.endDate),
        budget: activity.budget,
        skills: activity.initiativeSkills.map(x => x.skillId),
      }),
    ];
  }
};

handle
  .epic()
  .on(ActivityActions.showById, ({ id }) => {
    return Rx.concatObs(
      Rx.of(ActivityActions.setLoading(true)),
      getInitiativeById(id).pipe(
        Rx.mergeMap(activity => [
          ActivityActions.loaded(activity),
          ...getFormActions(activity),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(ActivityActions.setLoading(false))
    );
  })
  .on(ActivityActions.show, ({ activity }) => {
    return getFormActions(activity);
  })
  .on(ActivityFormActions.setSubmitSucceeded, () => {
    const { isEditing } = getInitiativesState();
    const { skills, initiativeId } = getInitiativesState();
    const { currentUnitId, currentPlanId } = getGlobalState();
    const skillMap = R.indexBy(skills, x => x.id);
    const { values: formValues } = getActivityFormState();
    const { activity } = getActivityState();
    const existingSkillMap = activity
      ? R.indexBy(activity.initiativeSkills, x => x.skillId)
      : {};
    const id = activity ? activity.id : -Date.now();
    const skillIds = formValues.skills || [];
    const values = {
      id,
      unitId: currentUnitId,
      strategicPlanId: currentPlanId,
      typeId: InitiativeItemType.Activity,
      name: {
        en: formValues.name_en,
        ar: formValues.name_ar,
      },
      description: {
        en: formValues.description_en,
        ar: formValues.description_ar,
      },
      parentId: initiativeId,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      initiativeSkills: skillIds.map(skillId => {
        const existingSkill = existingSkillMap[skillId];
        return (
          existingSkill || {
            id: -1,
            initiativeItemId: id,
            skillId,
            skill: skillMap[skillId],
          }
        );
      }),
      budget: isNullOrEmpty(formValues.budget)
        ? null
        : Number(formValues.budget),
    } as Initiative;

    if (isEditing) {
      return [
        activity
          ? ActivityActions.activityUpdated(values)
          : ActivityActions.activityCreated(values),
        ActivityActions.close(),
      ];
    } else {
      if (values.id < 0) {
        delete values.id;
      }
      values.initiativeSkills.forEach(skill => {
        delete skill.skill;
        if (skill.id < 0) {
          delete skill.id;
        }
        if (skill.initiativeItemId < 0) {
          delete skill.initiativeItemId;
        }
      });
      return Rx.concatObs(
        Rx.of(ActivityActions.setSaving(true)),
        Rx.defer(() => {
          if (activity) {
            const existingIds = activity.initiativeSkills.map(x => x.skillId);
            const initiativeSkillMap = R.indexBy(
              activity.initiativeSkills,
              x => x.skillId
            );
            const added = R.difference(skillIds, existingIds);
            const removed = R.difference(existingIds, skillIds);
            return Rx.forkJoin([
              Rx.from(added).pipe(
                Rx.mergeMap(skillId => {
                  return createInitiativeSkill({
                    skillId,
                    initiativeItemId: activity.id,
                  });
                }),
                Rx.toArray()
              ),
              Rx.from(removed).pipe(
                Rx.mergeMap(skillId => {
                  const skill = initiativeSkillMap[skillId];
                  return deleteInitiativeSkill(skill.id);
                }),
                Rx.toArray()
              ),
            ]).pipe(
              Rx.mergeMap(() =>
                updateInitiative(activity.id, {
                  ...values,
                  initiativeSkills: undefined,
                })
              )
            );
          } else {
            return createInitiative(values);
          }
        }).pipe(
          Rx.mergeMap(created => [
            values.id
              ? ActivityActions.activityUpdated(created)
              : ActivityActions.activityCreated(created),
            ActivityActions.close(),
          ]),
          catchErrorAndShowModal()
        ),
        Rx.of(ActivityActions.setSaving(false))
      );
    }
  });

handle
  .reducer(initialState)
  .replace(ActivityActions.show, (state, { activity }) => ({
    ...initialState,
    isVisible: true,
    activity,
  }))
  .replace(ActivityActions.showById, state => ({
    ...initialState,
    isVisible: true,
  }))
  .on(ActivityActions.loaded, (state, { activity }) => {
    state.activity = activity;
  })
  .on(ActivityActions.close, state => {
    state.isVisible = false;
  })
  .on(ActivityActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ActivityActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });
