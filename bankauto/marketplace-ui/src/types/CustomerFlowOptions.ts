import { FC, SVGProps } from 'react';

export interface CustomerFlowOptions {
  id: number;
  icon: FC<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
  showArrow: boolean;
}
