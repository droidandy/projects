export type SwiperIndicator = 'none' | 'bottom' | 'top';
export type SwiperStyleName = 'default' | 'light' | 'base';

export interface IVSwiperBarPropsBase {
  itemsCount: number;
  activeIndex: number;
  pageSize: number;
}
