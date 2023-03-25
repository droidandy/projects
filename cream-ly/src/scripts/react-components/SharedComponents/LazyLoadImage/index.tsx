import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "./index.scss";

type Props = {
  src: string;
  thumb?: string;
  height?: number | string;
  width?: number | string;
  alt?: string;
};

const LazyLoad = ({ height, thumb, ...props }: Props) => (
  <LazyLoadImage
    style={{ maxHeight: height }}
    className="img-fluid"
    // effect="blur"
    placeholderSrc={thumb}
    {...props}
  />
);

export default LazyLoad;
