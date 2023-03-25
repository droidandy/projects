import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Dropdown, Button } from 'semantic-ui-react';

class ActivityProbability extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    saveButtonText: PropTypes.string.isRequired,
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
    const { item, onCancel, onEdit, saveButtonText } = this.props;
    const options = [];
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
                  <Form.Field width="8">
                    <label htmlFor="activity-type" className="nowrap">Change probability</label>
                    <Dropdown
                      name="activity-type"
                      search
                      selection
                      placeholder="Choose"
                      options={options}
                      value={item.option}
                      onChange={(e, inputState) => { onEdit('value', inputState.value); }}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.TextArea
                  width="13"
                  label="Add a reason for the change in probability:"
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
              <Button disabled={item.type === undefined} fluid primary onClick={this.onSave}>{saveButtonText}</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ActivityProbability;
