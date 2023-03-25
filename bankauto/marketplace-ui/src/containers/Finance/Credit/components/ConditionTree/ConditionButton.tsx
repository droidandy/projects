import React, { FC, useCallback } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { useBreakpoints } from '@marketplace/ui-kit';
import cx from 'classnames';
import { Condition, ConditionData } from '../../types/Condition';
import { useStyles } from './ConditionTree.styles';

interface Props {
  condition: ConditionData;
  active: boolean;
  handlerClick: (condition: Condition) => void;
}

const ConditionButton: FC<Props> = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  { condition: { type, name, Icon, IconActive }, active, handlerClick },
) => {
  const { button, buttonActive, icon, iconActive } = useStyles();
  const { isMobile } = useBreakpoints();
  const buttonClick = useCallback(() => handlerClick(type), [handlerClick, type]);

  return (
    <Button
      variant="contained"
      startIcon={
        active ? (
          <Box className={cx(icon, iconActive)}>
            <IconActive />
          </Box>
        ) : (
          <Box className={icon}>
            <Icon />
          </Box>
        )
      }
      onClick={buttonClick}
      className={cx(button, { [buttonActive]: active })}
    >
      <Typography variant={isMobile ? 'h6' : 'h4'}>{name}</Typography>
    </Button>
  );
};

export { ConditionButton };
