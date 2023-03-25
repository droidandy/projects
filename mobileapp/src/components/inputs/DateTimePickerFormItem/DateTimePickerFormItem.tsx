import React, { useCallback, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { FormItem, FormItemCommonProps } from '../../FormItem/FormItem';
import { Event } from '@react-native-community/datetimepicker/src';
import { Image } from '../../Image/Image';
import { styles } from './DateTimePickerFormItem.styles';
import IMAGES from '../../../resources';

interface Props extends FormItemCommonProps {
  placeholder?: string;
  value?: Date;

  onChange(newValue?: Date): void;
}

export const DateTimePickerFormItem: React.FC<Props> = ({
  itemStartAdornment,
  itemEndAdornment,
  itemStyle,
  placeholder,
  value,
  onChange,
}: Props) => {
  const [isPickerShow, setPickerShow] = useState(false);
  const onChangeMemoized = useCallback(
    (event: Event, date?: Date) => {
      if (Platform.OS === 'android') {
        setPickerShow(false);
      }
      onChange(date);
    },
    [onChange, setPickerShow],
  );
  const valueIsDate = value instanceof Date;
  const dateValue: Date = valueIsDate ? value! : new Date();

  return (
    <View key="container">
      <FormItem
        startAdornment={itemStartAdornment}
        endAdornment={itemEndAdornment}
        style={[
          itemStyle,
          Platform.OS === 'ios' && isPickerShow ? styles.formItemOpened : undefined,
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.input}
          onPress={() => setPickerShow(!isPickerShow)}
        >
          <View key="label">
            <Text style={styles.inputText}>
              {!!value && valueIsDate
                ? `${('0' + value.getDate()).slice(-2)}.${('0' + (value.getMonth() + 1)).slice(
                    -2,
                  )}.${value.getFullYear()}`
                : placeholder
                ? placeholder
                : ''}
            </Text>
          </View>
          <View key="icon">
            <Image source={IMAGES.calendar} />
          </View>
        </TouchableOpacity>
      </FormItem>
      {isPickerShow ? (
        <RNDateTimePicker
          key="picker"
          value={dateValue}
          onChange={onChangeMemoized}
          mode="date"
          display="default"
          style={{
            marginHorizontal: -16,
          }}
        />
      ) : null}
    </View>
  );
};
