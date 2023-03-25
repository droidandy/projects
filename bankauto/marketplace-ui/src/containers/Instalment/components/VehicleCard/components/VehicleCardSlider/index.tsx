import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { ImageWebpGen } from 'components/ImageWebpGen';
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
  const timerId = useRef<number | any | null>(null);
  const imageCount = useMemo(() => images.length, [images]);

  const { root, sliderItem } = useStyles();

  const goNext = useCallback(
    (maxCount) => {
      return () => {
        setCurrentIndex((prevIndex) => {
          return prevIndex + 1 === maxCount ? 0 : prevIndex + 1;
        });
      };
    },
    [isHovered],
  );

  useEffect(() => {
    if (isHovered) {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
      timerId.current = setInterval(goNext(imageCount), interval);
    } else if (timerId.current && !isHovered) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [isHovered, interval]);

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
            <ImageWebpGen {...rest} src={imageUrl} />
          )}
        </div>
      );
    });
  }, [images, currentIndex, imageCount, child]);

  return <div className={classNames(root, className)}>{getCarouselItems()}</div>;
};
