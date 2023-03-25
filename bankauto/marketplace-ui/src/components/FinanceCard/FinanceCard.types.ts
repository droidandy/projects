export interface Props {
  title?: string;
  subTitle?: string;
  icon: JSX.Element;
  link?: string;
  transparent?: boolean;
  direction?: 'column' | 'row';
  className?: string;
  isOpenOnNewPage?: boolean;
}
