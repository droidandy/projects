import React, { FC } from 'react';
import { Meta } from 'components';
import { Container404 } from 'containers/Container404';
import { useSsrMatchMedia } from 'hooks/useSsrMatchMedia';
import { usePageContext } from 'helpers/context/PageContext';

const Page404: FC = () => {
  const { isMobileDevice } = usePageContext();
  const ssrMatchMedia = useSsrMatchMedia(isMobileDevice);

  return (
    <>
      <Meta title="Ошибка 404" description="Ошибка 404" />
      <Container404 />
    </>
  );
};

export default Page404;
