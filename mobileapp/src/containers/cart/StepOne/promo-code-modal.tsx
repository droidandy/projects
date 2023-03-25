import React, { useState } from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../helpers/theme';
import { Input } from '../../../components/inputs/Input/Input';
import { Button } from '../../../components/buttons/Button/Button';
import { useAddPromoCodeMutation } from '../../../apollo/requests';

export const ModalPromoCode = ({ close, visible }: { close: () => void; visible: boolean }) => {
  const [value, setValue] = useState('');
  const [addCoupon, mutationState] = useAddPromoCodeMutation();
  const handleSubmit = () => {
    addCoupon({ variables: { coupon: value } })
      .then(close)
      .catch(console.error);
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
              <Text style={{ fontSize: 17, textAlign: 'center' }}>Промо код</Text>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: theme.green, marginBottom: 20, textAlign: 'center' }}>
                Введите промо-код, чтобы узнать{'\n'}Вашу персональную скидку
              </Text>
              <Input
                keyboardType="default"
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  width: '100%',
                  textAlign: 'center',
                }}
                value={`${value}`}
                onChangeText={t => {
                  const newValue = t.trim();
                  setValue(newValue);
                }}
              />
              <Button
                loading={mutationState.loading}
                disabled={value === ''}
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
