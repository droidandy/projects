import React from 'react';
import { Text } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import useDimensions from '../../../hooks/dimensions';
import { theme } from '../../../helpers/theme';

import { styles } from './Product.styles';

interface Props {
  description?: string | null;
}

export const Description: React.FC<Props> = ({ description }: Props) => {
  const dimensions = useDimensions();

  if (!description) {
    return null;
  }

  return (
    <>
      <Text key="description-title" style={[styles.paramLabel, styles.descriptionTitle]}>
        Инструкция
      </Text>
      <AutoHeightWebView
        key="webview"
        scalesPageToFit={false}
        bounces={false}
        scrollEnabled={false}
        originWhitelist={['*']}
        customStyle="body{font-family:SF UI Text,Roboto,Helvetica,sans-serif;position:fixed;}"
        source={{
          html: `
            <html lang="ru">
                <head>
                    <title>Описание</title>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body>${description}</body>
            </html>`,
        }}
        style={{
          display: 'flex',
          width: dimensions.window.width - theme.screenPadding.horizontal * 2,
          marginTop: theme.sizing(2),
          marginBottom: theme.screenPadding.vertical,
          minHeight: 300,
        }}
      />
    </>
  );
};
