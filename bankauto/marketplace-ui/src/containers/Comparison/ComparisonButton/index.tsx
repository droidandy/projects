import React, { FC, memo, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PropTypes, ButtonBaseProps } from '@material-ui/core';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import IconButton from '@marketplace/ui-kit/components/IconButton';
import Button from '@marketplace/ui-kit/components/Button';
import Typography from '@marketplace/ui-kit/components/Typography';
import Icon, { Props as IconPops } from '@marketplace/ui-kit/components/Icon';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { StateModel } from 'store/types';
import { actions as userActions, changeAuthModalVisibility } from 'store/user';
import { ReactComponent as CompareIconDefault } from 'icons/compareCar.svg';
import { ReactComponent as CompareIconBuyBlock } from 'icons/compareCarBuyblock.svg';
import { ReactComponent as CompareIconActive } from 'icons/compareCarActive.svg';
import { useComparisonIds, useIsInComparison } from 'store/comparisonIds';
import { useNotificationContext } from 'containers/Notifications';
import { Link } from 'components';

export const SuccessAction = () => {
  const { handleClose } = useNotificationContext();
  // TODO: make each tab have its own path (/new, /used)
  return (
    <Link href="/profile/comparison" shallow onClick={handleClose}>
      Перейти
    </Link>
  );
};

interface CompareButtonProps extends ButtonBaseProps {
  usageType?: 'buyBlock' | 'list';
  color?: PropTypes.Color;
  iconProps?: Omit<IconPops, 'component'>;
  isActive: boolean;
}

const CompareButton: FC<CompareButtonProps> = ({ usageType, iconProps, children, isActive, ...rest }) => {
  return children ? (
    <Button
      startIcon={
        <Icon style={{ fill: 'none' }} component={isActive ? CompareIconActive : CompareIconBuyBlock} {...iconProps} />
      }
      {...rest}
    >
      <Typography component="span" color="textPrimary" variant="subtitle1">
        {children}
      </Typography>
    </Button>
  ) : (
    <IconButton arial-label="Добавить к сравнению" size="small" {...rest}>
      <Icon
        component={
          isActive ? CompareIconActive : (usageType === 'buyBlock' && CompareIconBuyBlock) || CompareIconDefault
        }
        {...iconProps}
        style={{
          zIndex: 5,
          fill: 'none',
        }}
      />
    </IconButton>
  );
};

interface Props {
  offerId: number;
  vehicleType: VEHICLE_TYPE;
  withText?: boolean;
  usageType?: 'buyBlock' | 'list';
}

export const ComparisonButton: FC<Props> = memo(({ offerId, vehicleType, withText, usageType }) => {
  const dispatch = useDispatch();
  const { addComparisonId, removeComparisonId } = useComparisonIds();
  const isAuth = useSelector<StateModel, boolean>((store) => !!store.user.isAuthorized);
  const isActive = useIsInComparison(offerId, vehicleType);
  const handleAuthorized = () => {
    if (isActive) {
      removeComparisonId(offerId, vehicleType);
    } else {
      addComparisonId(offerId, vehicleType, { action: <SuccessAction /> });
    }
  };

  const handleUnauthorized = () => {
    dispatch(userActions.setAuthStep(AuthSteps.COMPARISON));
    dispatch(
      changeAuthModalVisibility(true, {
        handleOnCloseCallback() {},
        regType: RegistrationTypes.COMPARISON,
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

  const buttonText = isActive ? 'Удалить из сравнений' : 'Добавить к сравнению';

  const buttonProps: CompareButtonProps = {
    children: withText ? buttonText : undefined,
    isActive,
    usageType,
  };

  return <CompareButton {...buttonProps} onClick={handleClick} />;
});
