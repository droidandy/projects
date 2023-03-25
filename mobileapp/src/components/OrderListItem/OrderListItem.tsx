import React from 'react';
import { ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import { OrderModel } from '../../apollo/requests';
import { styles } from './OrderListItem.styles';
import { Image } from '../Image/Image';
import { orderRoute } from '../../configs/routeName';
import { useNavigation } from '../../hooks/navigation';
import { theme } from '../../helpers/theme';
import IMAGES from '../../resources';

type Props = Pick<
  OrderModel,
  'id' | 'dateInsert' | 'isPossibleCancel' | 'statusName' | 'statusColor' | '__typename'
>;

const OrderItemBase = ({ id, dateInsert, statusName, statusColor }: Props) => {
  const navigation = useNavigation();
  return (
    <View key="container" style={styles.container}>
      <TouchableOpacity
        style={styles.container}
        key="order"
        onPress={(): boolean => navigation.navigate(orderRoute, { id, title: `№ ${id}` })}
      >
        <View key="left" style={styles.left}>
          <Text style={styles.orderNumber} key={`id-${id}`}>
            № {id}
          </Text>
          <Text style={styles.dateIns} key={`date-ins-${id}`}>
            от {dateInsert}
          </Text>
        </View>
        <View key="right" style={styles.right}>
          <View key="container" style={[styles.textRightContainer]}>
            <View key="left" style={styles.left}>
              <Image style={styles.chevronIcon} key="chevron" source={IMAGES.chevronRightGray} />
            </View>
            <View key="right" style={styles.right}>
              <Text
                style={[styles.statusName, { color: statusColor || theme.black }]}
                key={`status-${id}`}
              >
                {statusName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const OrderListItem = React.memo<Props>(OrderItemBase);

export const OrderListRenderItem: ListRenderItem<Props> = info => <OrderListItem {...info.item} />;
