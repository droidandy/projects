import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getDate } from '../../../../utils/query';

class ClientsListTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    NewRfps: PropTypes.array.isRequired,
    InProgress: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    changePreQuotedSort: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.scrollBar.setScrollTop(0);
  }


  render() {
    const {
      NewRfps,
      InProgress,
      sort,
      changePreQuotedSort,
    } = this.props;
    let headerList = [];

    if (InProgress && InProgress.length) headerList = InProgress;
    else if (NewRfps && NewRfps.length) headerList = NewRfps;

    return (
      <PerfectScrollbar ref={(ref) => { this.scrollBar = ref; }} className="clients-table-wrap">
        <Table sortable celled singleLine fixed unstackable>
          {headerList.length > 0 && <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                width="2"
                className={(sort.prop !== 'name') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'name') ? sort.order : 'ascending'}
                onClick={() => {
                  changePreQuotedSort('name');
                }}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                width="1"
                className={(sort.prop !== 'effectiveDate') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'effectiveDate') ? sort.order : 'ascending'}
                onClick={() => {
                  changePreQuotedSort('effectiveDate');
                }}
              >
                Effective Date
              </Table.HeaderCell>
              <Table.HeaderCell
                width="1"
                className={(sort.prop !== 'sae') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'sae') ? sort.order : 'ascending'}
                onClick={() => {
                  changePreQuotedSort('sae');
                }}
              >
                SAE
              </Table.HeaderCell>
              <Table.HeaderCell
                textAlign="center"
                width="1"
                className={(sort.prop !== 'brokerage') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'brokerage') ? sort.order : 'ascending'}
                onClick={() => {
                  changePreQuotedSort('brokerage');
                }}
              >
                Brokerage
              </Table.HeaderCell>
              <Table.HeaderCell
                width="2"
                className={(sort.prop !== 'status') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'status') ? sort.order : 'ascending'}
                onClick={() => {
                  changePreQuotedSort('status');
                }}
              >
                Status
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          }
          { NewRfps.length > 0 &&
          <Table.Body className="data-row">
            <Table.Row>
              <Table.Cell colSpan="5" className="table-title" textAlign="center" style={{ fontSize: '10px' }}>NEW RFPS RECEIVED</Table.Cell>
            </Table.Row>
            {NewRfps && NewRfps.length > 0 && NewRfps.map((item, key) => (
              <Table.Row key={key} className="data-row">
                <Table.Cell>
                  <Link to={`/client/${item.clientId}`}>
                    {item.new && <span className="clients-table-new">new</span>}
                    {item.clientName}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {getDate(item.effectiveDate)}
                </Table.Cell>
                <Table.Cell>
                  {item.presalesName}
                </Table.Cell>
                <Table.Cell>
                  {item.brokerName}
                </Table.Cell>
                <Table.Cell>
                  {item.clientState}
                  <Button
                    className="view-btn"
                    as={Link}
                    floated="right"
                    size="medium"
                  >View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          }
          { InProgress.length > 0 &&
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan="5" className="table-title" textAlign="center" style={{ fontSize: '10px' }}>CLIENTS IN PROGRESS</Table.Cell>
            </Table.Row>
            {InProgress && InProgress.length > 0 && InProgress.map((item, key) => (
              <Table.Row key={key}>
                <Table.Cell>
                  <Link to={`/prequote/clients/${item.clientId}`}>
                    {item.new && <span>new</span>}
                    {item.clientName}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {getDate(item.effectiveDate)}
                </Table.Cell>
                <Table.Cell>
                  {item.presalesName}
                </Table.Cell>
                <Table.Cell>
                  {item.brokerName}
                </Table.Cell>
                <Table.Cell>
                  {item.clientState}
                  <Button
                    as={Link}
                    className="view-btn"
                    to={`/prequote/clients/${item.clientId}`}
                    floated="right"
                    size="medium"
                  >View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          }
          { !headerList.length &&
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan="9" className="empty" textAlign="center">
                No Clients
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          }
        </Table>
      </PerfectScrollbar>
    );
  }
}

export default ClientsListTable;
