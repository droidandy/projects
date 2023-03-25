import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Input, Dropdown, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { MEDICAL_SECTION } from '../../../../App/constants';
import { COMPETITIVE_INFO_DIFFERENCE } from '../../constants';

class ActivityCompetitiveInfo extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    saveButtonText: PropTypes.string.isRequired,
    productsList: PropTypes.array.isRequired,
    carriersList: PropTypes.object.isRequired,
    onStart: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };

    this.onEditOption = this.onEditOption.bind(this);
    this.onEditProduct = this.onEditProduct.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    this.props.onStart();
  }

  onEditOption(e, inputState) {
    if (inputState.value === COMPETITIVE_INFO_DIFFERENCE) this.props.onEdit('product', MEDICAL_SECTION.toUpperCase());
    this.props.onEdit('option', inputState.value);
  }

  onEditProduct(e, inputState) {
    this.props.onEdit('product', inputState.value);
    this.props.onEdit('carrierId', null);
  }

  onSave() {
    this.props.onSave();
    this.props.onCancel();
  }

  render() {
    const { item, onCancel, productsList, carriersList, onEdit, saveButtonText } = this.props;
    const options = [];
    const valueType = item.option === COMPETITIVE_INFO_DIFFERENCE ? '%' : '$';
    if (item.options) {
      item.options.map((option) => options.push({
        text: option.displayName,
        value: option.name,
      }));
    }

    return (
      <div className="activity-detail">
        <Grid>
          <Grid.Row>
            <Grid.Column computer="9" tablet="14" mobile="16">
              <Form>
                <Form.Group>
                  <Form.Field width="13">
                    <label htmlFor="activity-type" className="nowrap">Select type of competitive info to add...</label>
                    <Dropdown
                      name="activity-type"
                      search
                      selection
                      placeholder="Choose"
                      options={options}
                      value={item.option}
                      onChange={this.onEditOption}
                    />
                  </Form.Field>
                </Form.Group>
                { item.option &&
                  <Form.Group>
                    { item.option === COMPETITIVE_INFO_DIFFERENCE &&
                      <Form.Dropdown
                        width="6"
                        label="Select Product"
                        search
                        selection
                        placeholder="Choose"
                        options={productsList}
                        value={item.product}
                        onChange={this.onEditProduct}
                      />
                    }
                    { item.option === COMPETITIVE_INFO_DIFFERENCE &&
                    <Form.Field width="7">
                      <label htmlFor="activity-value" className="nowrap">Enter {valueType} (for below current enter “-” in front of number)</label>
                      <NumberFormat
                        name="activity-value"
                        customInput={Input}
                        suffix={(valueType === '%') ? '%' : ''}
                        prefix={(valueType === '$') ? '$' : ''}
                        placeholder={valueType}
                        value={item.value || ''}
                        onValueChange={(inputState) => { onEdit('value', inputState.value); }}
                      />
                    </Form.Field>
                    }
                  </Form.Group>
                }
                { item.option === COMPETITIVE_INFO_DIFFERENCE && item.product &&
                <Form.Group>
                  <Form.Dropdown
                    width="6"
                    label="Select Carrier"
                    search
                    selection
                    placeholder="Choose"
                    options={carriersList[item.product.toLowerCase()]}
                    value={item.carrierId}
                    onChange={(e, inputState) => { onEdit('carrierId', inputState.value); }}
                  />
                </Form.Group>
                }
                <Form.TextArea
                  width="13"
                  label="Add description and details:"
                  value={item.notes}
                  onChange={(e, inputState) => { onEdit('notes', inputState.value); }}
                />
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="activity-detail-buttons">
            <Grid.Column computer="2" tablet="6" mobile="16">
              <Button fluid basic onClick={onCancel}>Cancel</Button>
            </Grid.Column>
            <Grid.Column computer="4" tablet="8" mobile="16">
              <Button disabled={item.type === undefined || (!item.option)} fluid primary onClick={this.onSave}>{saveButtonText}</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ActivityCompetitiveInfo;
