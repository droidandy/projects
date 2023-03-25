import React, { FC, memo, useEffect } from 'react';
import { useRouter } from 'next/router';

const SellCreate: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/sell/create');
  }, []);

  return <></>;
};

export default memo(SellCreate);
