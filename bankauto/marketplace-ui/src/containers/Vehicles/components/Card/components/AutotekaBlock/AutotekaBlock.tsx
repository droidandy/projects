import React, { useState } from 'react';
import * as icons from 'icons/autoteka';
import { Button, Divider, Icon, IconButton, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Popover } from '@material-ui/core';
import { Teaser } from './components/Teaser/Teaser';
import { useAutotekaBlockContext } from './context/AutotekaBlockContext';
import { useStyles } from './AutotekaBlock.styles';
import { getAutotekaReportLink } from 'api/catalog';

export const AutotekaBlock = () => {
  const { open, handleClick, handleClose, anchorEl, teaserData, id } = useAutotekaBlockContext();
  const popoverId = open ? 'simple-popover' : undefined;
  const { isMobile } = useBreakpoints();
  const popoverTransition = React.useMemo(() => {
    return isMobile ? 'translate(0.25rem,13.5rem)' : 'translate(0.625rem,-0.625rem)';
  }, [isMobile]);
  const [isAutotekaLinkLoading, setIsAutotekaLinkLoading] = useState(false);
  const s = useStyles();
  const fetchAutotekaLink = async () => {
    setIsAutotekaLinkLoading(true);
    try {
      const { data } = await getAutotekaReportLink(Number(id));
      window.open(data.url, '_ blank');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAutotekaLinkLoading(false);
    }
  };
  return (
    <>
      <IconButton aria-label="open" className={s.iconButton} onClick={handleClick} aria-describedby={popoverId}>
        <Icon viewBox="0 0 40 40" component={icons.IconAutoteka} className={s.icon} />
      </IconButton>
      <Popover
        open={open}
        onClose={handleClose}
        id={popoverId}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: { maxWidth: '20.3125rem', transform: `${popoverTransition}` },
        }}
      >
        <Typography variant="h5" component="div" className={s.title}>
          Отчет Автотеки по автомобилю
        </Typography>
        <Divider />
        <div className={s.infoRoot}>
          <Teaser data={teaserData!} className={s.teaserItem} />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={s.teaserButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fetchAutotekaLink();
            }}
            disabled={isAutotekaLinkLoading}
          >
            Посмотреть полный отчет
          </Button>
        </div>
      </Popover>
    </>
  );
};
