/* eslint-disable */
import React, { useEffect, useReducer, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { theme } from '../../helpers/theme';
import { clearLogin, isPhoneValid } from '../../helpers/string';
import {
  GetUserDocument,
  GetUserQuery,
  GetUserQueryVariables,
  Sex,
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserPhotoMutation,
} from '../../apollo/requests';
import { getImageUrl } from '../../configs/environments';
import { useNavigation } from '../../hooks/navigation';
import { DataContainer } from '../layouts/DataContainer/DataContainer';
import { Button } from '../../components/buttons/Button/Button';
import { Image } from '../../components/Image/Image';
import { DataChecker } from '../../components/DataChecker/DataChecker';
import { SeparatorDash } from '../../components/SeparatorDash/SeparatorDash';
import { InputFormItem } from '../../components/inputs/InputFormItem/InputFormItem';
import { SelectFormItem } from '../../components/inputs/SelectFormItem/SelectFormItem';
import { DateTimePickerFormItem } from '../../components/inputs/DateTimePickerFormItem/DateTimePickerFormItem';
import { initialState, reducer } from './SettingsPersonal.reducer';
import { styles } from './SettingsPersonal.styles';
import IMAGES from '../../resources';
import { Loader } from '../../components/Loader/Loader';

const sex = [
  {
    label: 'Мужской',
    value: Sex.Male,
  },
  {
    label: 'Женский',
    value: Sex.Female,
  },
];

type Vars = {
  login: string;
  email: string;
  name?: string;
  personal_birthday?: Date;
  second_name?: string;
  last_name?: string;
  personal_gender?: Sex;
  personal_phone?: string;
};

const getPermissionAsync = async (): Promise<void> => {
  if (Constants.platform?.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert('К сожалению, нам нужны разрешения для доступа к изображениям!');
    }
  }
};

// TODO: убрать эти костыли (разобраться с типами на бэке)
function nullToUndefined<T>(v: T | null | undefined): T | undefined {
  return v === null ? undefined : v;
}

const SettingsPersonalBase: React.FC = () => {
  const navigation = useNavigation();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // const [image, setImage] = useState<Maybe<string>>(null);
  // const [hasDeleteImage, setHasDeleteImage] = useState(false);
  const { data, loading, error, refetch } = useGetUserQuery({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [doUpdateUser] = useUpdateUserMutation();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (data && !state.initialized) {
      const {
        login,
        name,
        email,
        secondName,
        lastName,
        personalBirthday,
        personalGender,
        personalPhone,
      } = data.user;
      let personal_birthday: Date | undefined = undefined;

      if (typeof personalBirthday === 'string' && personalBirthday !== '') {
        const parsedBirthday = personalBirthday.split('.');
        personal_birthday = new Date(
          Date.UTC(
            parseInt(parsedBirthday[2], 10),
            parseInt(parsedBirthday[1], 10) - 1,
            parseInt(parsedBirthday[0], 10),
          ),
        );
      }

      dispatch({
        type: 'Init',
        payload: {
          login,
          email,
          name,
          personal_birthday,
          second_name: secondName,
          last_name: lastName,
          personal_gender: personalGender as Sex,
          personal_phone: personalPhone?.toString(),
        },
      });
    }
  }, [data, state.initialized]);

  useEffect(() => {
    getPermissionAsync().catch(console.error);
  });

  return (
    <DataChecker
      key="data-checker"
      loading={loading}
      data={data?.user}
      error={error}
      loadingLabel="Загрузка информации о пользователе"
      noDataLabel="Не удалось загрузить информацию о пользователе"
      refetch={refetch}
    >
      <DataContainer
        key="container"
        contentStyle={styles.content}
        footerTopAdornment={
          <Button
            title="Сохранить изменения"
            style={styles.bottomButton}
            disabled={isSaving}
            loading={isSaving}
            onPress={(): void => {
              const variables: Vars = {
                login: state?.login,
                email: state?.email,
                name: nullToUndefined(state.name),
                personal_birthday: nullToUndefined(state.personal_birthday),
                second_name: nullToUndefined(state.second_name),
                last_name: nullToUndefined(state.last_name),
                personal_gender: nullToUndefined(state.personal_gender),
                personal_phone: state?.personal_phone
                  ? clearLogin(state.personal_phone)
                  : undefined,
              };

              setIsSaving(true);
              doUpdateUser({
                variables,
                refetchQueries: [
                  {
                    query: GetUserDocument,
                  },
                ],
              })
                .then(() => {
                  navigation.goBack();
                })
                .catch(console.log)
                .finally(() => setIsSaving(false));
            }}
          />
        }
      >
        <EditUserPhoto photo={data?.user.personalPhoto} />
        <KeyboardAwareScrollView
          extraScrollHeight={12}
          enableAutomaticScroll={true}
          enableOnAndroid={true}
        >
          <View key="full-name">
            <InputFormItem
              key="first-name"
              placeholder="Имя"
              value={nullToUndefined(state.name)}
              style={styles.fieldInput}
              onChangeText={(text: string): void => dispatch({ type: 'name', payload: text })}
              itemStartAdornment={
                <View key="icon" style={styles.fieldIcon}>
                  <Image source={IMAGES.contacts} />
                </View>
              }
            />
            <InputFormItem
              key="third-name"
              placeholder="Отчество"
              value={nullToUndefined(state.last_name)}
              style={styles.fieldInput}
              onChangeText={(text: string): void => dispatch({ type: 'last_name', payload: text })}
              itemStartAdornment={<View key="icon" style={styles.fieldIcon} />}
            />
            <InputFormItem
              key="second-name"
              placeholder="Фамилия"
              value={nullToUndefined(state.second_name)}
              style={styles.fieldInput}
              onChangeText={(text: string): void =>
                dispatch({ type: 'second_name', payload: text })
              }
              itemStartAdornment={<View key="icon" style={styles.fieldIcon} />}
              itemStyle={styles.lastField}
            />
          </View>
          <SeparatorDash key="separator" />
          <View key="additional-data">
            <SelectFormItem
              key="sex"
              placeholder="Выберите пол"
              items={sex}
              onValueChange={(value): void => {
                dispatch({ type: 'personal_gender', payload: value });
              }}
              value={state.personal_gender}
              itemStartAdornment={
                <View key="icon" style={styles.fieldIcon}>
                  <Image source={IMAGES.man} />
                </View>
              }
            />
            <DateTimePickerFormItem
              key="birthday"
              placeholder="Дата рождения"
              value={state.personal_birthday}
              onChange={(value): void => {
                dispatch({ type: 'personal_birthday', payload: value });
              }}
              itemStartAdornment={
                <View key="icon" style={styles.fieldIcon}>
                  <Image source={IMAGES.calendar} />
                </View>
              }
            />
            <InputFormItem
              key="email"
              placeholder="Эл. почта"
              value={data?.user.email}
              editable={false}
              style={styles.fieldInput}
              itemStartAdornment={
                <View key="icon" style={styles.fieldIcon}>
                  <Image source={IMAGES.mail} />
                </View>
              }
            />
            <InputFormItem
              key="phone"
              placeholder="+7 999 888-77-66"
              value={nullToUndefined(state.personal_phone)}
              style={styles.fieldInput}
              onChangeText={(text: string): void =>
                dispatch({ type: 'personal_phone', payload: text })
              }
              itemStartAdornment={
                <View key="icon" style={styles.fieldIcon}>
                  <Image source={IMAGES.phone} />
                </View>
              }
              itemStyle={styles.lastField}
              error={
                (state.personal_phone?.length || 0) > 0
                  ? !isPhoneValid(nullToUndefined(state.personal_phone))
                  : undefined
              }
            />
          </View>
        </KeyboardAwareScrollView>
      </DataContainer>
    </DataChecker>
  );
};

const EditUserPhoto = ({ photo }: { photo?: string | null }) => {
  const [mutate, mutationState] = useUpdateUserPhotoMutation({
    update: (proxy, mutationResult) => {
      const personalPhoto = mutationResult.data?.setUserPhoto;
      const old = proxy.readQuery<GetUserQuery, GetUserQueryVariables>({ query: GetUserDocument });
      if (!old) return;
      proxy.writeQuery<GetUserQuery>({
        query: GetUserDocument,
        data: { ...old, user: { ...old.user, personalPhoto } },
      });
    },
  });

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [104, 104],
      quality: 1,
      base64: true,
    });

    if (result.cancelled === false) {
      mutate({ variables: { photo: result.base64 || null } }).catch(console.error);
    }
  };

  return (
    <View key="photo" style={styles.photo}>
      <View key="photo-content" style={styles.photoContent}>
        <View key="remove" style={styles.photoRemove}>
          {photo ? (
            <TouchableOpacity
              disabled={mutationState.loading}
              activeOpacity={theme.opacity.active}
              onPress={(): void => {
                mutate({ variables: { photo: null } }).catch(console.error);
              }}
            >
              <Image source={IMAGES.photoRemove} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View key="image">
          {mutationState.loading ? (
            <Loader size="medium" />
          ) : (
            <Image
              source={{ uri: getImageUrl(photo) } || IMAGES.noUserPhoto}
              style={styles.image}
            />
          )}
        </View>
        <View key="change">
          <TouchableOpacity
            activeOpacity={theme.opacity.active}
            onPress={pickImage}
            disabled={mutationState.loading}
          >
            <Image source={IMAGES.photoChange} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const SettingsPersonal = React.memo<{}>(SettingsPersonalBase);
