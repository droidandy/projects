import React, { FC } from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { ButtonLink } from '../ButtonLink';
import { MenuItems } from 'constants/menuItems';
import { Link } from 'components';
import { StateModel } from 'store/types';
import { changeAuthModalVisibility } from 'store/user';
import { useDispatch, useSelector } from 'react-redux';
import { RegistrationTypes } from 'types/Authentication';
import { useStyles } from './InfoBlock.styles';

const {
  AllVehicles: { href: AllVehiclesHref },
  Insurance: { href: InsuranceHref },
  Service: { href: ServiceHref },
  Profile: { href: ProfileHref },
} = MenuItems;

export const InfoBlock: FC = () => {
  const { infoBlockTitle, infoBlockText, buttonBlock, root, registerButton, button, buttonLink } = useStyles();
  const { isAuthorized } = useSelector((state: StateModel) => state.user);
  const dispatch = useDispatch();
  const handleAuthorized = React.useCallback(() => {
    if (!isAuthorized) {
      dispatch(changeAuthModalVisibility(true, { regType: RegistrationTypes.PLAIN }));
    }
  }, [isAuthorized]);
  return (
    <div className={root}>
      <Typography component="div" className={infoBlockTitle}>
        Вы еще не зарегистрированы на #банкавто?
      </Typography>
      <Typography component="div" className={infoBlockText}>
        Только до 20 марта!{' '}
        {isAuthorized ? (
          <Link href={ProfileHref} target="_blank">
            <Button variant="text" onClick={handleAuthorized} className={registerButton}>
              Зарегистрируйтесь
            </Button>
          </Link>
        ) : (
          <Button variant="text" onClick={handleAuthorized} className={registerButton}>
            Зарегистрируйтесь
          </Button>
        )}
        , получите доступ к лучшим предложениям от автомобильных дилеров, всем возможностям многофункционального сервиса
        для автомобилистов и 5000 рублей в подарок на приобретение бытовой техники у нашего партнера!
        <br />
        Предложение действительно только для клиентов РГС Банка не зарегистрированных на #банкавто.
      </Typography>
      <Typography variant="h5" component="div">
        Акция действует и при покупке полиса{' '}
        <Link href={InsuranceHref} target="_blank">
          ОСАГО
        </Link>{' '}
        или записи в{' '}
        <Link href={ServiceHref} target="_blank">
          Сервис
        </Link>
      </Typography>
      <Typography variant="caption" component="div">
        * SMS с промокодом высылается на следующий рабочий день после даты регистрации. В отдельных случаях срок может
        быть увеличен до 5 дней.
      </Typography>
      <Typography variant="caption" component="div">
        Призом Акции является промокод (зашифрованная уникальная комбинация из букв и/или цифр) на сумму 5 000 баллов.
        Баллами можно компенсировать до 50% от суммы покупки на сайте{' '}
        <Link href="https://clck.ru/akqFh" target="_blank">
          https://skymoney.club
        </Link>
      </Typography>
      <div className={buttonBlock}>
        {isAuthorized ? (
          <ButtonLink text="Зарегистрироваться" link={ProfileHref} variant="contained" classname={buttonLink} />
        ) : (
          <Button variant="contained" onClick={handleAuthorized} className={button} color={'primary'}>
            Зарегистрироваться
          </Button>
        )}
        <ButtonLink link={AllVehiclesHref} variant="outlined" text="Подобрать автомобиль" />
      </div>
    </div>
  );
};
