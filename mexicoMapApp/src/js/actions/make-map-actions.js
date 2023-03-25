/**
 * Created by developercomputer on 07.01.16.
 */
export const RIGHT_DROP = 'RIGHT_DROP';
export const MAKE_MAP_OVER = "MAKE_MAP_OVER";

export const rightDrop = (item) => ({
  type: RIGHT_DROP,
  item
});

export const makeMapOver = () => ({
  type: MAKE_MAP_OVER
});