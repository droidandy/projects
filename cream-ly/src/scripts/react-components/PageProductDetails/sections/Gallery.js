import React, { Component } from "react";

import VimeoVideo from "@Components/SharedComponents/VimeoVideo";
import Image from "@Components/SharedComponents/LazyLoadImage";
import VideocamIcon from "@material-ui/icons/Videocam";
import ImageGallery from "react-image-gallery";

import "./Gallery.scss";

class Gallery extends Component {
  galleryRef = React.createRef();

  state = {
    imageWidth: window.innerWidth > 455 ? 455 : window.innerWidth - 20,
    imageHeight: window.innerWidth > 455 ? 350 : 250,
  };

  renderGalleryVideo = (vimeoId, i) => {
    return (
      <div isVideo key={i}>
        <VimeoVideo vimeoId={vimeoId} />
        <img alt={this.props.altText} style={{ opacity: 0, height: 80 }} />
      </div>
    );
  };

  render() {
    const images =
      this.props.images && Array.isArray(this.props.images)
        ? this.props.images
        : [];
    const videos = Array.isArray(this.props.videos)
      ? this.props.videos.filter(({ vimeoId }) => vimeoId)
      : [];
    const resources = images.concat(videos);

    return (
      <div className="Gallery">
        {!resources.length && (
          <Image
            width={this.state.imageWidth}
            height={this.state.imageHeight}
            src={require("./placeholder.jpg")}
            thumb={require("./placeholder.jpg")}
            alt={this.props.altText}
          />
        )}
        {resources.length === 1 &&
          (resources[0].vimeoId ? (
            <VimeoVideo vimeoId={resources[0].vimeoId} />
          ) : (
            <Image
              src={resources[0].big}
              thumb={resources[0].small}
              alt={this.props.altText}
            />
          ))}
        {resources.length > 1 && (
          <ImageGallery
            ref={this.galleryRef}
            onBeforeSlide={(...args) => {
              window.scrollTo({ top: 0 });
            }}
            lazyLoad={true}
            items={resources.map((resource, i) => ({
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
              renderThumbInner: (item) => {
                return resource.vimeoId ? (
                  <div className="thumb">
                    <VideocamIcon fontSize="large" />
                  </div>
                ) : (
                  <div className="thumb">
                    <img
                      key={i}
                      src={resource.small}
                      alt={this.props.altText}
                    />
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

// Gallery.defaultProps = {
//   images: {
//     edges: [],
//   },
//   videos: [],
// };
export default Gallery;
