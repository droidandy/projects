import React, { memo, FC, useMemo } from 'react';
import cx from 'classnames';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper } from 'swiper';
import { ReactIdSwiperCustomProps } from 'react-id-swiper/lib/types';
import { Image } from '@marketplace/ui-kit/types';
import { Box, useToggle, Modal, Typography, IconButton } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { ReactComponent as IconPlay } from 'icons/iconPlayNew.svg';
import { SoldOutLabel } from 'components';
import { mapUrlsToImages } from 'helpers/mapUrlsToImages';
import { getYouTubeVideoId } from 'helpers';
import { useStyles } from './Gallery.styles';

interface Props {
  images: string[];
  videoUrl?: string | null;
  chipText?: string;
  caption?: (image: Image) => JSX.Element;
  isBankautoDealer?: boolean;
  isSoldOut?: boolean;
}

const GalleryRoot: FC<Props> = ({ images, videoUrl, isBankautoDealer, chipText, isSoldOut }): JSX.Element => {
  const {
    imageContainer,
    sliderBox,
    galleryTopParent,
    galleryTop,
    galleryTopVideo,
    galleryImage,
    iconPlayWrapper,
    availableChip,
    bestPriceImage,
  } = useStyles();
  const [modal, modalActions] = useToggle();
  const gallerySwiperParams: ReactIdSwiperCustomProps = {
    Swiper,
    spaceBetween: 10,
    containerClass: galleryTop,
    loop: true,
    rebuildOnUpdate: true,
  };

  const videoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl]);

  const { galleryContent } = useMemo(
    () => ({
      galleryContent: [
        ...mapUrlsToImages(images).map(({ id, url }) => {
          return (
            <div key={id} className={cx(galleryImage, imageContainer)}>
              <ImageWebpGen src={url} />
            </div>
          );
        }),
      ],
    }),
    [images, galleryImage, imageContainer],
  );

  return (
    <Box className={sliderBox}>
      <div className={galleryTopParent}>
        {galleryContent.length && <ReactIdSwiper {...gallerySwiperParams}>{galleryContent}</ReactIdSwiper>}
        {isBankautoDealer ? (
          <Box className={bestPriceImage}>
            <ImageWebpGen src="/images/pechat.png" stretch />
          </Box>
        ) : (
          (isSoldOut && <SoldOutLabel />) || (
            <Box color="white" className={availableChip}>
              <Typography variant="caption" color="inherit">
                {chipText || 'В НАЛИЧИИ'}
              </Typography>
            </Box>
          )
        )}
        {videoId && (
          <IconButton onClick={modalActions.handleOpen} className={iconPlayWrapper}>
            <IconPlay viewBox="0 0 40 40" width="2.5rem" height="2.5rem" />
          </IconButton>
        )}
      </div>
      {videoId && (
        <Modal onClose={modalActions.handleClose} disablePortal open={modal}>
          <iframe
            className={galleryTopVideo}
            width="100%"
            height="50%"
            title="car video"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Modal>
      )}
    </Box>
  );
};

const Gallery = memo(GalleryRoot);
export { Gallery };
