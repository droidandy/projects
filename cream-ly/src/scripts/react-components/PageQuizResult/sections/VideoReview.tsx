import React, { Component, Suspense } from "react";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";
import { getVimeoId } from "@Core/products/demoVideo";

interface IProps {
  lang: string;
  product: IProduct;
}

const VideoReview = ({ lang, product }: IProps) => {
  const vimeoId = getVimeoId(product.handle, product.sku, lang);

  if (!vimeoId) return null;

  const Video = React.lazy(() =>
    import(
      /* webpackPreload: true */
      /* webpackChunkName: BackgroundVimeo */
      "@Components/SharedComponents/BackgroundVimeoWithPlyr"
    )
  );

  return (
    <div className="col-12 col-md-8">
      <h4>Видео обзор {product.title}</h4>
      <div className="demoVideo">
        <Suspense fallback={<LoadingIndicator />}>
          <Video vimeoId={vimeoId} lang={lang} />
        </Suspense>
      </div>
    </div>
  );
};

export default VideoReview;
