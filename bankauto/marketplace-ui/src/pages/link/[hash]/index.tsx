import React, { FC, useEffect } from 'react';
import { PagePropsBase } from 'types/PagePropsBase';
import { GetServerSidePropsContext } from 'next';
import { getFullLink } from 'api/marketing';
import { useRouter } from 'next/router';

interface Props extends PagePropsBase {
  originalUrl: string;
}

const ShortLinkPage: FC<Props> = ({ originalUrl }) => {
  const router = useRouter();

  useEffect(() => {
    if (originalUrl) router.push(originalUrl);
  }, [originalUrl, router]);

  return <></>;
};

export const getServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  const queryParams: { hash: string } = context.params;

  try {
    const { data } = await getFullLink(queryParams.hash);
    return { props: { originalUrl: data.originalUrl } };
  } catch (e) {
    return {
      props: { originalUrl: null },
      notFound: true,
    };
  }
};

export default ShortLinkPage;
