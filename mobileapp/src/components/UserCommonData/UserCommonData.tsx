import React from 'react';
import { Text, View } from 'react-native';
import { getImageUrl } from '../../configs/environments';
import { useGetUserQuery } from '../../apollo/requests';
import { Image } from '../Image/Image';
import { Link } from '../buttons/Link/Link';
import { styles } from './UserCommonData.styles';
import { useCity } from '../../contexts/common-data-provider';
import IMAGES from '../../resources';

interface Props {
  showLocation?: boolean;
}

const UserCommonDataBase: React.FC<Props> = ({ showLocation }: Props) => {
  const { data, loading } = useGetUserQuery();
  const city = useCity();

  const userName = data?.user.name;
  const userSecondName = data?.user.secondName;
  const userLastName = data?.user.lastName;

  return (
    <View key="user" style={styles.user}>
      <View key="photo" style={styles.photo}>
        <Image
          key="image"
          source={
            data?.user.personalPhoto
              ? { uri: getImageUrl(data?.user.personalPhoto) }
              : IMAGES.noUserPhoto
          }
          style={styles.image}
        />
      </View>
      <View key="info" style={styles.info}>
        <View key="full-name" style={styles.fullName}>
          <Text key="second-name" style={styles.fullNameText}>
            {loading
              ? 'Данные загружаются'
              : userSecondName
              ? userSecondName
              : `${userName ? userName : ''} ${userLastName ? userLastName : ''}`}
          </Text>
          <View key="first-third-name" style={styles.secondThirdName}>
            <Text style={styles.fullNameText}>
              {userSecondName
                ? `${userName ? userName : ''} ${userLastName ? userLastName : ''}`
                : ''}
            </Text>
          </View>
        </View>
        {showLocation ? (
          <View key="location" style={styles.location}>
            <Link
              key="link-location"
              title={city.name}
              link="LocationChange"
              underline="none"
              textStyle={styles.linkText}
              startAdornment={<Image key="icon" source={IMAGES.locationGray} style={styles.icon} />}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export const UserCommonData = React.memo<Props>(UserCommonDataBase);
