import React, { FC } from 'react';
import Typography from '@marketplace/ui-kit/components/Typography';
import Box, { Props as BoxProps } from '@marketplace/ui-kit/components/Box';
import { Link } from 'components/Link';
import { useStyles } from './StepBlockItem.styles';

export enum STEP_STATUS {
  SUCCESS = 'success',
  PROGRESS = 'progress',
  WAITING = 'waiting',
}

const StepColor: Record<STEP_STATUS, string> = {
  [STEP_STATUS.SUCCESS]: 'success.main',
  [STEP_STATUS.PROGRESS]: 'warning.main',
  [STEP_STATUS.WAITING]: 'secondary.main',
};

export type StepBlockItemProps = BoxProps & {
  text: string;
  status: STEP_STATUS;
  number: number;
  id: string;
  route: string;
};

export const StepBlockItem: FC<StepBlockItemProps> = ({ status, text, number, id, route, ...boxProps }) => {
  const { stepNumberWrapper, stepNumber } = useStyles();

  return (
    <Link
      href={status === STEP_STATUS.PROGRESS || status === STEP_STATUS.SUCCESS ? `${route}#${id}` : route}
      color="textPrimary"
    >
      <Box display="flex" alignItems="center" {...boxProps}>
        <Box mr={1.25} bgcolor={StepColor[status]} className={stepNumberWrapper}>
          <Typography variant="h5" component="span" className={stepNumber}>
            {number}
          </Typography>
        </Box>
        <Typography variant="h5" component="p">
          {text}
        </Typography>
      </Box>
    </Link>
  );
};
