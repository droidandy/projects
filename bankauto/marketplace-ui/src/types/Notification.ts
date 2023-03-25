import { ReactNode } from 'react';
import { AlertProps } from '@material-ui/lab/Alert';

export interface Notification {
  message: ReactNode;
  props?: Omit<AlertProps, 'children' | 'color' | 'variant'>;
}

export interface NotificationItem extends Notification {
  id: string;
}
