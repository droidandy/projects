import { SvgIconProps } from './types';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../helpers/theme';
import React from 'react';
import { Button, ButtonProps } from '../../components/buttons/Button/Button';
import { ProductModel, useToggleProductInWishlistMutation } from '../../apollo/requests';

export const NotifyIcon = ({ active = false, width = 19.322, height = 17.219 }: SvgIconProps) => {
  const fill = active ? theme.green : '#ffffff';
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 19.322 17.219"
      style={{ marginRight: theme.sizing(1) }}
    >
      <Path
        d="M8.143,1.429A.141.141,0,0,1,8,1.571,1.574,1.574,0,0,1,6.429,0a.141.141,0,0,1,.143-.143A.141.141,0,0,1,6.714,0,1.292,1.292,0,0,0,8,1.286.141.141,0,0,1,8.143,1.429Zm7.286-2.571c-1.321-1.116-2.857-3.116-2.857-7.429a4.224,4.224,0,0,0-3.786-3.938.9.9,0,0,0,.071-.348A.857.857,0,0,0,8-13.714a.857.857,0,0,0-.857.857.9.9,0,0,0,.071.348A4.224,4.224,0,0,0,3.429-8.571c0,4.313-1.536,6.313-2.857,7.429A1.151,1.151,0,0,0,1.714,0h4A2.29,2.29,0,0,0,8,2.286,2.29,2.29,0,0,0,10.286,0h4A1.151,1.151,0,0,0,15.429-1.143Z"
        transform="translate(1.668 14.933)"
        fill={fill}
      />
      {active ? (
        <Path
          d="M1735.631-526c-3.931,1.514-3.44,6.183-2.949,7.657"
          transform="translate(-1731.332 526.933)"
          fill="none"
          stroke={fill}
          stroke-width="2"
        />
      ) : null}
      {active ? (
        <Path
          d="M1732.354-526c3.931,1.514,3.44,6.183,2.949,7.657"
          transform="translate(-1717.331 526.933)"
          fill="none"
          stroke={fill}
          stroke-width="2"
        />
      ) : null}
    </Svg>
  );
};

type Props = Omit<ButtonProps, 'title'> & { product: ProductModel };

export const NotifyButton = ({ product, style }: Props) => {
  const [mutate, state] = useToggleProductInWishlistMutation({ variables: { id: product.id } });
  const title = product.inWishlist ? 'Сообщим' : 'Сообщить';
  const handlePress = () => {
    mutate().catch(console.error);
  };
  return (
    <Button
      loading={state.loading}
      title={title.toUpperCase()}
      style={style}
      startAdornment={<NotifyIcon active={product.inWishlist} />}
      type={product.inWishlist ? 'outlined' : 'filled'}
      onPress={handlePress}
    />
  );
};
