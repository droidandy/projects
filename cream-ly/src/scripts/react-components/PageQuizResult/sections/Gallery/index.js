import React, { Component } from "react";
import Image from "@Components/SharedComponents/LazyLoadImage";

import ImageGallery from "react-image-gallery";

import "./index.scss";

class Gallery extends Component {
  state = {
    imageWidth: window.innerWidth > 455 ? 455 : window.innerWidth - 20,
    imageHeight: window.innerWidth > 455 ? 500 : 300,
  };

  renderThumbs = (children) => {
    /*  return children.map((item, i) =>
      item.props.isVideo ? (
        <div className="thumb">
          <img alt={this.props.altText} style={{ opacity: 0, height: 338 }} />
          <VideocamIcon fontSize="large" />
        </div>
      ) : (
        <div className="thumb">
          <img key={i} src={item.props.thumb} alt={this.props.altText} />
        </div>
      )
    ); */
  };

  render() {
    const images =
      this.props.product.images && Array.isArray(this.product.images)
        ? this.product.images
        : [];

    // if (!images.length) return null;

    return (
      <div className="Gallery">
        {images.length === 1 && (
          <Image src={images[0].big} thumb={images[0].small} />
        )}
        {images.length > 1 && (
          <ImageGallery
            onBeforeSlide={(...args) => {
              window.scrollTo({ top: 0 });
            }}
            lazyLoad={true}
            items={images.map((resource, i) => ({
              original: resource.big,
              thumbnail: resource.small,
              renderItem: (item) => {
                return resource.vimeoId ? (
                  this.renderGalleryVideo(resource.vimeoId, i)
                ) : (
                  <div className="gallery-item">
                    <Image
                      src={resource.big}
                      width={this.state.imageWidth}
                      height={this.state.imageHeight}
                      key={i}
                      thumb={resource.small}
                      alt={this.props.altText}
                    />
                    <img src={resource.big} alt="alt" style={{ opacity: 0 }} />
                  </div>
                );
              },
            }))}
          />
        )}
      </div>
    );
  }
}
export default Gallery;
