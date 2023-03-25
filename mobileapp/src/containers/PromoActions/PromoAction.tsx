import { useNavigation } from '../../hooks/navigation';
import { useGetPromoActionsQuery } from '../../apollo/requests';
import { DataChecker } from '../../components/DataChecker/DataChecker';
import { DataContainer } from '../layouts/DataContainer/DataContainer';
import { styles } from '../catalog/Product/Product.styles';
import { Text, View } from 'react-native';
import React from 'react';
import { getImageUrl } from '../../configs/environments';
import { sliderBottomImageSizes } from '../Main/Main.styles';
import { Image } from '../../components/Image/Image';
import { ProductListItem } from '../../components/product/ProductListItem';
import { SeparatorDash } from '../../components/SeparatorDash/SeparatorDash';
import { theme } from '../../helpers/theme';
import AutoHeightWebView from 'react-native-autoheight-webview';

export const PromoAction = () => {
  const navigation = useNavigation();

  const id = navigation.state?.params?.id;
  const { data, loading, error, refetch } = useGetPromoActionsQuery({ fetchPolicy: 'cache-first' });

  const promo = data?.promoActions.find(promo => promo.id === id);

  if (loading || !promo || error) {
    return (
      <DataChecker
        key="data-checker"
        loading={loading}
        data={promo}
        error={error}
        loadingLabel="Загрузка информации об акции"
        noDataLabel="Акция не найдена"
        refetch={refetch}
      />
    );
  }

  const showDescription = !!promo.detailText.trim();

  console.log(promo.detailText);

  return (
    <>
      <DataContainer key="container" contentStyle={styles.content}>
        <Image
          key="image"
          source={{ uri: getImageUrl(promo.preview) }}
          style={{
            width: '100%',
            aspectRatio: sliderBottomImageSizes.aspect,
            resizeMode: 'cover',
          }}
        />
        <Text
          style={{
            marginVertical: theme.sizing(2),
            fontSize: 18,
            fontWeight: '600',
            fontFamily: theme.fonts.productHeading,
          }}
        >
          {promo.name}
        </Text>

        {showDescription ? (
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
                <body>${promo.detailText}</body>
            </html>`,
            }}
            style={{
              display: 'flex',
              width: '100%',
              marginTop: theme.sizing(2),
              marginBottom: theme.screenPadding.vertical,
              minHeight: 50,
            }}
          />
        ) : null}

        <View
          style={{
            width: '100%',
            marginTop: theme.sizing(6),
          }}
        >
          {promo.products.map(x => (
            <React.Fragment key={x.id}>
              <ProductListItem product={x} />
              <SeparatorDash />
            </React.Fragment>
          ))}
        </View>
      </DataContainer>
    </>
  );
};
