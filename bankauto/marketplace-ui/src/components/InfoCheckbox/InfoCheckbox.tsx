import React, { FC, MouseEventHandler, ReactElement } from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import Checkbox, { CheckboxProps } from '@marketplace/ui-kit/components/Checkbox';
import { InfoTooltip } from 'components/InfoTooltip';
import { SelfShowingModal } from 'components/SelfShowingModal';

import { useStyles } from 'components/InfoTooltip/InfoTooltip.styles';

interface Props extends CheckboxProps {
  // передавать надо что то ОДНО: или текст для тултипа, или карточку для модалки
  text?: string;
  modal?: ({ handleClose }: { handleClose: MouseEventHandler<HTMLElement> }) => ReactElement;
  variant?: Variant;
}

const InfoCheckbox: FC<Props> = ({ label, text, variant, modal, ...rest }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  const defaultVariant = isMobile ? 'body2' : 'body1';

  return (
    <Box display="flex" alignItems="center">
      <Checkbox
        label={
          <Typography variant={variant || defaultVariant}>
            {label}

            {text && (
              <InfoTooltip
                title={
                  <Box color="primary.contrastText">
                    <Typography variant={isMobile ? 'body2' : 'body1'}>{text}</Typography>
                  </Box>
                }
              />
            )}

            {!text && modal && (
              <SelfShowingModal
                component={({ handleOpen }) => (
                  <Box onClick={handleOpen} component="span">
                    <span className={s.info}>i</span>
                  </Box>
                )}
                modal={({ handleClose }) => modal({ handleClose })}
              />
            )}
          </Typography>
        }
        {...rest}
      />
    </Box>
  );
};

export { InfoCheckbox };
