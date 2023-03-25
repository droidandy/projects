import React, { RefObject, useMemo } from 'react';
import cx from 'classnames';
import { Typography, Grid, PriceFormat, Box, IconButton, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as ArrowDownHero } from 'icons/arrowDown.svg';
import { Popover } from '@material-ui/core';
import { useStyles } from './DiscountPopover.styles';

type Discount = {
  title: string;
  amount: number;
};

type DiscountPopoverProps = {
  discounts: Discount[];
  anchorRef: RefObject<HTMLDivElement>;
};

export const DiscountPopover = ({ discounts, anchorRef }: DiscountPopoverProps) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles({ isMobile });
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const width = useMemo(() => {
    if (anchorEl) {
      return anchorEl.clientWidth;
    }
  }, [anchorEl]);

  const handleClick = () => {
    setAnchorEl(anchorRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className={s.root}>
      <Box ml={1} className={s.arrowButtonWrapper}>
        <IconButton aria-describedby={id} size="small" onClick={handleClick}>
          <ArrowDownHero className={cx(s.arrow, open && s.arrowReversed)} />
        </IconButton>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: { width: `${width}px` },
        }}
      >
        <Box p={2.5}>
          <Typography variant="h4">Скидки</Typography>
          {discounts.map(({ title, amount }: Discount) => (
            <Box mt={0.75}>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="subtitle1">{title}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" color="primary">
                    <PriceFormat value={amount} />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </Popover>
    </div>
  );
};
