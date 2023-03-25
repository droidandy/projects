// @flow
import DropdownString from 'components/general/DropdownString';
import { countries } from 'context/variables';

export default ({ input: { value, onChange } }) => (
  <div>
    <DropdownString
      values={countries}
      currentValue={value.filterCountry || 'Choose country'}
      toggle={filterCountry => onChange({ ...value, filterCountry })}
    />
  </div>
);
