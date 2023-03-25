import React, { FC, useCallback } from 'react';
import { Button, useBreakpoints, Typography } from '@marketplace/ui-kit';
import { getSravniUrl } from 'api/application';
import { useStyles } from './ApplicationRejected.styles';
import { useQuery, FetchQueryOptions } from 'react-query';

interface Props {
  application: any;
}

const useSravniUrl = (creditId: any, options?: FetchQueryOptions) => {
  return useQuery(['sravniUrl', { creditId }], () => getSravniUrl(creditId), { refetchOnMount: true, ...options });
};

export const ApplicationRejected: FC<Props> = React.memo(({ application }) => {
  const { root, content } = useStyles();
  const { isMobile } = useBreakpoints();
  const { data } = useSravniUrl(application?.credit?.id);
  const url = (data as any)?.data?.sravni_url;

  const sendRequest = useCallback(() => {
    window.open(url, '_blank');
  }, [url]);

  return (
    <div className={root}>
      <div className={content}>
        <Typography variant={isMobile ? 'h5' : 'h3'}>К сожалению, Ваша заявка на кредит отклонена.</Typography>
        <Typography variant={isMobile ? 'h6' : 'h5'}>
          Прямо сейчас Вы можете получить одобрение в других банках.
        </Typography>
      </div>

      <Button disabled={!url} onClick={sendRequest} size="large" variant="contained" color="primary">
        <Typography variant="h5" component="p">
          Отправить заявку
        </Typography>
      </Button>
    </div>
  );
});
