import React from 'react';
import { TouchableOpacity, Text, ListRenderItem } from 'react-native';
import { categoryProductsRoute } from '../../../configs/routeName';
import { CategoryModel } from '../../../apollo/requests';
import { useNavigation } from '../../../hooks/navigation';
import { styles } from './Category.styles';
import { Image } from '../../../components/Image/Image';
import IMAGES from '../../../resources';

type Props = { category: CategoryModel };

const SubCategoryBase = ({ category }: Props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      key="container"
      style={styles.subCategory}
      onPress={(): boolean =>
        navigation.navigate(categoryProductsRoute, { id: category.id, title: category.name })
      }
    >
      <Text key="text" numberOfLines={1} style={styles.subCategoryText}>
        {category.name}
      </Text>
      <Image key="chevron" style={styles.subCategoryChevron} source={IMAGES.chevronRightGray} />
    </TouchableOpacity>
  );
};

export const SubCategory = React.memo<Props>(SubCategoryBase);

export const renderItem: ListRenderItem<Props> = info => <SubCategory {...info.item} />;
