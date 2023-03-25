import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { ListPharmacyFragment } from '../../apollo/requests';
import { PharmacyRender } from './PharmacyRender';
import { Image } from '../Image/Image';
import { MapContext } from '../../contexts/map';
import IMAGES from '../../resources';

export interface PharmacyCartItemProps {
  pharmacyData: ListPharmacyFragment;
  activePharmacy?: ListPharmacyFragment;

  onPress?(data: ListPharmacyFragment): void;

  fly?: boolean;
}

const PharmacyCartItemBase: React.FC<PharmacyCartItemProps> = ({
  pharmacyData,
  activePharmacy,
  onPress,
  fly,
}: PharmacyCartItemProps) => {
  const { flyTo } = useContext(MapContext);
  const action = () => {
    onPress && onPress(pharmacyData);
    fly && flyTo(pharmacyData.coordinate);
  };
  return (
    <PharmacyRender pharmacy={pharmacyData}>
      <TouchableOpacity key="name" onPress={action}>
        <Image
          source={
            activePharmacy?.xmlId === pharmacyData.xmlId
              ? IMAGES.cartPharmacyChecked
              : IMAGES.cartPharmacy
          }
        />
      </TouchableOpacity>
    </PharmacyRender>
  );
};

export const PharmacyCartItem = React.memo<PharmacyCartItemProps>(PharmacyCartItemBase);
