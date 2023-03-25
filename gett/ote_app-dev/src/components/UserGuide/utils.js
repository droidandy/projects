import { strings } from 'locales';
import { isIphoneX, isAndroid } from 'utils';

export const statusBarHeight = isIphoneX() ? 40 : ((isAndroid && 2) || 21);

export const skipAnimation = {
  0: {
    scale: 1
  },
  0.5: {
    scale: 1.15
  },
  1: {
    scale: 1
  }
};

export const prepareData = {
  map: [
    {
      arrowName: 'UGArrow1',
      arrowW: 32,
      arrowH: 47,
      title: strings('userGuide.tapToSet'),
      subTitle: strings('userGuide.yourPickupAndDestination')
    },
    {
      arrowName: 'UGArrow2',
      arrowW: 43,
      arrowH: 44,
      title: strings('userGuide.tapToSee'),
      subTitle: strings('userGuide.allYourOrders')
    },
    {
      arrowName: 'UGArrow3',
      arrowW: 34,
      arrowH: 52,
      title: strings('userGuide.tapToSee'),
      subTitle: strings('userGuide.fullMenu')
    }
  ],
  orders: [
    {
      isRow: true,
      arrowName: 'UGArrow4',
      arrowW: 45,
      arrowH: 42,
      title: strings('userGuide.tapToSelect'),
      subTitle: strings('userGuide.ordersType'),
      position: {
        offset: isAndroid ? 150 : 140
      }
    },
    {
      arrowName: 'UGArrow1',
      arrowW: 32,
      arrowH: 47,
      title: strings('userGuide.tapToSee'),
      subTitle: strings('userGuide.moreInformations')
    }
  ],
  settings: [
    {
      arrowName: 'UGArrow1',
      arrowW: 32,
      arrowH: 47,
      title: strings('userGuide.tapToSelect'),
      subTitle: strings('userGuide.defaultCarType')
    },
    {
      arrowName: 'UGArrow1',
      arrowW: 32,
      arrowH: 47,
      title: strings('userGuide.addYour'),
      subTitle: strings('userGuide.favoriteAddresses')
    },
    {
      arrowName: 'UGArrow1',
      arrowW: 32,
      arrowH: 47,
      title: strings('userGuide.tapToSee'),
      subTitle: strings('userGuide.notificationsHistory'),
      position: {
        y: 846
      }
    }
  ]
};
