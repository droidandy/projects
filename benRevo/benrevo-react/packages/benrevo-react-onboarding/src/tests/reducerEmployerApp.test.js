import { fromJS } from 'immutable';
import homeReducer from '../EmployerApp/reducer';

describe('EmployerAppReducer', () => {
  let main;

  beforeEach(() => {
    main = fromJS({
      loading: false,
    });
  });

  it('should return the initial state', () => {
    expect(homeReducer(undefined, {})).toEqual(fromJS({ main }));
  });
});
