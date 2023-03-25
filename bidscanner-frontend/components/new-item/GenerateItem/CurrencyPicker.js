// @flow
import DropdownString from 'components/general/DropdownString';
import { currencies } from 'context/variables';

export default ({ input: { value, onChange } }) => (
  <div>
    <DropdownString
      values={currencies}
      currentValue={value.chosenCurrency || currencies[0]}
      toggle={chosenCurrency => onChange({ ...value, chosenCurrency })}
    />
  </div>
);
