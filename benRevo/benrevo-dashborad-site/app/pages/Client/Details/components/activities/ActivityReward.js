import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Button } from 'semantic-ui-react';

class ActivityReward extends React.Component {
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

    this.onChangeClient = this.onChangeClient.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    this.props.onStart();
  }

  onChangeClient(clientTeam, checked) {
    const clientTeamIds = [...this.props.item.clientTeamIds];

    if (!checked) {
      for (let i = 0; i < clientTeamIds.length; i += 1) {
        if (clientTeam.clientTeamId === clientTeamIds[i]) {
          clientTeamIds.splice(i, 1);
          break;
        }
      }
    } else clientTeamIds.push(clientTeam.clientTeamId);

    this.props.onEdit('clientTeamIds', clientTeamIds);

    return true;
  }

  onSave() {
    this.props.onSave();
    this.props.onCancel();
  }

  checkSelected(id) {
    const clientTeamIds = this.props.item.clientTeamIds;

    if (clientTeamIds) {
      for (let i = 0; i < clientTeamIds.length; i += 1) {
        if (id === clientTeamIds[i]) return true;
      }
    }

    return false;
  }

  render() {
    const { item, onCancel, saveButtonText } = this.props;

    return (
      <div className="activity-detail">
        <Grid>
          <Grid.Row>
            <Grid.Column computer="9" tablet="14" mobile="16">
              <Form>
                { item.clientTeams && item.clientTeams.length > 0 &&
                  <Form.Field>
                    <label htmlFor="label">Select teams members who will receive reward:</label>
                  </Form.Field>
                }
                { item.clientTeams && item.clientTeams.length > 0 &&
                  <Form.Group inline>
                    { item.clientTeams.map((member, i) =>
                      <Form.Checkbox
                        className="blue"
                        key={i}
                        label={member.name}
                        onChange={(e, inputState) => { this.onChangeClient(member, inputState.checked); }}
                        checked={this.checkSelected(member.clientTeamId)}
                      />
                    )}
                  </Form.Group>
                }
                { item.clientTeams && !item.clientTeams.length &&
                  <div>No Teams</div>
                }
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="activity-detail-buttons">
            <Grid.Column computer="2" tablet="6" mobile="16">
              <Button fluid basic onClick={onCancel}>Cancel</Button>
            </Grid.Column>
            <Grid.Column computer="4" tablet="8" mobile="16">
              <Button disabled={item.type === undefined || (item.clientTeamIds && !item.clientTeamIds.length)} fluid primary onClick={this.onSave}>{saveButtonText}</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ActivityReward;
