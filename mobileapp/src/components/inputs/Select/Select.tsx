import React, { useMemo } from 'react';
import { View } from 'react-native';
import RNPickerSelect, { PickerProps } from 'react-native-picker-select';
import { theme } from '../../../helpers/theme';
import { Image } from '../../Image/Image';
import { styles } from './Select.styles';
import IMAGES from '../../../resources';

export interface SelectProps extends PickerProps {
  placeholder?: string;
}

const chevron = () => <Image source={IMAGES.chevronDownGray} />;

const SelectBase: React.FC<SelectProps> = (props: SelectProps) => {
  const placeholder = useMemo(
    () =>
      props.placeholder
        ? {
            label: props.placeholder,
            color: '#9EA0A4',
          }
        : undefined,
    [props.placeholder],
  );

  return (
    <View key="container" style={styles.container}>
      <RNPickerSelect
        {...props}
        key="select"
        placeholder={placeholder}
        style={{
          inputAndroid: {
            backgroundColor: 'transparent',
            color: theme.green,
            padding: theme.sizing(2),
            height: theme.sizing(6),
          },
          inputIOS: {
            color: theme.green,
            padding: theme.sizing(2),
            height: theme.sizing(6),
          },
          iconContainer: {
            top: theme.sizing(1.6),
            right: theme.sizing(2),
          },
        }}
        useNativeAndroidPickerStyle={false}
        Icon={chevron}
      />
    </View>
  );
};

export const Select = React.memo<SelectProps>(SelectBase);
