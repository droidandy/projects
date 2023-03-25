import React, { FC, memo, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PropTypes, ButtonBaseProps } from '@material-ui/core';
import IconButton from '@marketplace/ui-kit/components/IconButton';
import Button from '@marketplace/ui-kit/components/Button';
import Typography from '@marketplace/ui-kit/components/Typography';
import Icon, { Props as IconPops } from '@marketplace/ui-kit/components/Icon';
import { StateModel } from 'store/types';
import { makeFavourite, removeFromFavourites, useIsInFavorites } from 'store/profile/favourites';
import { actions as userActions, changeAuthModalVisibility } from 'store/user';
import { useNotifications } from 'store/notifications';
import { useNotificationContext } from 'containers/Notifications';
import { Link } from 'components/Link';
import { ReactComponent as HeartIcon } from 'icons/heart.svg';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';

interface HeartButtonProps extends ButtonBaseProps {
  variant?: 'fill' | 'stroke';
  color?: PropTypes.Color;
  iconProps?: Omit<IconPops, 'component'>;
  usageType?: 'buyBlock' | 'list';
}

const HeartButton: FC<HeartButtonProps> = ({ variant = 'stroke', iconProps, children, usageType, ...rest }) => {
  return children ? (
    <Button
      startIcon={
        <Icon
          component={HeartIcon}
          {...iconProps}
          style={{
            stroke: variant === 'stroke' ? '#222' : 'none',
            fill: variant === 'fill' ? 'currentColor' : 'none',
          }}
        />
      }
      {...rest}
    >
      <Typography component="span" color="textPrimary" variant="subtitle1">
        {children}
      </Typography>
    </Button>
  ) : (
    <IconButton arial-label="добавить в избранное" size="small" {...rest}>
      <Icon
        component={HeartIcon}
        {...iconProps}
        style={{
          stroke: variant === 'stroke' ? (usageType === 'buyBlock' && '#222') || 'currentColor' : 'none',
          fill: variant === 'fill' ? 'currentColor' : 'none',
          zIndex: 5,
        }}
      />
    </IconButton>
  );
};

interface Props {
  vehicleId: number;
  withText?: boolean;
  usageType?: 'list' | 'buyBlock';
}

const SuccessAction = () => {
  const { handleClose } = useNotificationContext();
  return (
    <Link href="/profile/favorites" shallow onClick={handleClose}>
      Перейти
    </Link>
  );
};

export const FavoritesButton: FC<Props> = memo(({ vehicleId, withText, usageType }) => {
  const dispatch = useDispatch();
  const { notify, notifyError } = useNotifications();
  const isAuth = useSelector<StateModel, boolean>((store) => !!store.user.isAuthorized);
  const active = useIsInFavorites(vehicleId);

  const handleAuthorized = () => {
    const action = active ? removeFromFavourites : makeFavourite;
    dispatch(action(vehicleId))
      .then(() => {
        if (active) {
          notify('Удалено из избранного');
        } else {
          notify('Добавлено в избранное', { action: <SuccessAction /> });
        }
      })
      .catch(() => {
        if (active) {
          notifyError('Не удалось удалить из избранного');
        } else {
          notifyError('Не удалось добавить в избранное');
        }
      });
  };

  const handleUnauthorized = () => {
    dispatch(userActions.setAuthStep(AuthSteps.FAVOURITES));
    dispatch(
      changeAuthModalVisibility(true, {
        handleOnCloseCallback() {
          // handleAuthorized(); TODO: add to favorites after login if not already added
        },
        regType: RegistrationTypes.FAVORITES,
      }),
    );
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isAuth) {
      handleAuthorized();
    } else {
      handleUnauthorized();
    }
  };

  const buttonProps: HeartButtonProps = active
    ? {
        color: 'primary',
        variant: 'fill',
        children: withText ? 'В избранном' : undefined,
        usageType,
      }
    : {
        color: withText ? 'default' : 'secondary',
        variant: 'stroke',
        children: withText ? 'В избранное' : undefined,
        usageType,
      };

  return <HeartButton {...buttonProps} onClick={handleClick} />;
});
