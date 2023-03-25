import React from 'react';
import PropTypes from 'prop-types';
import { Card, Table, Icon, Button } from 'semantic-ui-react';
import { TYPE_PROBABILITY, TYPE_COMPETITIVE_INFO, TYPE_OPTION1_RELEASED, TYPE_REWARD, TYPE_QUOTE_VIEWED, TYPE_RENEWAL_ADDED } from '../constants';
import { getColorProbability, getColor } from '../../../../utils/getColor';
import ActivityCompetitiveInfo from './activities/ActivityCompetitiveInfo';
import ActivityProbability from './activities/ActivityProbability';
import ActivityOption1Released from './activities/ActivityOption1Released';
import ActivityReward from './activities/ActivityReward';
import { CARRIER } from '../../../../config';
import { getDate } from '../../../../utils/query';

class Activity extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    activities: PropTypes.array.isRequired,
    carriersList: PropTypes.object.isRequired,
    productsList: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    currentActivity: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    changeActivitySort: PropTypes.func.isRequired,
    getActivity: PropTypes.func.isRequired,
    getActivityByType: PropTypes.func.isRequired,
    changeActivity: PropTypes.func.isRequired,
    updateActivity: PropTypes.func.isRequired,
    createActivity: PropTypes.func.isRequired,
    removeActivity: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      changing: null,
      adding: null,
    };

    this.onChangeActivity = this.onChangeActivity.bind(this);
  }

  onChangeActivity(id) {
    this.setState({ changing: (this.state.changing !== id) ? id : null, adding: null });
  }

  onAddActivity(type) {
    this.setState({ adding: (this.state.adding !== type) ? type : null, changing: null });
  }

  onGetActivity(id) {
    this.props.getActivity(id);
  }

  getCarrierName(carrierId) {
    const { carriersList } = this.props;
    let carrierName = '';

    for (let k = 0; k < Object.keys(carriersList).length; k += 1) {
      const product = Object.keys(carriersList)[k];

      for (let i = 0; i < carriersList[product].length; i += 1) {
        const carrier = carriersList[product][i];

        if (carrier.value === carrierId) {
          carrierName = carrier.text;
          break;
        }
      }
    }

    return carrierName;
  }

  getValue(value, item) {
    const type = item.type;
    if (type === TYPE_PROBABILITY) {
      return (<span style={{ color: getColorProbability(value) }} className="activity-type-probability">{value}</span>);
    } else if (type === TYPE_REWARD) {
      return (<span className="activity-type-probability">{value}</span>);
    } else if (type === TYPE_COMPETITIVE_INFO) {
      return (<span className={`activity-type-competitive ${item.option !== 'DIFFERENCE' ? 'hide-icon' : ''}`}>{(value > 0) ? `+${value}` : value}{item.option === 'DIFFERENCE' ? '%' : ''}</span>);
    } else if (type === TYPE_RENEWAL_ADDED) {
      return (<span className={'activity-type-competitive type-renewal'}>{(value > 0) ? `+${parseInt(value, 10)}` : parseInt(value, 10)}%</span>);
    } else if (type === TYPE_OPTION1_RELEASED) {
      return (<span className="activity-type-released" style={{ backgroundColor: getColor(value) }}>{(value > 0) ? `+${parseFloat(parseFloat(value).toFixed(1))}` : parseFloat(parseFloat(value).toFixed(1))}</span>);
    }

    return (<span>{value}</span>);
  }

  render() {
    const {
      activities,
      changeActivitySort,
      sort,
      currentActivity,
      productsList,
      carriersList,
      changeActivity,
      updateActivity,
      removeActivity,
      getActivityByType,
      createActivity,
      mainCarrier,
    } = this.props;
    return (
      <Card className="card-main activity" fluid>
        <Card.Content>
          <Card.Header>
            Activity
            <div className="header-buttons">
              <Button basic onClick={() => { this.onAddActivity(TYPE_COMPETITIVE_INFO); }}>Add Competitive Info</Button>
              <Button basic onClick={() => { this.onAddActivity(TYPE_PROBABILITY); }}>Change Probability</Button>
              { CARRIER === 'ANTHEM' && <Button basic onClick={() => { this.onAddActivity(TYPE_REWARD); }}>Send Reward</Button> }
            </div>
          </Card.Header>
          { this.state.adding === TYPE_COMPETITIVE_INFO &&
          <ActivityCompetitiveInfo
            item={currentActivity}
            saveButtonText={'Add Competitive Info'}
            productsList={productsList}
            carriersList={carriersList}
            onCancel={() => { this.onAddActivity(TYPE_COMPETITIVE_INFO); }}
            onStart={() => { getActivityByType(TYPE_COMPETITIVE_INFO); }}
            onEdit={changeActivity}
            onSave={createActivity}
          />
          }
          { this.state.adding === TYPE_PROBABILITY &&
          <ActivityProbability
            item={currentActivity}
            saveButtonText={'Change Probability'}
            onCancel={() => { this.onAddActivity(TYPE_PROBABILITY); }}
            onStart={() => { getActivityByType(TYPE_PROBABILITY); }}
            onEdit={changeActivity}
            onSave={createActivity}
          />
          }
          { this.state.adding === TYPE_REWARD &&
          <ActivityReward
            item={currentActivity}
            saveButtonText={'Send Reward'}
            onCancel={() => { this.onChangeActivity(TYPE_REWARD); }}
            onStart={() => { getActivityByType(TYPE_REWARD); }}
            onEdit={changeActivity}
            onSave={createActivity}
          />
          }
          <Table sortable className="not-celled" unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  width={1}
                  textAlign="center"
                  sorted={(sort.prop === 'created') ? sort.order : 'ascending'}
                  className={(sort.prop !== 'created') ? 'sort-inactive' : ''}
                  onClick={() => { changeActivitySort('created'); }}
                >
                  DATE
                </Table.HeaderCell>
                <Table.HeaderCell
                  width={2}
                  textAlign="center"
                  sorted={(sort.prop === 'type') ? sort.order : 'ascending'}
                  className={(sort.prop !== 'type') ? 'sort-inactive' : ''}
                  onClick={() => { changeActivitySort('type'); }}
                >
                  Activity
                </Table.HeaderCell>
                <Table.HeaderCell
                  colSpan="2"
                  width={13}
                  sorted={(sort.prop === 'notes') ? sort.order : 'ascending'}
                  className={(sort.prop !== 'notes') ? 'sort-inactive' : ''}
                  onClick={() => { changeActivitySort('notes'); }}
                >
                  Description
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            { activities.length > 0 &&
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan="4" className="without-padding">
                    { activities.map((item, i) =>
                      <Table key={i} className="inner-table not-celled" unstackable>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell width={1} textAlign="center" verticalAlign="top">
                              {getDate(item.created)}
                            </Table.Cell>
                            <Table.Cell width={2} textAlign="center" verticalAlign="top">
                              {this.getValue(item.value, item)}
                            </Table.Cell>
                            <Table.Cell verticalAlign="top" width={12}>
                              {(item.carrierId !== mainCarrier.carrierId) ? `${this.getCarrierName(item.carrierId)} ` : ''}
                              {item.notes}
                            </Table.Cell>
                            <Table.Cell textAlign="right" width={1} verticalAlign="top">
                              { item.type !== TYPE_OPTION1_RELEASED && item.type !== TYPE_QUOTE_VIEWED && item.type !== TYPE_RENEWAL_ADDED && <a tabIndex={0} className="edit-button" onClick={() => { this.onChangeActivity(item.activityId); }}><Icon name="pencil" /></a> }
                              { item.type !== TYPE_OPTION1_RELEASED && item.type !== TYPE_QUOTE_VIEWED && item.type !== TYPE_RENEWAL_ADDED && <a tabIndex={0} className="edit-button" onClick={() => { removeActivity(item.activityId); }}><Icon name="remove" /></a> }
                            </Table.Cell>
                          </Table.Row>
                          { this.state.changing === item.activityId &&
                          <Table.Row>
                            <Table.Cell colSpan="4" className="without-padding">
                              { item.type === TYPE_COMPETITIVE_INFO &&
                              <ActivityCompetitiveInfo
                                item={currentActivity}
                                saveButtonText={'Save Info'}
                                productsList={productsList}
                                carriersList={carriersList}
                                onCancel={() => { this.onChangeActivity(item.activityId); }}
                                onStart={() => { this.onGetActivity(item.activityId); }}
                                onEdit={changeActivity}
                                onSave={() => { updateActivity(item.activityId); }}
                              />
                              }
                              { item.type === TYPE_PROBABILITY &&
                              <ActivityProbability
                                item={currentActivity}
                                saveButtonText={'Save Info'}
                                onCancel={() => { this.onChangeActivity(item.activityId); }}
                                onStart={() => { this.onGetActivity(item.activityId); }}
                                onEdit={changeActivity}
                                onSave={() => { updateActivity(item.activityId); }}
                              />
                              }
                              { item.type === TYPE_OPTION1_RELEASED &&
                              <ActivityOption1Released
                                item={currentActivity}
                                saveButtonText={'Save Info'}
                                productsList={productsList}
                                onCancel={() => { this.onChangeActivity(item.activityId); }}
                                onStart={() => { this.onGetActivity(item.activityId); }}
                                onEdit={changeActivity}
                                onSave={() => { updateActivity(item.activityId); }}
                              />
                              }
                              { item.type === TYPE_REWARD &&
                              <ActivityReward
                                item={currentActivity}
                                saveButtonText={'Save Info'}
                                onCancel={() => { this.onChangeActivity(item.activityId); }}
                                onStart={() => { this.onGetActivity(item.activityId); }}
                                onEdit={changeActivity}
                                onSave={() => { updateActivity(item.activityId); }}
                              />
                              }
                            </Table.Cell>
                          </Table.Row>
                          }
                        </Table.Body>
                      </Table>
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            }
            { !activities.length &&
            <Table.Body>
              <Table.Row>
                <Table.Cell colSpan="4" className="empty" textAlign="center">
                  No Activities
                </Table.Cell>
              </Table.Row>
            </Table.Body>
            }
          </Table>
        </Card.Content>
      </Card>
    );
  }
}

export default Activity;
