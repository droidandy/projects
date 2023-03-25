import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import { ModalPage } from './components/modalPage';
import {
  ActionSheet,
  CreateModal,
  EditDescriptionModal,
  TargetDateModal,
  TargetPriceModal,
  ChartScreen,
} from './screens';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { OrderType } from '~/app/home/types/trade';
import { OrderOptionsModal, OrderPriceModal } from '~/components/modalScreen/screens/orderOptions';
import { chartGateName } from '~/components/molecules/chart/constants';
import { Modals, ModalParams } from '~/constants/modalScreens';
import { PortalGate } from '~/providers/Portal';
import Theme from '~/theme';

type ModalScreenRouteProp = RouteProp<RootStackParamList, Routes.ModalScreen>;
type NavigationProps = StackNavigationProp<RootStackParamList, Routes.ModalScreen>;
type Props = {
  route: ModalScreenRouteProp;
  navigation: NavigationProps,
};

export type ModalRootProps = {
  backScreen?: Routes,
  activeModal: Modals,
  defaultValues?: ModalParams,
};

const ModalRoot: React.FC<ModalRootProps> = ({ children, activeModal }): JSX.Element => {
  const array = React.Children.toArray(children);

  const modalToShow = array.find((modal) => modal.props.id === activeModal);

  return (
    <Theme>
      {modalToShow}
    </Theme>
  );
};

export const ModalScreen = ({ navigation, route }: Props): JSX.Element => {
  const { activeModal, backScreen, defaultValues } = route.params;

  return (
    <ModalRoot activeModal={activeModal}>
      <ModalPage id={Modals.ActionSheet} title="Trade">
        <ActionSheet
          navigation={navigation}
          backScreen={backScreen}
          defaultValue={defaultValues?.selectValues}
        />
      </ModalPage>

      <ModalPage id={Modals.CreateStackOrHunch} title="Create">
        <CreateModal navigation={navigation} />
      </ModalPage>

      <ModalPage id={Modals.TargetPrice} title="Target Price">
        <TargetPriceModal
          navigation={navigation}
          backScreen={backScreen}
          defaultValue={defaultValues?.targetPrice}
        />
      </ModalPage>

      <ModalPage id={Modals.EditDescription} title="Edit description">
        <EditDescriptionModal
          navigation={navigation}
          backScreen={backScreen}
          defaultValue={defaultValues?.description}
        />
      </ModalPage>

      <ModalPage id={Modals.TargetDate} title="Target Date">
        <TargetDateModal
          navigation={navigation}
          backScreen={backScreen}
          defaultValue={defaultValues?.targetDate}
        />
      </ModalPage>

      <ModalPage id={Modals.Chart} fullscreen>
        <ChartScreen>
          <PortalGate gateName={chartGateName} />
        </ChartScreen>
      </ModalPage>

      <ModalPage id={Modals.OrderOptions} title="Order options">
        <OrderOptionsModal
          navigation={navigation}
          backScreen={backScreen}
          defaultValue={defaultValues?.orderOptions}
        />
      </ModalPage>

      <ModalPage
        id={Modals.SetOrderPrice}
        title={defaultValues?.orderOptions?.orderType === OrderType.LimitOrder ? 'Set limit price' : 'Set stop price'}
      >
        <OrderPriceModal
          navigation={navigation}
          backScreen={backScreen}
          defaultValue={defaultValues?.orderOptions}
        />
      </ModalPage>
    </ModalRoot>
  );
};
