import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Img, Icon } from '@marketplace/ui-kit';
import Input, { Props } from '@marketplace/ui-kit/components/Input';
import { ReactComponent as IconDeleteRed } from '@marketplace/ui-kit/icons/icon-delete-red.svg';
import { useStyles } from './InputYouTubeVideo.styles';

const getVideoId = (url = '') => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

interface InputYouTubeProps extends Props {
  handleClearClick?: () => void;
}

export const InputYouTubeVideo: FC<InputYouTubeProps> = ({ handleChange, handleClearClick, value, ...rest }) => {
  const s = useStyles();
  const [thumbnailImgUrl, setThumbnailImgUrl] = useState('');
  const localHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (handleChange) {
      handleChange(e);
    }
    if (e.target.value) {
      const videoId = getVideoId(e.target.value);
      setThumbnailImgUrl(videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : '');
    } else {
      setThumbnailImgUrl('');
    }
  };
  useEffect(() => {
    if (value) {
      const videoId = getVideoId(`${value}`);
      setThumbnailImgUrl(videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : '');
    } else {
      setThumbnailImgUrl('');
    }
  }, [value]);

  return (
    <div className={s.root}>
      <Input placeholder="Ссылка на видео с Youtube" {...rest} value={value} handleChange={localHandleChange} />
      {thumbnailImgUrl && (
        <div className={s.imgWrapper}>
          <Img src={thumbnailImgUrl} alt="youtube video preview" />
        </div>
      )}
      {thumbnailImgUrl && (
        <div className={s.iconDeleteWrapper}>
          <Icon onClick={handleClearClick} viewBox="0 0 20 20" className={s.iconDelete} component={IconDeleteRed} />
        </div>
      )}
    </div>
  );
};
