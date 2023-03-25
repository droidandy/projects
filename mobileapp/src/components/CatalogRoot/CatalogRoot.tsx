import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { getImageUrl } from '../../configs/environments';
import { childrenCategoriesRoute } from '../../configs/routeName';
import { theme } from '../../helpers/theme';
import { keyExtractor } from '../../helpers/models';
import useDimensions from '../../hooks/dimensions';
import { useNavigation } from '../../hooks/navigation';
import { CategoryModel, useGetCatalogRootQuery } from '../../apollo/requests';
import { Image } from '../Image/Image';
import { getImageStyles, getItemStyles, styles } from './CatalogRoot.styles';
import { DataChecker } from '../DataChecker/DataChecker';
import { DataContainer } from '../../containers/layouts/DataContainer/DataContainer';

interface Props extends ViewProps {
  useSimpleContainer?: boolean;
}

export const CatalogRoot = ({ useSimpleContainer, style, ...rest }: Props) => {
  const { data, loading, error, refetch } = useGetCatalogRootQuery({
    notifyOnNetworkStatusChange: true,
  });
  const navigation = useNavigation();
  const dimensions = useDimensions();
  const itemStyle = useMemo(() => getItemStyles(dimensions.window.width), [
    dimensions.window.width,
  ]);
  const imageStyle = useMemo(() => getImageStyles(dimensions.window.width), [
    dimensions.window.width,
  ]);
  const categories = data?.categories || [];

  const content = (
    <View {...rest} key="container" style={[styles.container, style]}>
      {categories.length
        ? categories.map((item: CategoryModel, index: number) => {
            return (
              <TouchableOpacity
                key={keyExtractor(item, index)}
                activeOpacity={theme.opacity.active}
                style={itemStyle}
                onPress={() =>
                  navigation.navigate(childrenCategoriesRoute, { title: item.name, id: item.id })
                }
              >
                <Image key="image" source={{ uri: getImageUrl(item.image) }} style={imageStyle} />
                <Text key="text" style={styles.itemLabel} numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })
        : null}
    </View>
  );

  return (
    <DataChecker
      key="data-checker"
      loading={loading}
      data={categories}
      error={error}
      loadingLabel="Загрузка списка категорий"
      noDataLabel="Не удалось загрузить список категорий"
      useSimpleContainer={useSimpleContainer}
      refetch={useSimpleContainer ? undefined : refetch}
    >
      {useSimpleContainer ? (
        content
      ) : (
        <DataContainer key="container" contentStyle={styles.content}>
          {content}
        </DataContainer>
      )}
    </DataChecker>
  );
};
