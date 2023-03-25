import React from 'react';
import { FlatList, StyleProp, View, ViewStyle } from 'react-native';
import { ListProductFragment } from '../../apollo/requests';
import { keyExtractor } from '../../helpers/models';
import { SeparatorDash } from '../SeparatorDash/SeparatorDash';
import { styles } from './ProductsList.styles';
import { ProductListItem } from './ProductListItem';

interface Props {
  style?: ViewStyle;
  listContentStyle?: StyleProp<ViewStyle>;

  /**
   * Свойство отключающее сопутствующее оформление со скроллом (вроде отскока в ios), но
   * оставляющее сам вертикальный скролл, так его отключить нельзя, только растянув элемент на
   * высоту всех вложенных элементов.
   */
  scroll?: boolean;

  /**
   * Список отображаемых товаров
   */
  data: ListProductFragment[];
}

export const ProductsList = ({ style, listContentStyle, scroll = true, data }: Props) => {
  return (
    <View key="container" style={[style, styles.container]}>
      <FlatList
        key="list"
        style={styles.list}
        contentContainerStyle={listContentStyle}
        data={data}
        renderItem={info => <ProductListItem product={info.item} />}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={SeparatorDash}
        alwaysBounceVertical={scroll}
      />
    </View>
  );
};
