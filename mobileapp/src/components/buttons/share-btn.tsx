import React from 'react';
import { Share, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ShareIcon } from '../../resources/svgs';

type ShareBtnProps = TouchableOpacityProps & {
  url: string;
  title?: string;
};

const insets = { top: 10, left: 10, right: 10, bottom: 10 };

export const ShareButton = ({ style, url, title }: ShareBtnProps) => {
  const share = async () => {
    try {
      const result = await Share.share({
        message: url,
        title,
        url,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TouchableOpacity style={style} hitSlop={insets} onPress={share}>
      <ShareIcon />
    </TouchableOpacity>
  );
};
