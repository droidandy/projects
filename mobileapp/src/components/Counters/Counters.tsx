import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from './Counters.styles';
import { Image } from '../Image/Image';
import IMAGES from '../../resources';
import {
  CartItemFragment,
  CartItemWithProductFragment,
  EditCartAction,
  useUpdateCartMutation,
} from '../../apollo/requests';
import { clamp } from '../../helpers/helpers';

interface Props {
  // quantity: number;
  // onPressMinus: () => void;
  // onPressPlus: () => void;
  // loading?: boolean;
  cartItem: CartItemWithProductFragment | CartItemFragment;
}

export const Counters = ({ cartItem }: Props) => {
  const [doUpdateCart, { loading }] = useUpdateCartMutation();
  const quantity = cartItem.quantity || 0;
  const [q, sQ] = useState(quantity);

  const handleChangeQuantityText = text => {
    if (text.length > 3) {
      text = text.substr(0, 3);
    }
    let q = parseInt(text);
    if (isNaN(q) || q < 0) {
      q = 0;
    }
    sQ(q);
  };

  useEffect(() => {
    sQ(quantity);
  }, [quantity]);

  const onPressMinus = () => {
    if (quantity > 1) {
      doUpdateCart({
        variables: {
          productId: Number(cartItem.productId),
          quantity: quantity - 1,
          editAction: EditCartAction.UpdateQuantity,
        },
      }).catch(console.error);
    }
  };
  const onPressPlus = () => {
    doUpdateCart({
      variables: {
        productId: Number(cartItem.productId),
        quantity: quantity + 1,
        editAction: EditCartAction.UpdateQuantity,
      },
    }).catch(console.error);
  };

  const handleSubmitEditing = _ => {
    if (q === 0) {
      sQ(quantity);
      return;
    }

    doUpdateCart({
      variables: {
        productId: cartItem.productId,
        quantity: q,
        editAction: EditCartAction.UpdateQuantity,
      },
    })
      .then(value => {
        const newValue = value.data?.updateCart.items.find(x => x.productId === cartItem.productId);
        if (newValue) {
          console.log('123', newValue);
          sQ(newValue.quantity);
        } else {
          console.log('12312213123', newValue, value);
        }
      })
      .catch(console.error);
  };

  return (
    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity disabled={loading} onPress={onPressMinus}>
            <Image style={styles.touchable} key="minus" source={IMAGES.minus} />
          </TouchableOpacity>
        </View>
        <TextInput
          editable={!loading}
          style={[styles.quantity, { textAlign: 'center' }]}
          keyboardType="numeric"
          value={`${q}`}
          onChangeText={handleChangeQuantityText}
          onEndEditing={handleSubmitEditing}
          clearTextOnFocus
        />
        <View>
          <TouchableOpacity disabled={loading} onPress={onPressPlus}>
            <Image style={styles.touchable} key="minus" source={IMAGES.plus} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
