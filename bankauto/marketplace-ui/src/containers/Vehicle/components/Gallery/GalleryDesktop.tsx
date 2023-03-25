import React, { useEffect, useRef, memo, FC, useMemo, useState, SyntheticEvent } from 'react';
import cx from 'classnames';
import { Controller, Navigation, Swiper } from 'swiper';
import { ControllerOptions } from 'swiper/types/components/controller';
import { SwiperRefNode } from 'react-id-swiper';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { ReactIdSwiperCustomProps } from 'react-id-swiper/lib/types';
import { SRLWrapper, useLightbox } from 'simple-react-lightbox';
import { ReactComponent as ZoomIn } from '@marketplace/ui-kit/icons/icon-zoom-in.svg';
import { Icon, Img, Box } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { ReactComponent as IconPlay } from 'icons/IconPlay.svg';
import { getYouTubeVideoId } from 'helpers';
import { useStyles } from './GalleryDesktop.styles';

export interface GalleryImageContainer {
  thumbnail: string;
  medium: string;
  large: string;
  id: string | number;
}

interface Props {
  images: GalleryImageContainer[];
  videoUrl?: string | null;
  isBankautoDealer?: boolean;
}

const GalleryDesktopRoot: FC<Props> = ({ images, videoUrl, isBankautoDealer }): JSX.Element => {
  const classes = useStyles();
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [thumbnailSwiperParams, setThumbnailSwiperParams] = useState<ReactIdSwiperCustomProps | null>(null);
  const gallerySwiperRef = useRef<SwiperRefNode>(null);
  const thumbnailSwiperRef = useRef<SwiperRefNode>(null);
  const next = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  const isGallery = images.length > 1;
  const gallerySwiperParams: ReactIdSwiperCustomProps = {
    Swiper,
    modules: [...(isGallery ? [Controller, Navigation] : [])],
    spaceBetween: 10,
    containerClass: classes.galleryTop,
    slidesPerView: 'auto',
    loop: true,
    loopedSlides: images.length,
    ...(isGallery
      ? {
          navigation: {
            prevEl: '.swiper-button-prev.custom',
            nextEl: '.swiper-button-next.custom',
          },
        }
      : {}),
  };

  const lightboxImages = useMemo<any[]>(
    () =>
      images.map((image) => ({
        src: image.large,
      })) || [],
    [images],
  );
  const { openLightbox } = useLightbox();

  useEffect(() => {
    setThumbnailSwiperParams({
      Swiper,
      modules: [Controller, Navigation],
      spaceBetween: 10,
      slidesPerColumn: 1,
      slidesPerView: 'auto',
      loop: isGallery,
      loopedSlides: images.length,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      centeredSlides: isGallery,
      containerClass: cx(classes.galleryThumbnails, isGallery && classes.galleryThumbnailsLoop),
      navigation: isGallery
        ? {
            prevEl: prev.current as HTMLElement,
            nextEl: next.current as HTMLElement,
          }
        : {},
    });
  }, [isGallery, images.length]);

  useEffect(() => {
    if (thumbnailSwiperParams) {
      const gallerySwiper = gallerySwiperRef?.current?.swiper;
      const thumbnailSwiper = thumbnailSwiperRef?.current?.swiper;
      if (gallerySwiper?.controller && thumbnailSwiper?.controller) {
        (gallerySwiper.controller as ControllerOptions).control = thumbnailSwiper;
        (thumbnailSwiper.controller as ControllerOptions).control = gallerySwiper;
      }
    }
  }, [thumbnailSwiperParams]);

  const videoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl]);

  const [galleryContent, thumbnailsContent] = useMemo(
    () => [
      [
        ...images?.map(({ id, medium: url }, k) => {
          return (
            <div key={id} className={cx(classes.galleryImage, classes.imageContainer)}>
              <ImageWebpGen src={url} />
              <button type="button" className={classes.galleryTopZoom} onClick={() => openLightbox(k)}>
                <Icon viewBox="0 0 23 23" component={ZoomIn} className={classes.zoomInIcon} />
              </button>
            </div>
          );
        }),
      ],
      [
        ...images?.map(({ id, thumbnail: url }) => {
          return (
            <div key={`thumb-${id}`} className={classes.galleryImage}>
              <ImageWebpGen src={url} />
            </div>
          );
        }),
      ],
    ],
    [images, openLightbox],
  );

  const handleVideoPreviewClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoMode(!isVideoMode);
  };

  return (
    <div className={classes.sliderBox}>
      <div className={classes.galleryTopParent}>
        <SRLWrapper
          elements={lightboxImages}
          options={{
            thumbnails: { thumbnailsPosition: 'left' },
            buttons: { showDownloadButton: false },
            caption: { captionColor: 'black', captionAlignment: 'end' },
            settings: { overlayColor: '#FFFFFF' },
          }}
        />
        {isBankautoDealer ? (
          <div className={classes.bestPriceImage}>
            <ImageWebpGen src="/images/pechat.png" />
          </div>
        ) : null}
        {Boolean(galleryContent.length) && (
          <ReactIdSwiper {...gallerySwiperParams} ref={gallerySwiperRef}>
            {galleryContent}
          </ReactIdSwiper>
        )}
        <div className={cx(classes.galleryTop, classes.galleryTopVideo, isVideoMode && classes.galleryTopVideoVisible)}>
          <iframe
            width="100%"
            height="100%"
            title="car video"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <div
        className={classes.thumbParent}
        onClick={() => {
          setIsVideoMode(false);
        }}
      >
        {videoId && (
          <div onClick={handleVideoPreviewClick} key="video" className={cx(classes.galleryImage, classes.thumbVideo)}>
            <Img src={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`} />
            <div className={classes.iconPlayWrapper}>
              <Icon component={IconPlay} viewBox="0 0 7 8" width="0.4375rem" height="0.5625rem" />
            </div>
          </div>
        )}
        <Box flexGrow={1} padding={isGallery && !videoId ? '0 2rem' : '0'} position="relative">
          {thumbnailSwiperParams && Boolean(thumbnailsContent.length) && (
            <ReactIdSwiper {...thumbnailSwiperParams} ref={thumbnailSwiperRef}>
              {thumbnailsContent}
            </ReactIdSwiper>
          )}
          {isGallery && (
            <>
              <div className={cx(classes.thumbPrev, classes.thumbControl)} ref={prev} />
              <div className={cx(classes.thumbNext, classes.thumbControl)} ref={next} />
            </>
          )}
        </Box>
      </div>
    </div>
  );
};

const GalleryDesktop = memo(GalleryDesktopRoot);
export { GalleryDesktop };
