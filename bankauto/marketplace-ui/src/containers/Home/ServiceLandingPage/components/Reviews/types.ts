import { TypographyProps } from '@material-ui/core/Typography';

type Classes = {
  title?: string;
};

export interface Props {
  classNames?: Classes;
  titleTypographyProps?: TypographyProps;
  reviews: any;
}
