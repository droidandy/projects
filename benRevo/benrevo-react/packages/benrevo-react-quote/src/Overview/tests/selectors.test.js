import { fromJS } from 'immutable';

import {
  selectPresentationPageDomain,
  makeSelectTotalAnnualPremium,
  makeSelectPlanType,
  makeSelectIsStatic,
  makeSelectPercentDifference,
  makeSelectDollarDifference,
  makeSelectLoading,
  makeSelectPresentationPage,
} from '../selectors';

describe('selectPresentationPageDomain', () => {
  const pageSelector = selectPresentationPageDomain();
  it('should select the presentation state', () => {
    const presentationState = fromJS({
      test: {},
    });
    const mockedState = fromJS({
      presentation: {
        medical: {
          test: {},
        },
      },
    });
    expect(pageSelector(mockedState)).toEqual(presentationState);
  });
});

describe('makeSelectFullAmount', () => {
  const amountSelector = makeSelectTotalAnnualPremium();
  it('should select the amount', () => {
    const totalAnnualPremium = 2;
    const mockedState = fromJS({
      presentation: {
        medical: {
          totalAnnualPremium,
        },
      },
    });
    expect(amountSelector(mockedState)).toEqual(totalAnnualPremium);
  });
});

describe('makeSelectPlanType', () => {
  const amountSelector = makeSelectPlanType();
  it('should select planType', () => {
    const planType = 'test';
    const mockedState = fromJS({
      presentation: {
        medical: {
          planType,
        },
      },
    });
    expect(amountSelector(mockedState)).toEqual(planType);
  });
});

describe('makeSelectIsStatic', () => {
  const amountSelector = makeSelectIsStatic();
  it('should select isStatic', () => {
    const isStatic = 'test';
    const mockedState = fromJS({
      presentation: {
        medical: {
          isStatic,
        },
      },
    });
    expect(amountSelector(mockedState)).toEqual(isStatic);
  });
});

describe('makeSelectPercentDifference', () => {
  const amountSelector = makeSelectPercentDifference();
  it('should select percentDifference', () => {
    const percentDifference = 'test';
    const mockedState = fromJS({
      presentation: {
        medical: {
          percentDifference,
        },
      },
    });
    expect(amountSelector(mockedState)).toEqual(percentDifference);
  });
});


describe('makeSelectDollarDifference', () => {
  const amountSelector = makeSelectDollarDifference();
  it('should select dollarDifference', () => {
    const dollarDifference = 'test';
    const mockedState = fromJS({
      presentation: {
        medical: {
          dollarDifference,
        },
      },
    });
    expect(amountSelector(mockedState)).toEqual(dollarDifference);
  });
});

describe('makeSelectLoading', () => {
  const amountSelector = makeSelectLoading();
  it('should select loading', () => {
    const loading = 'test';
    const mockedState = fromJS({
      presentation: {
        medical: {
          loading,
        },
      },
    });
    expect(amountSelector(mockedState)).toEqual(loading);
  });
});

describe('makeSelectPresentationPage', () => {
  const amountSelector = makeSelectPresentationPage();
  it('makeSelectPresentationPage', () => {
    const mockedState = fromJS({
      presentation: {
        medical: {
          test: 'test',
        },
      },
    });
    expect(amountSelector(mockedState)).toEqual({ test: 'test' });
  });
});
