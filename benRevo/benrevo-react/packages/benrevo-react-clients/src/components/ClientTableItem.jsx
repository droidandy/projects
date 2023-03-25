import React from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router';
import {
  RFP_SUBMITTED_NORMAL, RFP_STARTED_NORMAL, QUOTED_NORMAL, ON_BOARDING_NORMAL, DIRECT_TO_PRESENTATION,
  TIMELINE_IS_ENABLED, CLOSED_NORMAL, SOLD_NORMAL,
} from '../constants';

export class ClientTableItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object.isRequired,
    showGAFeatures: PropTypes.bool.isRequired,
    selectClient: PropTypes.func,
    brokerClientsTimeline: PropTypes.bool.isRequired,
  };

  render() {
    const { item, selectClient, showGAFeatures, brokerClientsTimeline } = this.props;
    const clientState = item.clientState;
    let directToPresentation = false;
    let timelineIsEnabled = false;
    let members = '';
    item.clientMembers.forEach((member, i) => {
      members += member.fullName;
      if (i < item.clientMembers.length - 1) members += ', ';
    });

    for (let i = 0; i < item.attributes.length; i += 1) {
      if (item.attributes[i] === DIRECT_TO_PRESENTATION) {
        directToPresentation = true;
        break;
      }
    }

    for (let i = 0; i < item.attributes.length; i += 1) {
      if (item.attributes[i] === TIMELINE_IS_ENABLED) {
        timelineIsEnabled = true;
        break;
      }
    }

    return (
      <Table.Row name={item.clientName}>
        <Table.Cell><strong>{item.clientName}</strong></Table.Cell>
        { showGAFeatures && <Table.Cell width={3}>{item.brokerName}</Table.Cell> }
        <Table.Cell>{item.effectiveDate}</Table.Cell>
        <Table.Cell>{clientState}</Table.Cell>
        <Table.Cell width={4}>{members}</Table.Cell>
        <Table.Cell>
          <Dropdown text="Action" floating labeled button icon="chevron down" className="icon">
            <Dropdown.Menu>
              {!directToPresentation &&
                <Dropdown.Item
                  as={Link} to="/rfp/client"
                  onClick={() => { selectClient(item); }}
                >RFP
                </Dropdown.Item>
              }
              {!directToPresentation &&
                <Dropdown.Item
                  as={Link}
                  to="/clients/export"
                  onClick={() => { selectClient(item); }}
                >Export Client
                </Dropdown.Item>
              }
              <Dropdown.Item
                disabled={(typeof clientState === 'undefined' || clientState === RFP_SUBMITTED_NORMAL || clientState === RFP_STARTED_NORMAL) && clientState !== QUOTED_NORMAL}
                as={Link}
                to={`/presentation/${item.id}`}
                onClick={() => { selectClient(item); }}
              >Quote
              </Dropdown.Item>
              <Dropdown.Item
                disabled={typeof clientState === 'undefined' || (clientState !== ON_BOARDING_NORMAL && clientState !== CLOSED_NORMAL && clientState !== SOLD_NORMAL)}
                as={Link}
                to="/onboarding"
                onClick={() => { selectClient(item); }}
              >On-Boarding
              </Dropdown.Item>
              {brokerClientsTimeline && timelineIsEnabled &&
                <Dropdown.Item
                  disabled={typeof clientState === 'undefined' || clientState !== ON_BOARDING_NORMAL}
                  as={Link}
                  to={`/timeline/${item.id}`}
                  onClick={() => { selectClient(item); }}
                >Timeline
                </Dropdown.Item>
              }
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => { selectClient(item); }} as={Link} to='/team'>Team</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ClientTableItem;
