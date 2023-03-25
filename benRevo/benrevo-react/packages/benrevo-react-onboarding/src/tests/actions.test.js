import {
  getFile,
} from '../actions';
import * as types from '../constants';

describe('OnBoarding actions', () => {
  it('getFile', () => {
    const expected = {
      type: types.GET_FILE,
      payload: 'test',
    };
    expect(getFile('test')).toEqual(expected);
  });
});
