import { CouponListItem, useDeletePromoCodeMutation } from '../../../apollo/requests';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../helpers/theme';
import { Loader } from '../../../components/Loader/Loader';
import { CloseIcon } from '../../../resources/svgs/close';
import React from 'react';

export const Coupon = ({ data }: { data: CouponListItem }) => {
  const [delCoupon, mutationState] = useDeletePromoCodeMutation({ variables: { coupon: data.id } });
  const handlePress = () => {
    delCoupon().catch(console.error);
  };
  return (
    <View
      style={{
        backgroundColor: theme.lightenGray,
        paddingVertical: theme.sizing(1),
        paddingHorizontal: theme.sizing(2),
        borderRadius: theme.sizing(2),
        borderWidth: 1,
        borderColor: theme.gray,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.gray }}>{data.id}</Text>
        <Text>{data.discountName}</Text>
      </View>
      <TouchableOpacity onPress={handlePress}>
        {mutationState.loading ? <Loader size="small" /> : <CloseIcon />}
      </TouchableOpacity>
    </View>
  );
};
