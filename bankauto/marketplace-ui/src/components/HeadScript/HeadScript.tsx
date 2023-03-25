import React from 'react';
import Head from 'next/head';

interface Props {
  type: string;
  script: string;
}

const HeadScript = ({ type, script }: Props) => {
  return (
    <Head>
      <script
        type={type}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          __html: script,
        }}
      />
    </Head>
  );
};

export { HeadScript };
