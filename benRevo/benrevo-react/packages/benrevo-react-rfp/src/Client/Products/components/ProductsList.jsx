import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox, Table } from 'semantic-ui-react';
import * as types from './../../../constants';

class Products extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    simpleMode: PropTypes.bool,
    carriersLoaded: PropTypes.bool.isRequired,
    tableClass: PropTypes.string,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    plans: PropTypes.object.isRequired,
    changeSelectedProducts: PropTypes.func.isRequired,
    changeVirginCoverage: PropTypes.func.isRequired,
    otherCarrier: PropTypes.object,
    updateCarrier: PropTypes.func.isRequired,
    carrierToDefault: PropTypes.func.isRequired,
    plansToDefault: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      titles: {
        medical: types.RFP_MEDICAL_TEXT,
        dental: types.RFP_DENTAL_TEXT,
        vision: types.RFP_VISION_TEXT,
        life: types.RFP_LIFE_TEXT,
        std: types.RFP_STD_TEXT,
        ltd: types.RFP_LTD_TEXT,
      },
    };
    this.changeVirginCoverage = ::this.changeVirginCoverage;
  }

  changeVirginCoverage(section, value) {
    const { changeVirginCoverage, updateCarrier, otherCarrier, carrierToDefault, plansToDefault, simpleMode, changeCarrier, plans } = this.props;

    changeVirginCoverage(section, value);

    if (!simpleMode) {
      if (value && otherCarrier) {
        updateCarrier(section, types.CARRIERS, 'title', otherCarrier.value || otherCarrier.displayName, 0, false);
        updateCarrier(section, types.CARRIERS, 'years', null, 0, false);
        updateCarrier(section, types.PREVIOUS_CARRIERS, 'title', '', 0, false);
        updateCarrier(section, types.PREVIOUS_CARRIERS, 'years', null, 0, false);

        for (let i = 0; i < plans[section].length; i += 1) {
          const plan = plans[section][i];

          changeCarrier(section, otherCarrier.id || otherCarrier.carrierId, i, plan.title, true);
        }
      } else {
        updateCarrier(section, types.CARRIERS, 'years', null, 0, true);
        updateCarrier(section, types.CARRIERS, 'title', '', 0, true);
        updateCarrier(section, types.PREVIOUS_CARRIERS, 'title', '', 0, true);
        updateCarrier(section, types.PREVIOUS_CARRIERS, 'years', null, 0, true);
      }

      carrierToDefault(section, types.CARRIERS);
      carrierToDefault(section, types.PREVIOUS_CARRIERS);

      plansToDefault(section);
    }
  }

  render() {
    const { products, changeSelectedProducts, virginCoverage, carriersLoaded, otherCarrier, simpleMode, tableClass } = this.props;
    return (
      <Table celled className={tableClass || ''}>
        <Table.Body>
          { Object.keys(products).map((item, i) => <Table.Row key={i} cellAs="div">
            <Table.Cell width={6}>
              <Checkbox
                label={this.state.titles[item]}
                checked={products[item]}
                onChange={(e, inputState) => { changeSelectedProducts(item, inputState.checked); }}
              />
            </Table.Cell>
            <Table.Cell verticalAlign="middle">
              { (item === types.RFP_MEDICAL_SECTION || item === types.RFP_DENTAL_SECTION || item === types.RFP_VISION_SECTION) &&
                <Form style={{visibility: products[item] ? 'visible' : 'hidden' }}>
                  <Form.Group inline>
                    <span className="radio-label">Is this virgin coverage?</span>
                    <Form.Radio disabled={((!carriersLoaded || !otherCarrier) && !simpleMode) || !products[item]} label="Yes" value="Yes" checked={virginCoverage[item]} onChange={(e, inputState) => { this.changeVirginCoverage(item, inputState.value === 'Yes'); }} />
                    <Form.Radio disabled={((!carriersLoaded || !otherCarrier) && !simpleMode) || !products[item]} label="No" value="No" checked={!virginCoverage[item]} onChange={(e, inputState) => { this.changeVirginCoverage(item, inputState.value === 'Yes'); }} />
                  </Form.Group>
                </Form>
              }
            </Table.Cell>
          </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}


export default Products;
