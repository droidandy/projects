import React, { useEffect, useRef } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { InputSquared } from '../../../components/inputs/InputSquared/InputSquared';
import { Image } from '../../../components/Image/Image';
import { headerDimensionsWidth, headerStyles as styles } from './SearchHeader.styles';
import useDimensions from '../../../hooks/dimensions';
import IMAGES from '../../../resources';
import { useSearch } from '../../../contexts/common-data-provider';
import { useNavigation } from '../../../hooks/navigation';
import { searchRoute } from '../../../configs/routeName';
import { StatusBar } from 'expo-status-bar';

export const SearchHeader = () => {
  const { search, setSearch } = useSearch();
  const nav = useNavigation();
  const inputRef = useRef<TextInput>(null);
  const dimensions = useDimensions();

  useEffect(() => {
    const unsub = nav.addListener('didFocus', () => {
      if (nav.state.routeName.toLowerCase() === searchRoute.toLowerCase()) {
        inputRef.current?.focus();
      }
    });
    return unsub.remove;
  }, [nav]);

  const onSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    Keyboard.dismiss();
    console.log('search:', e.nativeEvent.text);
    setSearch(e.nativeEvent.text);
  };

  return (
    <View
      key="header"
      style={[headerDimensionsWidth(dimensions.window.width).headerWidth, styles.header]}
    >
      <StatusBar translucent style="auto" />
      <InputSquared
        key="input"
        autoFocus={true}
        ref={inputRef}
        autoCorrect={false}
        keyboardType="web-search"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        placeholder="Найти препарат"
        inputStyle={styles.headerInput}
        defaultValue={search}
        startAdornment={
          <Image key="icon" source={IMAGES.searchGray} style={styles.headerInputIcon} />
        }
        endAdornment={
          search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Image key="clear" source={IMAGES.photoRemove} style={styles.headerClearIcon} />
            </TouchableOpacity>
          ) : null
        }
        onChangeText={setSearch}
      />
    </View>
  );
};
