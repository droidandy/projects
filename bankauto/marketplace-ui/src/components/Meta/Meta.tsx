import React from 'react';
import Head from 'next/head';
import { ContentType } from 'types/ContentType';

interface Props {
  title?: string;
  canonical?: string;
  description?: string;
  type?: ContentType;
  url?: string;
  imageUrl?: string;
  imageWidht?: string;
  imageHeight?: string;
}

const Meta = ({ title = '#банкавто', type, canonical, description, url, imageUrl, imageWidht, imageHeight }: Props) => {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {type && <meta property="og:type" content={type} />}
      {url && <meta property="og:url" content={url} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageWidht && <meta property="og:image:width" content={imageWidht} />}
      {imageHeight && <meta property="og:image:height" content={imageHeight} />}
    </Head>
  );
};

export { Meta };
