import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';

import { Link } from 'components/Link';

import { StateModel } from 'store/types';
import { Box, CircularProgress, ContainerWrapper, Icon } from '@marketplace/ui-kit';
import { useStyles } from './EmailVerifyContainer.styles';
import { ReactComponent as IconSuccess } from 'icons/iconSuccessNew.svg';
import { ReactComponent as IconError } from 'icons/iconErrorNew.svg';
import { verifyEmail } from 'store/user/actions';

function EmailVerifyContainerRoot(): JSX.Element {
  const user = useSelector(({ user }: StateModel) => user);
  const { query } = useRouter();
  const token = query.token as string;
  const { icon } = useStyles();
  const [inProcess, setInProcess] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(user.isEmailVerified);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !token || isVerified) {
      setInProcess(false);
      return;
    }

    (dispatch(verifyEmail(token)) as unknown as Promise<void>)
      .then(() => {
        setIsVerified(true);
      })
      .finally(() => {
        setInProcess(false);
      });
  }, [token]);

  return (
    <ContainerWrapper style={{ flexGrow: 1 }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        pt={9}
        pb={15}
        height="100%"
      >
        {inProcess ? (
          <CircularProgress size="1.5rem" />
        ) : (
          <>
            <Box pb={2}>
              <Icon component={isVerified ? IconSuccess : IconError} className={icon} viewBox="0 0 80 80" />
            </Box>
            <Box pt={2.75} textAlign="center">
              <Typography component="h1" variant="h3">
                {isVerified ? 'E-mail был успешно подтвержден' : 'Произошла ошибка при подтверждении e-mail'}
              </Typography>
              <Typography component="p" variant="subtitle1">
                {isVerified ? (
                  <>
                    Email {user.email} был успешно подтвержден. Перейдите на{' '}
                    <Link href="/" as="/">
                      <a>главную страницу</a>
                    </Link>
                    , чтобы начать пользоваться bankauto.ru
                  </>
                ) : (
                  <>Пожалуйста, попробуйте позже</>
                )}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </ContainerWrapper>
  );
}

const EmailVerifyContainer = memo(EmailVerifyContainerRoot);

export { EmailVerifyContainer };
