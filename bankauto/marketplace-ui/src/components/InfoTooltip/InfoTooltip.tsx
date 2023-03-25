import React, { FC, useState, useMemo, SyntheticEvent } from 'react';
import { ClickAwayListener } from '@material-ui/core';
import { useBreakpoints } from '@marketplace/ui-kit';
import { Tooltip } from 'components';
import { useStyles } from './InfoTooltip.styles';
import cx from 'classnames';

interface Props {
  title: NonNullable<React.ReactNode>;
  onClick?: (e: SyntheticEvent) => void;
  preWrap?: boolean;
  disablePortal?: boolean;
  isMobilePortalTooltip?: boolean;
}

const InfoTooltip: FC<Props> = ({
  title,
  children,
  onClick,
  preWrap = false,
  disablePortal = true,
  isMobilePortalTooltip = false,
}) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const toggleTooltip = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((val) => !val);
  };

  return useMemo(
    () =>
      isMobile ? (
        <ClickAwayListener onClickAway={handleTooltipClose} touchEvent="onTouchStart" mouseEvent="onMouseDown">
          <span onClick={onClick} className={cx(s.toolTipMobile, preWrap && s.withPreWrap)} role="button" tabIndex={-1}>
            <Tooltip
              title={title}
              enterTouchDelay={0}
              placement="top-end"
              PopperProps={{
                disablePortal,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              isMobilePortalTooltip={isMobilePortalTooltip}
            >
              <span onClick={toggleTooltip} role="button" tabIndex={-1} className={children ? '' : s.info}>
                {children || 'i'}
              </span>
            </Tooltip>
          </span>
        </ClickAwayListener>
      ) : (
        <Tooltip
          title={title}
          enterTouchDelay={0}
          placement="top-end"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <span className={children ? '' : s.info}>{children || 'i'}</span>
        </Tooltip>
      ),
    [isMobile, open, title, s.info, s.toolTipMobile, children, onClick],
  );
};

export { InfoTooltip };
