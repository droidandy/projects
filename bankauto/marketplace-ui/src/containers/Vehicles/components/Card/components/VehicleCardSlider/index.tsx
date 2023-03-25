import React, { FC, useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { PaginationDots } from './PaginationDots';
import { useStyles } from './VehicleCardSlider.styles';

export interface Props {
  images: string[];
  interval?: number;
  className?: string;
  children?: JSX.Element;
  [key: string]: any;
}

export const VehicleCardSlider: FC<Props> = ({ images, children, className, interval = 1500, ...rest }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imageCount = useMemo(() => images.length, [images]);

  const handleChangeOnHover = (index: number | null) => {
    if (index === null) {
      setIsHovered(false);
    } else {
      setCurrentIndex(index);
      setIsHovered(true);
    }
  };

  const { root, sliderItem, sliderContainer, sliderTrack } = useStyles();

  const child = children ? React.Children.only(children) : null;

  const getCarouselItems = useCallback(() => {
    if (!imageCount) {
      return null;
    }

    return images.map((imageUrl: string, index: number) => {
      return (
        <div key={imageUrl} className={classNames(sliderItem, { active: index === currentIndex })}>
          {child ? (
            React.cloneElement(child, {
              ...(children ? children.props : {}),
              ...rest,
              src: imageUrl,
            })
          ) : (
            <ImageWebpGen {...rest} src={imageUrl} alt="Slider image" />
          )}
        </div>
      );
    });
  }, [images, currentIndex, imageCount, child]);

  return (
    <div className={classNames(root, className)}>
      {imageCount > 1 ? (
        <div className={sliderContainer}>
          <div className={sliderTrack}>{getCarouselItems()}</div>
          <PaginationDots
            count={imageCount}
            currentIndex={currentIndex}
            active={isHovered}
            onChange={handleChangeOnHover}
          />
        </div>
      ) : (
        getCarouselItems()
      )}
    </div>
  );
};
