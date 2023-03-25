import React, { FC, memo, useEffect } from 'react';
import { useRouter } from 'next/router';

const SellBHomePage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/sell');
  }, []);

  return <></>;
};

export default memo(SellBHomePage);
