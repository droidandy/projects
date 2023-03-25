import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Input, Card } from 'semantic-ui-react';

class EnrollmentTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    edit: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    changeEnrollment: PropTypes.func.isRequired,
    cancelEnrollment: PropTypes.func.isRequired,
    editEnrollment: PropTypes.func.isRequired,
    saveEnrollment: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    isVirgin: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.onEdit = this.onEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onEdit() {
    this.props.editEnrollment(this.props.name, true);
  }

  onCancel() {
    this.props.cancelEnrollment(this.props.name);
    this.props.editEnrollment(this.props.name, false);
  }

  onSave() {
    this.props.editEnrollment(this.props.name, false);
    this.props.saveEnrollment(this.props.name);
  }

  onChange(column, index, value) {
    this.props.changeEnrollment(this.props.name, column, index, value);
  }

  render() {
    const { data, name, edit, openModal, isVirgin } = this.props;
    function calcTotal(index) {
      let total = 0;

      data.contributions.map((item) => {
        total += +item.values[index].value || 0;

        return true;
      });
      return total;
    }

    return (
      <Card className={(!edit) ? 'card-contributions-container' : 'card-contributions-container edit'}>
        <Grid verticalAlign="middle">
          <Grid.Row className="card-top card-title">
            <Grid.Column width={13}>
              {name}
            </Grid.Column>
            {!edit && !isVirgin &&
            <Grid.Column width={3} textAlign="right">
              <Button className="edit-btn" onClick={this.onEdit} size="medium" primary>Edit</Button>
            </Grid.Column>
            }
          </Grid.Row>
          <Grid.Column width={16}>
            <div className="card-contributions-component">
              <Grid textAlign="left" columns="equal">
                { data.networks && data.networks.length > 0 &&
                <Grid.Row className="card-contributions-row" verticalAlign="middle">
                  <Grid.Column width={4}>Plan Type</Grid.Column>
                  {data.networks.map((item, i) =>
                    <Grid.Column key={i} width={2}>
                      <div>{item.type}</div>
                      <div className="plan-name">{item.planName}</div>
                    </Grid.Column>
                  )}
                </Grid.Row>
                }
              </Grid>
            </div>
            { isVirgin ?
              (<Grid textAlign="left" columns="equal">
                <Grid.Row
                  className={(!edit) ? 'card-contributions-row' : 'card-contributions-row edit'}
                  verticalAlign="middle"
                >
                  <Grid.Column>
                    <div className="card-contributions-component">
                      (For virgin groups, no enrollment information required.)
                      <a onClick={(e) => { e.preventDefault(); openModal(e); }} href=""> How do I add projected enrollment?</a>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>) :
            (<div className="card-contributions-component">
              { data.contributions && data.contributions.length > 0 &&
              <Grid textAlign="left" columns="equal">
                {data.contributions.map((item, i) =>
                  <Grid.Row
                    className={(!edit) ? 'card-contributions-row' : 'card-contributions-row edit'}
                    verticalAlign="middle"
                    key={i}
                  >
                    <Grid.Column width={4}>{item.planName}</Grid.Column>
                    {item.values.map((network, j) =>
                      <Grid.Column key={j} width={2}>
                        { !edit &&
                        <div>
                          {network.value}
                        </div>
                        }
                        { edit &&
                        <Input
                          fluid
                          name={`value-${j}`}
                          value={network.value}
                          onChange={(e, inputState) => {
                            this.onChange(i, j, inputState.value);
                          }}
                        /> }
                      </Grid.Column>
                    )}
                  </Grid.Row>
                )}
                <Grid.Row className="card-contributions-row last" verticalAlign="middle">
                  <Grid.Column width={4}>Total</Grid.Column>
                  {data.total.map((item, i) =>
                    <Grid.Column key={i} width={2}>{calcTotal(i)}</Grid.Column>
                  )}
                </Grid.Row>
                {edit &&
                <Grid.Row className="card-bottom" verticalAlign="middle">
                  <Grid.Column width={8}>
                    <Button onClick={this.onCancel} size="medium" primary>Cancel</Button>
                  </Grid.Column>
                  <Grid.Column width={8} textAlign="right">
                    <Button onClick={this.onSave} size="medium" primary>Save Changes</Button>
                  </Grid.Column>
                </Grid.Row>
                }
              </Grid>
              }
            </div>)
            }
          </Grid.Column>
        </Grid>
      </Card>
    );
  }
}

export default EnrollmentTable;
