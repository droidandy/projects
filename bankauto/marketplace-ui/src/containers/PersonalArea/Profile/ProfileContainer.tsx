import React, { FC, useMemo } from 'react';
import { generate } from 'shortid';
import { useDispatch, useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import { updateProfile } from 'api/profile';
import { ProfileMainInfoFormData } from 'types/ProfileMainInfoFormData';
import { actions as userActions } from 'store/user';
import { addFlashMessage } from 'store';
import { useCity } from 'store/city';
import { SelectNodeOption } from 'components/Fields/SelectNode';
import { defaultCity, DEFAULT_CITY_ID } from 'constants/defaultCity';
import { ProfileMainInfoForm, Title } from '../components';

export const ProfileContainer: FC = () => {
  const user = useSelector(({ user: userState }: StateModel) => userState);
  const dispatch = useDispatch();
  const { list } = useCity();
  const cityOptions = useMemo(() => {
    const [, ...rest] = list.primary;
    return [...rest, ...list.secondary].map(({ id, name }) => ({
      id: id === defaultCity.id ? DEFAULT_CITY_ID : id,
      name,
    })) as SelectNodeOption[];
  }, [list]);

  const handleSaveProfileMainInfo = (values: ProfileMainInfoFormData) => {
    const uid = generate();
    updateProfile(values)
      .then(({ data }) => {
        dispatch(userActions.fillUser(data));
        dispatch(addFlashMessage({ message: 'Данные профиля изменены', success: true, id: uid }));
      })
      .catch(
        ({
          response: {
            data: { detail },
          },
        }) => {
          const flashMessage = Object.values(detail)[0] as string[];
          dispatch(addFlashMessage({ message: flashMessage[0] as string, success: false, id: uid }));
        },
      );
  };

  return (
    <>
      <Title text="Личная информация" showDivider />
      <ProfileMainInfoForm data={{ ...user, cityOptions }} handleSave={handleSaveProfileMainInfo} />
    </>
  );
};
