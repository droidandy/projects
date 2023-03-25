import { createTypes } from 'redux-compose-reducer';

export const AVAILABLE_MAP_SCENES = {
  orderCreating: 'ORDER_CREATING',
  activeOrder: 'ACTIVE_ORDER',
  completedOrder: 'COMPLETED_ORDER'
};

const TYPES = createTypes('ui/navigation', [
  'changeMapScene',
  'clearNavigation'
]);

const changeMapScene = activeScene => ({ type: TYPES.changeMapScene, activeScene });

export const goToOrderCreatingScene = () => (changeMapScene(AVAILABLE_MAP_SCENES.orderCreating));

export const goToActiveOrderScene = () => (changeMapScene(AVAILABLE_MAP_SCENES.activeOrder));

export const goToCompletedOrderScene = () => (changeMapScene(AVAILABLE_MAP_SCENES.completedOrder));

export const clearNavigation = () => ({ type: TYPES.clearNavigation });
