// TODO: FIX TYPINGS
import React from 'react';
import * as Rx from 'src/rx';
import { OrganizationStructureView } from './components/OrganizationStructureView';
import {
  OrganizationStructureActions,
  OrganizationStructureState,
  handle,
  getOrganizationStructureState,
} from './interface';

import { getGlobalState, GlobalActions } from 'src/features/global/interface';

import {
  catchErrorAndShowModal,
  createOrganizationStructureFromUnit,
} from 'src/common/utils';
import {
  useOrganizationForm,
  OrganizationFormActions,
  getOrganizationFormState,
} from './organization-form';

import {
  getAllOrganizationUnit,
  createOrganizationUnit,
  updateOrganizationUnit,
  deleteOrganizationUnit,
} from 'src/services/API-next';
import { OrganizationUnit } from 'src/types-next';

// --- Epic ---
handle
  .epic()
  .on(OrganizationStructureActions.$mounted, () =>
    Rx.of(OrganizationStructureActions.load())
  )
  .on(OrganizationStructureActions.load, () => {
    const { organizationId } = getGlobalState();

    return Rx.concatObs(
      getAllOrganizationUnit(organizationId)
        .pipe(
          Rx.mergeMap(ret => {
            const tree = createOrganizationStructureFromUnit(ret);

            return [
              OrganizationStructureActions.loaded(tree),
              GlobalActions.loadOrganizationUnits(ret),
            ];
          })
        )
        .pipe(catchErrorAndShowModal())
    );
  })
  .on(OrganizationStructureActions.showForm, ({ item }) => {
    const actions = [OrganizationFormActions.reset()];
    if (item) {
      actions.push(
        OrganizationFormActions.changeMany({
          name_ar: item.name.ar,
          name_en: item.name.en,
          description_ar: item.description.ar,
          description_en: item.description.en,
        })
      );
    }
    return actions;
  })
  .on(OrganizationFormActions.setSubmitSucceeded, () => {
    const { values } = getOrganizationFormState();
    const { formEditItem } = getOrganizationStructureState();

    return [
      formEditItem
        ? OrganizationStructureActions.updateItem({
            ...formEditItem,
            name: {
              ar: values.name_ar,
              en: values.name_en,
            },
            description: {
              ar: values.description_ar,
              en: values.description_en,
            },
          })
        : OrganizationStructureActions.addItem({
            name: {
              ar: values.name_ar,
              en: values.name_en,
            },
            description: {
              ar: values.description_ar,
              en: values.description_en,
            },
            type: 'Division',
          }),
    ];
  })
  .on(OrganizationStructureActions.updateItem, ({ item, prevStateItems }) => {
    return Rx.concatObs(
      Rx.of(OrganizationStructureActions.setSaving(true)),
      updateOrganizationUnit(item.id!, item).pipe(
        Rx.mergeMap(() => {
          return [
            OrganizationStructureActions.load(),
            GlobalActions.showNotification(
              'success',
              'Organization unit updated successfully'
            ),
          ];
        }),
        Rx.catchLog((e: any) => {
          const message = (e.response && e.response.Message) || e.message;

          return Rx.of(
            GlobalActions.showNotification('error', message),
            OrganizationStructureActions.returnPrevItems(prevStateItems!)
          );
        })
      ),
      Rx.of(OrganizationStructureActions.setSaving(false)),
      Rx.of(OrganizationStructureActions.hideForm())
    );
  })
  .on(OrganizationStructureActions.addItem, ({ item }) => {
    const { organizationId } = getGlobalState();
    const itemWithOrganizationId = { ...item, organizationId };
    return Rx.concatObs(
      Rx.of(OrganizationStructureActions.setSaving(true)),
      createOrganizationUnit(itemWithOrganizationId).pipe(
        Rx.mergeMap(() => {
          return [
            OrganizationStructureActions.load(),
            GlobalActions.showNotification(
              'success',
              'Organization unit created successfully'
            ),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(OrganizationStructureActions.setSaving(false)),
      Rx.of(OrganizationStructureActions.hideForm())
    );
  })
  .on(OrganizationStructureActions.removeItem, ({ item }) => {
    const replaceParentId = (childItem: OrganizationUnit) =>
      updateOrganizationUnit(childItem.id, {
        ...childItem,
        parentId: item.parentId,
        children: [],
      });

    const children = Rx.of((item as any).children);

    return Rx.concatObs(
      children.pipe(Rx.mergeMap(q => Rx.forkJoin(...q.map(replaceParentId)))),
      deleteOrganizationUnit(item.id).pipe(
        Rx.mergeMap(() => {
          return [
            OrganizationStructureActions.load(),
            GlobalActions.showNotification(
              'success',
              'Organization unit deleted successfully'
            ),
          ];
        }),
        catchErrorAndShowModal()
      )
    );
  });

// --- Reducer ---
const initialState: OrganizationStructureState = {
  isLoading: true,
  isSaving: false,
  items: null,
  isFormVisible: false,
  formEditItem: null,
};

handle
  .reducer(initialState)
  .replace(OrganizationStructureActions.$init, () => initialState)
  .on(OrganizationStructureActions.loaded, (state, { items }) => {
    state.items = items;
    state.isLoading = false;
  })
  .on(OrganizationStructureActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(OrganizationStructureActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(OrganizationStructureActions.update, (state, { items }) => {
    state.items = items;
  })
  .on(OrganizationStructureActions.showForm, (state, { item }) => {
    state.isFormVisible = true;
    state.formEditItem = item;
  })
  .on(OrganizationStructureActions.hideForm, state => {
    state.isFormVisible = false;
  })
  .on(OrganizationStructureActions.returnPrevItems, (state, items) => {
    state.items = items;
  });

// --- Module ---
export default () => {
  useOrganizationForm();
  handle();
  return <OrganizationStructureView />;
};
