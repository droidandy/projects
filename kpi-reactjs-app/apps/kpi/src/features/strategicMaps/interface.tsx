import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, DragHandleType } from 'src/types';
import { createModule } from 'typeless';
import { StrategicMapsSymbol } from './symbol';
import {
  TransString,
  TreeItemData,
  AppStrategicMapGroup,
  AppStrategicMap,
  BalancedScorecardItem,
  AppStrategicMapText,
  AppStrategicMapImage,
  BaseDraggableItem,
  AppStrategicMapColors,
} from 'src/types-next';

// --- Actions ---
export const [
  handle,
  StrategicMapsActions,
  getStrategicMapsState,
] = createModule(StrategicMapsSymbol)
  .withActions({
    $init: null,
    $mounted: null,
    loaded: (strategicMaps: AppStrategicMap[]) => ({
      payload: { strategicMaps },
    }),
    removeGroup: (id: number) => ({ payload: { id } }),
    addToGroup: (item: TreeItemData, groupId: number) => ({
      payload: {
        item,
        groupId,
      },
    }),
    moveToGroup: (itemId: string, groupId: number) => ({
      payload: {
        itemId,
        groupId,
      },
    }),
    removeItem: (itemId: string) => ({
      payload: {
        itemId,
      },
    }),
    groupCreated: (group: AppStrategicMapGroup) => ({ payload: { group } }),
    groupUpdated: (group: AppStrategicMapGroup) => ({ payload: { group } }),
    addNewItem: (id: string, name: TransString) => ({ payload: { id, name } }),
    moveItem: (fromId: string, toId: string, index: number) => ({
      payload: {
        fromId,
        toId,
        index,
      },
    }),
    moveToColumn: (id: string, groupId: number, columnId: number) => ({
      payload: {
        id,
        groupId,
        columnId,
      },
    }),
    moveGroup: (fromIndex: number, toIndex: number) => ({
      payload: { fromIndex, toIndex },
    }),
    selectStrategicMap: (selected: AppStrategicMap) => ({
      payload: { selected },
    }),
    cancel: null,
    edit: null,
    addNew: null,
    setIsSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    created: (strategicMap: AppStrategicMap) => ({ payload: { strategicMap } }),
    updated: (strategicMap: AppStrategicMap) => ({ payload: { strategicMap } }),
    scorecardItemCreated: (item: BalancedScorecardItem) => ({
      payload: { item },
    }),
    textItemCreated: (item: AppStrategicMapText) => ({
      payload: { item },
    }),
    textItemUpdated: (item: AppStrategicMapText) => ({
      payload: { item },
    }),
    imageItemCreated: (item: AppStrategicMapImage) => ({
      payload: { item },
    }),
    moveFreeItem: (
      type: DraggableType,
      id: number,
      left: number,
      top: number
    ) => ({
      payload: {
        type,
        id,
        left,
        top,
      },
    }),
    updateFreeItemSize: (type: DraggableType, item: BaseDraggableItem) => ({
      payload: { type, item },
    }),
    removeText: (id: number) => ({ payload: { id } }),
    removeImage: (id: number) => ({ payload: { id } }),
    uploadDocument: (file: File) => ({ payload: file }),
  })
  .withState<DesignerState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const StrategicMapsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/strategic-maps',
  component: <StrategicMapsRoute />,
};

// --- Types ---
export interface DesignerState {
  isLoaded: boolean;
  isSaving: boolean;
  groups: AppStrategicMapGroup[];
  texts: AppStrategicMapText[];
  images: AppStrategicMapImage[];
  strategicMaps: AppStrategicMap[];
  selected: AppStrategicMap | null;
  isEditMode: boolean;
  isAddNew: boolean;
  colors: AppStrategicMapColors;
}

export const ItemTypes = {
  item: 'item',
  group: 'group',
  text: 'text',
  handle: 'handle',
  image: 'image',
} as const;

export interface HandleDragItem<T> {
  target: T;
  type: 'handle';
  dragType: DragHandleType;
}

export type DraggableItems = TextDragItem | ImageDragItem;

export type StrategicMapItem = AppStrategicMapText | AppStrategicMapImage;

export interface TextDragItem extends AppStrategicMapText {
  type: 'text';
}

export interface ImageDragItem extends AppStrategicMapImage {
  type: 'image';
}

export type DraggableType = 'text' | 'image';
