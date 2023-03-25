import React, { FC } from 'react';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { useStyles } from './Photos.styles';

interface Props {
  images: Record<string, string>[];
}

export const Photos: FC<Props> = ({ images }) => {
  const s = useStyles();
  return (
    <div className={s.root}>
      {images.map((image) => {
        const dimension = Object.keys(image)[0];

        return (
          <div className={s.imageWrapper}>
            <ImageWebpGen aspect="16/10" contain src={image['350'] || image[dimension]} alt="car" />
          </div>
        );
      })}
    </div>
  );
};
