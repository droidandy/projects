import React, { FC, memo, useEffect } from 'react';
import { useRouter } from 'next/router';

const SellBCreate: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/sell/create');
  }, []);

  return <></>;
};

export default memo(SellBCreate);
