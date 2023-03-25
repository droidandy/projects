import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Link } from 'react-router';
import { Card, Dropdown, Grid, Table, Image } from 'semantic-ui-react';
import { getColorSimple } from '../../../utils/getColor';
import { CARRIER, carriers } from '../../../config';
import { ON_BOARDING_STATE, SOLD_STATE, PENDING_APPROVAL_STATE, QUOTED_STATE, CLOSED_STATE } from '../../../pages/Home/constants';

class CarriersChart extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    productsList: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired,
    changeProduct: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
  };

  setFilter(item) {
    if (this.props.title === 'Market') {
      this.props.setFilters({
        competitiveInfoCarrier: {
          name: item.carrierName,
          displayName: item.carrierDisplayName,
        },
        product: this.props.product,
        clientStates: [
          SOLD_STATE,
          ON_BOARDING_STATE,
          CLOSED_STATE,
          QUOTED_STATE,
          PENDING_APPROVAL_STATE,
        ],
      });
    } else {
      this.props.setFilters({
        carriers: [{ id: item.carrierId, displayName: item.carrierDisplayName }],
        product: this.props.product,
        clientStates: [
          SOLD_STATE,
          ON_BOARDING_STATE,
          CLOSED_STATE,
          QUOTED_STATE,
          PENDING_APPROVAL_STATE,
        ],
      });
    }
  }

  render() {
    const { productsList, product, changeProduct, data, title } = this.props;

    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            {(CARRIER === 'UHC') ? carriers[CARRIER].toUpperCase() : carriers[CARRIER]} <span className="lower"> vs. </span> {title}
            <span className="header-actions">
              <Dropdown
                search
                selection
                options={productsList}
                value={product}
                onChange={(e, inputState) => { changeProduct(inputState.value); }}
              />
            </span>
          </Card.Header>
          <Grid.Row>
            <Grid.Column width="16">
              <Table className="bordered table-carriers" singleLine fixed unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={5} className="card-sub-title">
                      Carrier
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" width={2} className="card-sub-title border-right">
                      GROUPS
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="right" width={4} className="card-sub-title">
                      Avg % Diff
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="right" width={4} className="card-sub-title">
                      Median %
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {data.length > 0 &&
                  <Table.Body className="data-table">
                    { data.map((item, i) => {
                      if (i <= 5) {
                        return (
                          <Table.Row key={i}>
                            <Table.Cell textAlign="center" verticalAlign="middle">
                              <div>
                                <Image centered src={item.logoUrl} />
                              </div>
                            </Table.Cell>
                            <Table.Cell className="align-right border-right">
                              <Link to="/clients" onClick={() => { this.setFilter(item); }}><FormattedNumber value={item.groups} /></Link>
                            </Table.Cell>
                            <Table.Cell className="average-count align-right" style={{ color: getColorSimple(item.avgDiffPercent) }}>
                              {item.avgDiffPercent > 0 ? '+' : ''}<FormattedNumber value={item.avgDiffPercent} />
                            </Table.Cell>
                            <Table.Cell className="average-count align-right" style={{ color: getColorSimple(item.medianDiffPercent) }}>
                              {item.medianDiffPercent > 0 ? '+' : ''}<FormattedNumber value={item.medianDiffPercent} />
                            </Table.Cell>
                          </Table.Row>
                        );
                      }
                      return null;
                    })}
                  </Table.Body>
                }
              </Table>
              { !data.length &&
                <div className="empty-body">
                  No Data
                </div>
              }
            </Grid.Column>
          </Grid.Row>
        </Card.Content>
      </Card>
    );
  }
}

export default CarriersChart;
