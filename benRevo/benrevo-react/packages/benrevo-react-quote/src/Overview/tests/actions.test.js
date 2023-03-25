import {
  optionRiderSelect,
  optionRiderUnSelect,
} from '../actions';
import * as types from '../../constants';

describe('Overview actions', () => {
  it('optionRiderSelect', () => {
    const mockAction = {
      meta: {
        section: 'test1',
      },
      type: types.OPTION_RIDER_SELECT,
      payload: { riderId: 'test2', rfpQuoteOptionNetworkId: 'test3', optionId: 'test4' },
    };
    expect(optionRiderSelect('test1', 'test2', 'test3', 'test4')).toEqual(mockAction);
  });

  it('optionRiderUnSelect', () => {
    const mockAction = {
      meta: {
        section: 'test1',
      },
      type: types.OPTION_RIDER_UNSELECT,
      payload: { riderId: 'test2', rfpQuoteOptionNetworkId: 'test3', optionId: 'test4' },
    };
    expect(optionRiderUnSelect('test1', 'test2', 'test3', 'test4')).toEqual(mockAction);
  });
});
