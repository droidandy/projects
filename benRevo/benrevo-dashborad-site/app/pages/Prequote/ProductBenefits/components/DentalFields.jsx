import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Dropdown } from 'semantic-ui-react';

class ProductDentalBenefitsFields extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object.isRequired,
    planType: PropTypes.string.isRequired,
    planIndex: PropTypes.number.isRequired,
    benefitIndex: PropTypes.number.isRequired,
    changeField: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  openDropdown() {
    this.setState({ open: true });
  }

  closeDropdown() {
    this.setState({ open: false });
  }

  render() {
    const {
      item,
      planType,
      planIndex,
      benefitIndex,
      changeField,
    } = this.props;
    const { open } = this.state;
    const optionsRestriction = open ? item.optionsRestriction : [{ value: item.restriction, text: item.restriction }];

    if (item.type) {
      const options = open ? item.options : [{ value: item.value, text: item.value }];
      return (
        <Grid.Row className="planInputRow">
          <Grid.Column width={4} className="title-form" verticalAlign="middle">
            <span>{item.name}</span>
          </Grid.Column>
          <Grid.Column width={8}>
            { item.options && item.options.length &&
              <Dropdown
                className="carrier-dropdown"
                placeholder="Choose"
                name={`${item.sysName}_${planIndex}`}
                search
                selection
                fluid
                options={options}
                value={item.value}
                onOpen={this.openDropdown}
                onClose={this.closeDropdown}
                onChange={(e, inputState) => {
                  changeField(planIndex, benefitIndex, 'benefits', 'value', inputState.value, planType);
                }}
              />
            }
          </Grid.Column>
        </Grid.Row>
      );
    }
    const optionsIn = open ? item.options : [];
    const optionsOut = open ? item.options : [];

    if (!open && item.valueIn) {
      optionsIn.push({ value: item.valueIn, text: item.valueIn });
    }

    if (!open && item.valueOut) {
      optionsOut.push({ value: item.valueOut, text: item.valueOut });
    }

    return (
      <Grid.Row key={item.sysName} className="planInputRow" columns={4}>
        <Grid.Column className="title-form" verticalAlign="middle">
          <span>{item.name}</span>
        </Grid.Column>
        <Grid.Column>
          { item.options && item.options.length &&
          <Form.Dropdown
            className="carrier-dropdown"
            placeholder="Choose"
            name={`${item.sysName}_IN_${planIndex}`}
            search
            selection
            fluid
            options={optionsIn}
            value={item.valueIn}
            onOpen={this.openDropdown}
            onClose={this.closeDropdown}
            onChange={(e, inputState) => {
              changeField(planIndex, benefitIndex, 'benefits', 'valueIn', inputState.value, planType);
            }}
          />
          }
        </Grid.Column>
        <Grid.Column>
          { item.options && item.options.length &&
          <Form.Dropdown
            className="carrier-dropdown"
            placeholder="Choose"
            name={`${item.sysName}_OUT_${planIndex}`}
            search
            fluid
            selection
            options={optionsOut}
            value={item.valueOut}
            onOpen={this.openDropdown}
            onClose={this.closeDropdown}
            onChange={(e, inputState) => {
              changeField(planIndex, benefitIndex, 'benefits', 'valueOut', inputState.value, planType);
            }}
          />
          }
        </Grid.Column>
        { item.restriction !== undefined &&
          <Grid.Column>
            <Form.Dropdown
              className="carrier-dropdown"
              placeholder="Choose"
              name={`${item.sysName}_RESTRICTION_${planIndex}`}
              search
              fluid
              selection
              options={optionsRestriction}
              value={item.restriction}
              onOpen={this.openDropdown}
              onClose={this.closeDropdown}
              onChange={(e, inputState) => {
                changeField(planIndex, benefitIndex, 'benefits', 'restriction', inputState.value, planType);
              }}
            />
          </Grid.Column>
        }
      </Grid.Row>
    );
  }
}

export default ProductDentalBenefitsFields;
