import React from 'react';
import { Box, Typography } from '@material-ui/core';
import KitCheckbox, { CheckboxProps } from '@marketplace/ui-kit/components/Checkbox';
import { ReactComponent as CheckMark } from '@marketplace/ui-kit/icons/icon-check-list';
import cx from 'classnames';
import { useStyles } from './CheckboxMobile.styles';

export type Props = CheckboxProps;

export const CheckboxMobile = ({ label, labelPlacement, className, checked, ...rest }: Props) => {
  const s = useStyles({ checked });
  return (
    <KitCheckbox
      className={cx(className, s.root)}
      labelPlacement={labelPlacement || 'start'}
      label={
        <Typography className={s.label} variant="body1">
          {label}
        </Typography>
      }
      icon={<></>}
      checkedIcon={
        <Box id="wrapper" pr={0.625} className={s.checkmarkWrapper}>
          <CheckMark />
        </Box>
      }
      {...rest}
    />
  );
};
