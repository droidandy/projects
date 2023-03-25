import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const excludeRoutes = ['/sell/create', '/sell/edit', '/sell/list'];

export const SeoNoIndexSetter = () => {
  const router = useRouter();
  const isExcluded = excludeRoutes.includes(router.pathname);
  return <Head>{isExcluded && <meta name="robots" content="noindex, follow" />}</Head>;
};
