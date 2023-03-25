import React, { PropsWithChildren, useContext } from 'react';
import { callTo } from '../../helpers/helpers';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './PharmacyRender.styles';
import { Image } from '../Image/Image';
import { ListPharmacyFragment } from '../../apollo/requests';
import { MapContext } from '../../contexts/map';
import IMAGES from '../../resources';

type Props = PropsWithChildren<{ pharmacy: ListPharmacyFragment }>;

export const PharmacyRender: React.FC<Props> = ({ pharmacy, children }: Props) => {
  const { flyTo } = useContext(MapContext);
  const { title, address, metro, phone } = pharmacy;

  return (
    <TouchableOpacity
      key="container"
      style={styles.container}
      onPress={() => {
        if (pharmacy.coordinate) {
          flyTo(pharmacy.coordinate);
        }
      }}
    >
      <View key="left" style={styles.left}>
        <View key="info" style={styles.info}>
          <View key="title" style={styles.infoTitle}>
            <Text style={styles.infoTitleText}>{title}</Text>
          </View>
          <View key="address" style={styles.infoAddress}>
            <Text style={styles.infoAddressText}>{address}</Text>
          </View>
        </View>
        {!!metro ? (
          <View key="metro" style={styles.metro}>
            <Image key="icon" source={IMAGES.metro} style={styles.metroIcon} />
            <Text key="name" style={styles.metroText}>
              {metro}
            </Text>
          </View>
        ) : null}
        {phone ? (
          <View key="phone" style={styles.phone}>
            <TouchableOpacity onPress={() => callTo(phone).catch(console.error)}>
              <Text style={styles.phoneText}>телефон: {phone}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <View key="right" style={styles.right}>
        {children}
      </View>
    </TouchableOpacity>
  );
};
