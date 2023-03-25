import React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { StrategicMapsView } from './components/StrategicMapsView';
import {
  StrategicMapsActions,
  DesignerState,
  handle,
  getStrategicMapsState,
} from './interface';
import { getGlobalState } from '../global/interface';
import {
  getAllStrategicMap,
  createStrategicMap,
  updateStrategicMap,
  uploadFile,
} from 'src/services/API-next';
import { catchErrorAndShowModal, mapStrategicMap } from 'src/common/utils';
import { AppStrategicMapGroup, FileDocument } from 'src/types-next';

import {
  StrategicMapFormActions,
  getStrategicMapFormState,
} from './strategicMap-form';
import { DefaultStrategicMapColorMap } from 'src/const';
import { ConfigureActions } from './components/ConfigureModal';
import { AppStrategicMapImage } from 'shared/types';

// --- Epic ---
handle
  .epic()
  .on(StrategicMapsActions.$mounted, () => {
    return Rx.forkJoin(getAllStrategicMap()).pipe(
      Rx.map(([strategicMaps]) =>
        StrategicMapsActions.loaded(strategicMaps.map(mapStrategicMap))
      ),
      catchErrorAndShowModal()
    );
  })
  .on(StrategicMapsActions.edit, () => {
    const { selected } = getStrategicMapsState();
    return [
      StrategicMapFormActions.reset(),
      StrategicMapFormActions.changeMany({
        title_ar: selected!.title.ar,
        title_en: selected!.title.en,
      }),
    ];
  })
  .on(StrategicMapsActions.addNew, () => {
    return [StrategicMapFormActions.reset()];
  })
  .on(StrategicMapFormActions.setSubmitSucceeded, () => {
    const { currentPlanId, currentUnitId } = getGlobalState();
    const { values: formValues } = getStrategicMapFormState();
    const {
      groups,
      texts,
      images,
      isAddNew,
      selected,
    } = getStrategicMapsState();
    const mapId = (id: number) => {
      return id < 0 ? undefined : id;
    };
    const values = {
      unitId: currentUnitId,
      strategicPlanId: currentPlanId,
      title: {
        ar: formValues.title_ar,
        en: formValues.title_en,
      },
      strategicMapGroups: groups.map(group => ({
        id: mapId(group.id),
        title: group.name,
        columnsCount: group.columns.length,
        strategicMapItems: R.flatMap(group.columns, col =>
          col.items.map(item => ({
            columnNo: col.id,
            balancedScorecardItemId: Number(item.id.split('_')[1]),
          }))
        ),
      })),
      strategicMapImages: images.map(item => ({
        id: mapId(item.id),
        imageDocumentId: item.imageDocumentId,
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        angle: item.angle,
        scaleX: item.scaleX,
        scaleY: item.scaleY,
      })),
      strategicMapTexts: texts.map(item => ({
        id: mapId(item.id),
        text: item.text,
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        angle: item.angle,
        scaleX: item.scaleX,
        scaleY: item.scaleY,
      })),
    };
    return Rx.concatObs(
      Rx.of(StrategicMapsActions.setIsSaving(true)),
      Rx.defer(() => {
        if (isAddNew) {
          return createStrategicMap(values);
        } else {
          return updateStrategicMap(selected!.id, {
            ...values,
          });
        }
      }).pipe(
        Rx.mergeMap(item => [
          isAddNew
            ? StrategicMapsActions.created(mapStrategicMap(item))
            : StrategicMapsActions.updated(mapStrategicMap(item)),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(StrategicMapsActions.setIsSaving(false))
    );
  })
  .on(StrategicMapsActions.uploadDocument, (file: File) => {
    return Rx.concatObs(
      Rx.of(StrategicMapsActions.setIsSaving(true)),
      Rx.defer(() => {
        return uploadFile(file);
      }).pipe(
        Rx.mergeMap((result: FileDocument) => {
          const newImage: AppStrategicMapImage = {
            id: new Date().getTime(),
            imageDocumentId: result.id,
            imageDocument: result,
            left: 50,
            top: 50,
            width: 200,
            height: 70,
            angle: 0,
            scaleX: 1,
            scaleY: 1,
          };
          return [StrategicMapsActions.imageItemCreated(newImage)];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(StrategicMapsActions.setIsSaving(false))
    );
  });

// --- Reducer ---
const initialState: DesignerState = {
  isLoaded: false,
  isSaving: false,
  groups: [],
  strategicMaps: [],
  texts: [],
  images: [],
  selected: null,
  isEditMode: false,
  isAddNew: false,
  colors: DefaultStrategicMapColorMap,
};

handle
  .reducer(initialState)
  .replace(StrategicMapsActions.$init, () => initialState)
  .on(StrategicMapsActions.loaded, (state, { strategicMaps }) => {
    state.isLoaded = true;
    state.strategicMaps = strategicMaps;
    if (strategicMaps.length) {
      const strategicMap = strategicMaps[0];
      state.selected = strategicMap;
      state.groups = strategicMap.groups;
      state.texts = strategicMap.texts || [];
      state.images = strategicMap.images || [];
    } else {
      state.isAddNew = true;
      state.isEditMode = true;
    }
  })
  .on(StrategicMapsActions.groupCreated, (state, { group }) => {
    state.groups.push(group);
  })
  .on(StrategicMapsActions.groupUpdated, (state, { group }) => {
    state.groups = state.groups.map(item =>
      item.id === group.id ? group : item
    );
  })
  .on(StrategicMapsActions.addNewItem, (state, { id, name }) => {
    state.groups[0]?.columns[0]?.items.unshift({
      id,
      name,
    });
  })
  .on(StrategicMapsActions.moveItem, (state, { fromId, toId, index }) => {
    const item = removeItem(state.groups, fromId);
    const move = () => {
      for (const group of state.groups) {
        for (const column of group.columns) {
          for (const target of column.items) {
            if (target.id === toId) {
              column.items.splice(index, 0, item);
              return;
            }
          }
        }
      }
    };
    move();
  })
  .on(StrategicMapsActions.moveToColumn, (state, { id, groupId, columnId }) => {
    const item = removeItem(state.groups, id);
    const group = state.groups.find(x => x.id === groupId)!;
    const column = group.columns.find(x => x.id === columnId)!;
    column.items.push(item);
  })
  .on(StrategicMapsActions.moveGroup, (state, { fromIndex, toIndex }) => {
    const group = state.groups[fromIndex];
    state.groups.splice(fromIndex, 1);
    state.groups.splice(toIndex, 0, group);
  })
  .on(StrategicMapsActions.selectStrategicMap, (state, { selected }) => {
    state.selected = selected;
    state.groups = selected.groups;
    state.texts = selected.texts;
    state.images = selected.images;
    state.isAddNew = false;
    state.isEditMode = false;
  })
  .on(StrategicMapsActions.edit, state => {
    state.isEditMode = true;
  })
  .on(StrategicMapsActions.created, (state, { strategicMap }) => {
    state.strategicMaps.push(strategicMap);
    state.selected = strategicMap;
    state.isAddNew = false;
    state.isEditMode = false;
  })
  .on(StrategicMapsActions.updated, (state, { strategicMap }) => {
    state.strategicMaps = state.strategicMaps.map(item =>
      item.id === strategicMap.id ? strategicMap : item
    );
    state.selected = strategicMap;
    state.isEditMode = false;
  })
  .on(StrategicMapsActions.cancel, state => {
    state.groups = state.selected!.groups;
    state.texts = state.selected!.texts || [];
    state.isEditMode = false;
  })
  .on(StrategicMapsActions.addNew, state => {
    state.isAddNew = true;
    state.isEditMode = true;
    state.groups = [];
    state.texts = [];
    state.images = [];
  })
  .on(StrategicMapsActions.setIsSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(StrategicMapsActions.textItemCreated, (state, { item }) => {
    state.texts.push(item);
  })
  .on(StrategicMapsActions.textItemUpdated, (state, { item }) => {
    state.texts = state.texts.map(x => (x.id === item.id ? item : x));
  })
  .on(StrategicMapsActions.imageItemCreated, (state, { item }) => {
    state.images.push(item);
  })
  .on(StrategicMapsActions.moveFreeItem, (state, { type, id, left, top }) => {
    if (type === 'image') {
      state.images.forEach(item => {
        if (item.id === id) {
          item.left = left;
          item.top = top;
        }
      });
    } else {
      state.texts.forEach(item => {
        if (item.id === id) {
          item.left = left;
          item.top = top;
        }
      });
    }
  })
  .on(StrategicMapsActions.updateFreeItemSize, (state, { type, item }) => {
    if (type === 'image') {
      state.images = state.images.map(current =>
        current.id === item.id
          ? {
              ...current,
              ...item,
            }
          : current
      );
    } else {
      state.texts = state.texts.map(current =>
        current.id === item.id
          ? {
              ...current,
              ...item,
            }
          : current
      );
    }
  })
  .on(StrategicMapsActions.removeText, (state, { id }) => {
    state.texts = state.texts.filter(x => x.id !== id);
  })
  .on(StrategicMapsActions.removeImage, (state, { id }) => {
    state.images = state.images.filter(x => x.id !== id);
  })
  .on(StrategicMapsActions.removeGroup, (state, { id }) => {
    state.groups = state.groups.filter(x => x.id !== id);
  })
  .on(StrategicMapsActions.removeItem, (state, { itemId }) => {
    state.groups.forEach(group => {
      group.columns.forEach(col => {
        col.items.forEach((item, i) => {
          if (item.id === itemId) {
            col.items.splice(i, 1);
          }
        });
      });
    });
  })
  .on(ConfigureActions.updated, (state, { colors }) => {
    state.colors = colors;
  });

function removeItem(groups: AppStrategicMapGroup[], id: string) {
  for (const group of groups) {
    for (const column of group.columns) {
      for (let i = 0; i < column.items.length; i++) {
        const item = column.items[i];
        if (item.id === id) {
          column.items.splice(i, 1);
          return item;
        }
      }
    }
  }
  throw new Error('Item not found ' + id);
}

// --- Module ---
export default () => {
  handle();
  return <StrategicMapsView />;
};
