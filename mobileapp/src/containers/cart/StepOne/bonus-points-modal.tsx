import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, Slider, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../helpers/theme';
import { Input } from '../../../components/inputs/Input/Input';
import { clamp } from '../../../helpers/helpers';
import IMAGES from '../../../resources';
import { Button } from '../../../components/buttons/Button/Button';

export const ModalBonusPoints = ({
  close,
  visible,
  available = 568,
}: {
  close: () => void;
  visible: boolean;
  available?: number;
}) => {
  const [value, setValue] = useState(0);
  const handleSubmit = () => {
    setTimeout(() => Alert.alert('Not implemented'), 300);
    close();
  };
  return (
    <Modal
      visible={visible}
      animationType={'fade'}
      presentationStyle={'overFullScreen'}
      transparent={true}
      onRequestClose={close}
    >
      <SafeAreaView
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0009',
          width: '100%',
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={close}
          style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{
              backgroundColor: 'white',
              width: '95%',
              borderRadius: 20,
            }}
            onStartShouldSetResponder={() => true}
          >
            <View style={{ padding: 20, borderBottomColor: '#efefef', borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 17, textAlign: 'center' }}>Списание Бонусных рублей</Text>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: theme.green, fontSize: 15 }}>
                Вам доступны {available} руб.
              </Text>
              <Text style={{ color: '#0007', marginTop: 10, textAlign: 'center' }}>
                Бонусными рублями можно оплатить{'\n'} до 50% покупки
              </Text>
              <Input
                keyboardType="numeric"
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  width: theme.sizing(12),
                  textAlign: 'center',
                }}
                value={`${value}`}
                onChangeText={t => {
                  const newValue = parseInt(t);
                  if (isNaN(newValue)) {
                    setValue(0);
                  } else {
                    setValue(clamp(newValue, 0, available));
                  }
                }}
              />
              <Slider
                value={value}
                minimumValue={0}
                maximumValue={available}
                style={{ width: '100%', marginTop: 10 }}
                thumbImage={IMAGES.slider.thumb}
                minimumTrackTintColor={theme.green}
                maximumTrackTintColor="#F8F5F5"
                onValueChange={x => setValue(Math.ceil(x))}
              />
              <Button
                disabled={value === 0}
                title="Применить"
                style={{ marginTop: 20 }}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};
