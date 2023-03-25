import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Input, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

class ActivityOption1Released extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    saveButtonText: PropTypes.string.isRequired,
    productsList: PropTypes.array.isRequired,
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

    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    this.props.onStart();
  }

  onSave() {
    this.props.onSave();
    this.props.onCancel();
  }

  render() {
    const { item, onCancel, productsList, onEdit, saveButtonText } = this.props;

    return (
      <div className="activity-detail">
        <Grid>
          <Grid.Row>
            <Grid.Column computer="9" tablet="14" mobile="16">
              <Form>
                <Form.Group>
                  <Form.Dropdown
                    width="6"
                    label="Select Product"
                    search
                    selection
                    placeholder="Choose"
                    options={productsList}
                    value={item.product}
                    onChange={(e, inputState) => { onEdit('product', inputState.value); }}
                  />
                  <Form.Field width="7">
                    <label htmlFor="activity-value" className="nowrap">Enter % (for below current enter “-” in front of number)</label>
                    <NumberFormat
                      name="activity-value"
                      customInput={Input}
                      suffix={'%'}
                      placeholder="%"
                      value={item.value || ''}
                      onValueChange={(inputState) => { onEdit('value', inputState.value); }}
                    />
                  </Form.Field>
                </Form.Group>
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
              <Button disabled={item.type === undefined || !item.value} fluid primary onClick={this.onSave}>{saveButtonText}</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ActivityOption1Released;
