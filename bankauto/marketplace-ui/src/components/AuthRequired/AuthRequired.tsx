import { Button, Typography, Box, useBreakpoints } from '@marketplace/ui-kit';
import { Link } from 'components/Link';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { changeAuthModalVisibility } from 'store/user';
import { RegistrationTypes } from 'types/Authentication';
import { useStyles } from './AuthRequired.styles';

export const AuthRequired: FC = () => {
  const s = useStyles();
  const dispatch = useDispatch();
  const { isMobile } = useBreakpoints();
  React.useEffect(() => {
    dispatch(changeAuthModalVisibility(true, { regType: RegistrationTypes.PLAIN }));
  }, [dispatch]);

  return (
    <Box className={s.root}>
      <Typography className={s.authText} variant={isMobile ? 'h4' : 'h2'} component="span" color="textSecondary">
        Для просмотра страницы необходимо{' '}
        <Typography
          variant={isMobile ? 'h4' : 'h2'}
          component="span"
          role="button"
          tabIndex={-1}
          onClick={() => {
            dispatch(changeAuthModalVisibility(true, { regType: RegistrationTypes.PLAIN }));
          }}
          className={s.textLink}
        >
          авторизоваться
        </Typography>
        .
      </Typography>
      <Box width="22.75rem" maxWidth="100%" pt={2.5}>
        <Link href="/">
          <Button variant="contained" color="primary" size="large" fullWidth>
            <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
              На главную
            </Typography>
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
