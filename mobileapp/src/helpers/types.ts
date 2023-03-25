import { ReactElement, ReactFragment, ReactPortal } from 'react';

export interface Dictionary<T> {
  [key: string]: T;
}

export type ReactValidNode = ReactElement | ReactFragment | ReactPortal | string | null;
