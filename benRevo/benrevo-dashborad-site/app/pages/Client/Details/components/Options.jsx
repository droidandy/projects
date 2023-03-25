import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Slider from 'react-slick';
import { Card, Grid, Dropdown, Table, Image, Button, Loader } from 'semantic-ui-react';
import CustomArrow from './SlideArrow';
import { ACCESS_STATUS_WAITING, STATE_RFP_STARTED, STATE_RFP_SUBMITTED } from '../constants';
import { DTQ_NORMAL } from '../../../Home/constants';
import CompetitiveVsCurrent from './CompetitiveVsCurrent';
import OptionDetails from './OptionDetails';
import { getLogo, getClass } from '../utils';
import { getColor, getColorProbability } from './../../../../utils/getColor';
import { getDate, mappingClientState } from '../../../../utils/query';
import { getRole } from '../../../../utils/authService/lib';
import { ROLE_RENEWAL_SAE, ROLE_RENEWAL_MANAGER } from '../../../../utils/authService/constants';

class DetailsOptions extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    optionsProduct: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    productsList: PropTypes.array.isRequired,
    changeOptionsProduct: PropTypes.func.isRequired,
    clients: PropTypes.array.isRequired,
    getOption: PropTypes.func.isRequired,
    changeAccessStatus: PropTypes.func.isRequired,
    optionDetails: PropTypes.object.isRequired,
    optionRiders: PropTypes.object.isRequired,
    role: PropTypes.array.isRequired,
  };

  render() {
    const { role, client, productsList, optionsProduct, changeOptionsProduct, clients, getOption, changeAccessStatus, loading } = this.props;
    const showQuoteButton = client.clientState !== STATE_RFP_STARTED && client.clientState !== STATE_RFP_SUBMITTED;
    const dtq = client.quoteType === 'DECLINED';
    const settings = {
      dots: false,
      infinite: false,
      variableWidth: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        { breakpoint: 870, settings: { slidesToShow: 1 } },
        { breakpoint: 1180, settings: { slidesToShow: 2 } },
        { breakpoint: 100000, settings: { slidesToShow: 4 } },
      ],
    };
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            {optionsProduct.toLowerCase()} Options <span className="items-count">({client.options.length})</span>
            <span className="header-actions">
              <Dropdown
                search
                selection
                options={productsList}
                value={optionsProduct}
                onChange={(e, inputState) => { changeOptionsProduct(client.clientId, inputState.value); }}
              />
              { showQuoteButton && <Button as={Link} style={{ marginRight: 0 }} primary color="black" to={`/client/${client.clientId}`} onClick={() => { changeAccessStatus(ACCESS_STATUS_WAITING); }}>Access Broker Account</Button> }
              { !showQuoteButton && <span className="quote-message">No quote options available to be displayed.</span> }
            </span>
          </Card.Header>
          { loading &&
            <div className="loading-panel">
              <Loader inline indeterminate active={loading} size="big">Fetching options</Loader>
            </div>
          }
          { !loading &&
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  { !client.options.length && <div className="options-empty">No Options</div> }
                  { client.options.length > 0 && <Slider className="options-slider" nextArrow={<CustomArrow direction="next" />} prevArrow={<CustomArrow direction="prev" />} {...settings}>
                    { client.options.map((item, i) =>
                      <div className="option-card" key={i}>
                        <Card>
                          <div className="option-name">{item.name}</div>
                          <div className={`${getClass(item.carrier, item.quoteType)} option-carrier`}>
                            <Image src={getLogo(item.carrier, item.quoteType)} />
                          </div>
                          <Grid className="option-info">
                            <Grid.Row>
                              <Grid.Column width="8">
                                <div className="option-info-title">PLAN TYPES</div>
                                <Table celled unstackable className="full-celled">
                                  <Table.Body>
                                    { item.planTypes.map((planType, j) => {
                                      if (j % 2 === 0 && j <= 6) {
                                        return (
                                          <Table.Row key={j}>
                                            <Table.Cell>
                                              {item.planTypes[j]}
                                            </Table.Cell>
                                            { (item.planTypes[j + 1] || j > 1) &&
                                            <Table.Cell>
                                              {item.planTypes[j + 1]}
                                            </Table.Cell>
                                            }
                                          </Table.Row>
                                        );
                                      }

                                      return null;
                                    })}
                                  </Table.Body>
                                </Table>
                              </Grid.Column>
                              <Grid.Column width="8" textAlign="right">
                                <div className="option-info-title">DIFFERENCE</div>
                                <div className="option-difference" style={{ backgroundColor: getColor(item.percentDifference) }}>
                                  {(item.percentDifference > 0) ? '+' : ''}{item.percentDifference}
                                </div>
                                <OptionDetails
                                  id={item.id}
                                  getOption={getOption}
                                  optionDetails={this.props.optionDetails}
                                  optionRiders={this.props.optionRiders}
                                />
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Card>
                      </div>
                    )}
                  </Slider> }
                  <Grid.Column>
                    <Grid stackable>
                      <Grid.Row>
                        <Grid.Column width="10">
                          { !(getRole(role, [ROLE_RENEWAL_SAE, ROLE_RENEWAL_MANAGER])) &&
                          <div className="card-header">
                            {optionsProduct.toLowerCase()} - Competitive <span className="card-header-lower">vs</span>
                            <span> Current ({client.currentCarrierName}{client.quoteType === 'KAISER' ? ' + Kaiser)' : ')'}</span>
                          </div>
                          }
                          <CompetitiveVsCurrent client={client} clients={clients} role={role} />
                        </Grid.Column>
                        <Grid.Column width="6">
                          <Grid>
                            <Grid.Row>
                              <Grid.Column widht="2" />
                              <Grid.Column width="8">
                                <div className="card-header card-header-text">
                                  Status
                                </div>
                                <div className={`client-detail-item client-detail-item-status ${dtq ? 'client-detail-item-status-dtq' : ''}`}>{!dtq ? mappingClientState(client.clientState) : DTQ_NORMAL}</div>
                              </Grid.Column>
                              <Grid.Column width="6">
                                <div className="card-header">
                                  Probability
                                </div>
                                <div className="client-detail-item" style={{ backgroundColor: getColorProbability(client.probability) }}>{client.probability}</div>
                              </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column textAlign="right">
                                <div className="effective-date">Effective Date: {getDate(client.effectiveDate)}</div>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          }

        </Card.Content>
      </Card>
    );
  }
}

export default DetailsOptions;
