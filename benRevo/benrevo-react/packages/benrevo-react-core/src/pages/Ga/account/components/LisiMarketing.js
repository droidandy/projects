import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

class LisiMarketing extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    value: PropTypes.string,
  };

  render() {
    const { value } = this.props;
    return (
      <Dropdown
        id="gaState"
        search
        className="selection"
        value={value || ''}
        onChange={() => { }}
      >
        <Dropdown.Menu>
          <Dropdown.Header content="OC" />
          <Dropdown.Item>Eric Tapia</Dropdown.Item>
          <Dropdown.Item>Jeff Hoss</Dropdown.Item>
          <Dropdown.Item>Laurie Wolbart</Dropdown.Item>
          <Dropdown.Item>Michele Isaly</Dropdown.Item>
          <Dropdown.Item>Tyler Shepard</Dropdown.Item>
          <Dropdown.Header content="LA" />
          <Dropdown.Item>Frank Estrada</Dropdown.Item>
          <Dropdown.Item>Jason Herbison</Dropdown.Item>
          <Dropdown.Item>LaMonet Howard</Dropdown.Item>
          <Dropdown.Header content="SD" />
          <Dropdown.Item>Christina Diamantis</Dropdown.Item>
          <Dropdown.Item>Marc Eagleton</Dropdown.Item>
          <Dropdown.Item>Denise Aragon</Dropdown.Item>
          <Dropdown.Header content="Sacramento" />
          <Dropdown.Item>Ryan Esway</Dropdown.Item>
          <Dropdown.Header content="San Mateo" />
          <Dropdown.Item>Desare Kallingal</Dropdown.Item>
          <Dropdown.Item>Leze Cheya</Dropdown.Item>
          <Dropdown.Item>Gary Myers</Dropdown.Item>
          <Dropdown.Item>Sandra Bealu</Dropdown.Item>
          <Dropdown.Item>Shannon Carboni</Dropdown.Item>
          <Dropdown.Item>Mike Seuss</Dropdown.Item>
          <Dropdown.Item>Joe Norton</Dropdown.Item>
          <Dropdown.Header content="Fresno" />
          <Dropdown.Item>Peter Mehta</Dropdown.Item>
          <Dropdown.Item>Jill White</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default LisiMarketing;
