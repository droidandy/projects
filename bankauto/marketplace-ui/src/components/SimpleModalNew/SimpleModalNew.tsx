import React, { ComponentType, FC, SVGProps } from 'react';
import { Box, Button, CircularProgress, Icon, IconButton, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { BackdropModalActions } from '@marketplace/ui-kit/components/BackdropModal';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';
import cx from 'classnames';
import { useStyles } from './SimpleModalNew.styles';

export interface SimpleModalText {
  title: string;
  subtitle?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  btnText?: string;
  onBtnClick?: () => void;
  btnDisabled?: boolean;
  loading?: boolean;
  className?: string;
  isClosable?: boolean;
  children?: React.ReactChildren | React.ReactNode;
  onSecondaryBtnClick?: () => void;
  secondaryBtnText?: string;
  secondaryBtnDisabled?: boolean;
  handleClose?: () => void;
}

export type SimpleModalProps = SimpleModalText & BackdropModalActions;

const SimpleModalNew: FC<SimpleModalProps> = ({
  title,
  subtitle,
  icon,
  handleClose,
  isClosable,
  btnText,
  onBtnClick,
  btnDisabled = false,
  children,
  className,
  onSecondaryBtnClick,
  secondaryBtnText,
  secondaryBtnDisabled = false,
  loading,
}) => {
  const s = useStyles({ loading });
  const { isMobile } = useBreakpoints();
  return (
    <Box
      p={isMobile ? 2.5 : 7.5}
      pt={6.5}
      className={cx(className, s.modal)}
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      bgcolor="common.white"
    >
      {isClosable && (
        <Box margin={2.5} position="absolute" top="0" right="0" zIndex="1">
          <IconButton aria-label="close" onClick={handleClose}>
            <Icon viewBox="0 0 16 16" width="14" height="14" className={s.closeIcon} component={IconClose} />
          </IconButton>
        </Box>
      )}
      {icon && (
        <Box pb={4} pt={isMobile ? 1.5 : 0} flex alignItems="center" justifyContent="center">
          <Icon component={icon} className={s.icon} viewBox="0 0 56 56" />
        </Box>
      )}

      <Box pb={children ? 1.25 : 2.5}>
        <Typography variant="body1" component="h5" className={s.title}>
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Box pb={isMobile ? 2.5 : 5}>
          <Typography component="span" variant="body1">
            {subtitle}
          </Typography>
        </Box>
      )}
      {children}

      {!onSecondaryBtnClick ? (
        <Button
          type="button"
          onClick={!isClosable ? handleClose : onBtnClick}
          variant="contained"
          size="large"
          color="primary"
          fullWidth
          disabled={loading || btnDisabled}
          className={s.mainButton}
        >
          <Typography variant="h5" component="span">
            {loading ? <CircularProgress size="1.5rem" /> : btnText}
          </Typography>
        </Button>
      ) : (
        <Box display="flex" justifyContent="space-between" flexDirection={isMobile ? 'column' : 'row'}>
          <Box mr={!isMobile ? 2.5 : 0} mb={isMobile ? 2.5 : 0}>
            <Button
              className={s.btn}
              type="button"
              onClick={onSecondaryBtnClick}
              variant="outlined"
              color="primary"
              size="large"
              disabled={secondaryBtnDisabled}
            >
              <Typography variant="h5" component="span" color="primary">
                {secondaryBtnText}
              </Typography>
            </Button>
          </Box>

          <Box ml={!isMobile ? 2.5 : 0}>
            <Button
              className={s.btn}
              type="button"
              onClick={!isClosable ? handleClose : onBtnClick}
              variant="contained"
              size="large"
              color="primary"
              disabled={btnDisabled}
            >
              <Typography variant="h5" component="span">
                {btnText}
              </Typography>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { SimpleModalNew };
