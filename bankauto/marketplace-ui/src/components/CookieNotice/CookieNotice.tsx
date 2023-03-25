import React, { FC } from 'react';
import { Button, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';
import { useCookies } from 'react-cookie';
import { COOKIE_INFO_NAME } from 'constants/cookieInfo';
import { useStyles } from './CookieNotice.styles';

const COOKIE_NOTICE_TEXT =
  'Мы используем файлы cookie для персонализации сервисов и повышения удобства работы с сайтом.\nЕсли вы не хотите использовать файлы cookie, измените настройки браузера.';

interface Props {
  text?: string;
  btnText?: string;
}

const CookieNotice: FC<Props> = () => {
  const s = useStyles();
  const { isMobile, isTablet } = useBreakpoints();
  const [cookieInfo, setCookieInfo] = useCookies([COOKIE_INFO_NAME]);
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30 * 12);
  const handleAcceptNotice = () => {
    setCookieInfo(COOKIE_INFO_NAME, JSON.stringify({ accept: true }), { expires: expirationDate });
  };

  return !cookieInfo?.cookieInfo?.accept ? (
    <Grid container direction="column" className={s.root}>
      <Grid item className={s.content}>
        <div className={s.title}>
          <Typography variant={isMobile ? 'caption' : 'h5'} component={isMobile ? 'div' : 'pre'}>
            {COOKIE_NOTICE_TEXT}
          </Typography>
        </div>
        <Button onClick={handleAcceptNotice} className={s.btnClose}>
          <IconClose height={isMobile || isTablet ? '10' : '14.73'} width={isMobile || isTablet ? '10' : '14.73'} />
        </Button>
      </Grid>
    </Grid>
  ) : null;
};

export { CookieNotice };
