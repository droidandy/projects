import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Table, Image } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { ROLE_IMPLEMENTATION_MANAGER, getRole, DownImg } from '@benrevo/benrevo-react-core';
import { ON_BOARDING_NORMAL, getClient, setRouteError } from '@benrevo/benrevo-react-clients';
import TableItem from './components/TableItem';
import { getTimeline, complete, updateProjectTime, updateCompleted, initTimeline, clear } from './actions';
import { selectTimelineIsEnabled } from './selectors';

class Timeline extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    admin: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    clientLoading: PropTypes.bool.isRequired,
    timelineIsEnabled: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    clientId: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    getTimeline: PropTypes.func.isRequired,
    updateProjectTime: PropTypes.func.isRequired,
    updateCompleted: PropTypes.func.isRequired,
    complete: PropTypes.func.isRequired,
    getClient: PropTypes.func.isRequired,
    initTimeline: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      clientLoading: true,
    };
  }

  componentWillMount() {
    const { clientId, getClient, client } = this.props;
    if (client.id !== +clientId) getClient(clientId);
    else this.start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.client.id && !this.props.client.id) {
      this.start(nextProps);
    } else if (nextProps.client.id === undefined && !nextProps.clientLoading && this.state.clientLoading) {
      this.setState({ clientLoading: false });
      nextProps.redirect();
    }
  }

  start(props = this.props) {
    const { client, getTimeline, redirect, timelineIsEnabled, initTimeline, clear, admin } = props;
    const clientState = client.clientState;
    if (clientState !== ON_BOARDING_NORMAL || (!timelineIsEnabled && !admin)) {
      redirect();
      return;
    }
    this.setState({ clientLoading: false });
    clear();

    if (client.timelineEnabled === false) {
      initTimeline();
    }

    if (client.timelineEnabled === true || timelineIsEnabled) {
      getTimeline();
    }
  }

  render() {
    const { data, updateProjectTime, updateCompleted, admin, client, timelineIsEnabled, loading, initTimeline } = this.props;
    if (!this.state.clientLoading) {
      return (
        <div>
          <Helmet
            title="Timeline"
            meta={[
              { name: 'description', content: 'Description of Timeline' },
            ]}
          />
          <Grid stackable container className="timeline section-wrap">
            <Grid.Column width={16}>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row>
                  <Grid.Column width={16}>
                    <span className="clientName">Client: {client.clientName}</span>
                    <Header as="h1" className="page-heading">Timeline</Header>
                    <Table attached="top" basic stackable sortable className="main-table">
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell width="1">REF#</Table.HeaderCell>
                          <Table.HeaderCell width="6">Milestone</Table.HeaderCell>
                          <Table.HeaderCell width="3">Responsibility</Table.HeaderCell>
                          <Table.HeaderCell width="2">Projected completion</Table.HeaderCell>
                          <Table.HeaderCell width="4">Status</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                    </Table>
                    {data.map((item, i) =>
                      <Table attached selectable key={i} className="main-table">
                        <Table.Body>
                          <Table.Row className="dividerHeaderRow">
                            <Table.Cell colSpan="5">
                              <strong>{item.name}</strong>
                            </Table.Cell>
                          </Table.Row>
                          { item.timelines.map((elem, j) =>
                            <TableItem
                              key={j}
                              parentIndex={i}
                              childIndex={j}
                              item={elem}
                              updateProjectTime={updateProjectTime}
                              updateCompleted={updateCompleted}
                              admin={admin}
                            />
                          )}
                        </Table.Body>
                      </Table>
                    )}
                    {!data.length && timelineIsEnabled &&
                    <Table attached="bottom" className="main-table">
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell colSpan="5" textAlign="center">
                            <div className="clients-empty">You currently have no tasks.</div>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    }
                    {!data.length && !timelineIsEnabled && !loading && admin &&
                    <Table className="main-table">
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell colSpan="5" textAlign="center" className="table-empty">
                            <div className="table-empty-inner">
                              <div>You currently have no timeline</div>
                              <div className="title">Start here</div>
                              <Image src={DownImg} />
                              <div><a tabIndex={0} rel="button" className="main-button" onClick={initTimeline}>Start Timeline</a></div>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
      );
    }

    return (<div />);
  }
}

function mapStateToProps(state, ownProps) {
  const profile = state.get('profile');
  const admin = getRole(profile.get('brokerageRole').toJS(), [ROLE_IMPLEMENTATION_MANAGER]);
  const clientsState = state.get('clients');
  const timelineState = state.get('timeline');
  const clientId = ownProps.params.clientId;
  return {
    client: clientsState.get('current').toJS(),
    clientLoading: clientsState.get('loading'),
    loading: timelineState.get('loading'),
    data: timelineState.get('data').toJS(),
    timelineIsEnabled: selectTimelineIsEnabled(state),
    clientId,
    admin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTimeline: (clientId, carrierId) => { dispatch(getTimeline(clientId, carrierId)); },
    updateProjectTime: (timeLineId, timeLine, parentIndex, childIndex) => { dispatch(updateProjectTime(timeLineId, timeLine, parentIndex, childIndex)); },
    updateCompleted: (timeLine) => { dispatch(updateCompleted(timeLine)); },
    complete: (index) => { dispatch(complete(index)); },
    getClient: (clientId) => { dispatch(getClient(clientId)); },
    initTimeline: () => { dispatch(initTimeline()); },
    clear: () => { dispatch(clear()); },
    redirect: () => {
      dispatch(setRouteError(true, 'timeline'));
      dispatch(replace({
        pathname: '/clients',
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
