// @flow
import PlacesAutocomplete from 'react-places-autocomplete';

type GoogleMapsSearchInputProps = {
  placeholder: string,
  input: {
    // TODO: eslint doesn't provide support for nested values
    // value: {
    //   calendarOpen: boolean,
    //   day: Date
    // }
  }
};

const myStyles = {
  autocompleteContainer: { zIndex: '1' },
};

export default ({ placeholder, input: { value, onChange } }: GoogleMapsSearchInputProps) => (
  <div>
    <PlacesAutocomplete
      inputProps={{
        value,
        onChange,
        placeholder,
      }}
      styles={myStyles}
    />
  </div>
);
