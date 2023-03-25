import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Grid, Dimmer, Loader, Header, Segment, Table, Form, Popup, Progress } from 'semantic-ui-react';

class ViewPlanDesign extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carriers: PropTypes.array.isRequired,
    selectedCarrier: PropTypes.object.isRequired,
    viewLoading: PropTypes.bool.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    getPlanDesign: PropTypes.func.isRequired,
    getPlanTypes: PropTypes.func.isRequired,
    planTypeList: PropTypes.array.isRequired,
    planType: PropTypes.string.isRequired,
    inputYear: PropTypes.number.isRequired,
    changeYear: PropTypes.func.isRequired,
    planDesignData: PropTypes.array.isRequired,
    benefitNames: PropTypes.array.isRequired,
    changePlanType: PropTypes.func.isRequired,
    viewProgress: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      nameOverflow: [],
      networkOverflow: [],
      heights: [],
    };
    this.setOverflow = this.setOverflow.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentWillMount() {
    const { getPlanTypes, selectedCarrier } = this.props;
    getPlanTypes(selectedCarrier.name);
  }

  setHeight(elem, index) {
    const { heights } = this.state;
    if (elem && elem.clientHeight) {
      heights[index] = elem.clientHeight;
      this.setState({ heights });
    }
  }

  setOverflow(elem, index, type) {
    const { nameOverflow, networkOverflow } = this.state;
    if (elem && (elem.clientHeight !== elem.scrollHeight || elem.clientWidth !== elem.scrollWidth)) {
      if (type === 'nameOverflow') {
        nameOverflow[index] = true;
        this.setState({ nameOverflow });
      }
      if (type === 'networkOverflow') {
        networkOverflow[index] = true;
        this.setState({ networkOverflow });
      }
    }
  }

  handleButtonClick(selectedCarrier, inputYear, planType) {
    const { getPlanDesign } = this.props;
    getPlanDesign(selectedCarrier, inputYear, planType);
    this.setState({ heights: [] });
  }

  render() {
    const { planType, planDesignData, carriers, selectedCarrier, viewLoading, changeCarrier,
            inputYear, changeYear, benefitNames, planTypeList, changePlanType, viewProgress } = this.props;

    const carrierList = carriers.map((item) => ({
      key: item.carrierId,
      value: item.carrierId,
      text: item.displayName,
    }));

    const currentYear = (new Date()).getFullYear();
    const yearList = [];
    for (let i = currentYear - 5; i < currentYear + 5; i += 1) {
      yearList.push({ key: i, value: i, text: i });
    }

    const planTypeOptions = planTypeList.map((item) => ({
      key: item,
      value: item,
      text: item,
    }));

    return (
      <div className="view-plan">
        <Helmet
          title="View Plan Designs"
          meta={[
            { name: 'description', content: 'View Plan Designs' },
          ]}
        />
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Grid.Column>
              <Header as="h2">View Plan Design</Header>
              <div className="divider" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Form.Group>
                  <Form.Dropdown
                    label="Choose a carrier"
                    fluid
                    placeholder="Choose carrier"
                    search
                    selection
                    options={carrierList}
                    value={selectedCarrier.carrierId}
                    onChange={(e, inputState) => { changeCarrier(inputState.value); }}
                  />
                  <Form.Dropdown
                    label="Choose a year"
                    fluid
                    placeholder="Choose year"
                    search
                    selection
                    options={yearList}
                    value={inputYear}
                    onChange={(e, inputState) => { changeYear(inputState.value); }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Dropdown
                    label="Choose plan type"
                    fluid
                    placeholder="Choose plan type"
                    search
                    selection
                    options={planTypeOptions}
                    value={planType}
                    onChange={(e, inputState) => { changePlanType(inputState.value); }}
                  />
                  <Form.Button primary size="tiny" onClick={() => { this.handleButtonClick(selectedCarrier, inputYear, planType); }}>Get Plan Design</Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
          { viewLoading &&
            <Grid.Row className="plan-design-loader">
              <Grid.Column>
                <Dimmer active inverted>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column>
                        <Loader indeterminate size="big">Getting Plan Design Data</Loader>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered>
                      <Grid.Column width={3}>
                        <Progress percent={viewProgress} indicating size="small" />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Dimmer>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row stretched className="table-row">
            { !viewLoading && planDesignData.length > 0 &&
              <Grid.Column width={3}>
                <Table striped fixed className="label-column">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Plan Name</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Type</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Network</Table.Cell>
                    </Table.Row>
                    { benefitNames.length > 0 && benefitNames.map((bName, nameIndex) => (
                      !this.state.heights[nameIndex] ?
                        <Table.Row key={`bnames_${nameIndex}`}>
                          <Table.Cell>
                            <div ref={(spanText) => this.setHeight(spanText, nameIndex)}>
                              {bName}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                        :
                        <Table.Row key={`bnames_${nameIndex}`}>
                          <Table.Cell>{bName}</Table.Cell>
                        </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Grid.Column>
            }
            { !viewLoading && planDesignData.length > 0 &&
              <Grid.Column width={13}>
                <PerfectScrollbar option={{ wheelPropagation: true, suppressScrollY: true }} ref={(c) => { this.scrollBar = c; }} className="plan-design-scrollbar">
                  <div className="plan-design-data" style={{ width: `${200 * planDesignData.length}px` }}>
                    { planDesignData.map((item, index) => (
                      <Table striped fixed singleLine textAlign="center" className="plan-design-column" key={`${item.id}_${index}`}>
                        <Table.Body>
                          <Table.Row>
                            { !this.state.nameOverflow[index] ?
                              <Table.Cell><div ref={(spanText) => this.setOverflow(spanText, index, 'nameOverflow')}>{item.planName}</div></Table.Cell>
                              :
                              <Popup
                                trigger={<Table.Cell>{item.planName}</Table.Cell>}
                                on={'hover'}
                                content={item.planName}
                                position={'top center'}
                                hideOnScroll
                              />
                            }
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>{item.planNetwork.type}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            { !this.state.networkOverflow[index] ?
                              <Table.Cell ref={(spanText) => this.setOverflow(spanText, index, 'networkOverflow')}>{item.planNetwork.name}</Table.Cell>
                              :
                              <Popup
                                trigger={<Table.Cell>{item.planNetwork.name}</Table.Cell>}
                                on={'hover'}
                                content={item.planNetwork.name}
                                position={'top center'}
                                hideOnScroll
                              />
                            }
                          </Table.Row>
                          { benefitNames.map((benefit, i) => {
                            const curBenefit = item.planBenefits.filter((inQuestion) => inQuestion.name === benefit);
                            if (curBenefit.length === 1) {
                              return (
                                <Table.Row key={`${index}_${i}`} className="benefit-data-cell">
                                  <Table.Cell singleLine={false} verticalAlign="middle">
                                    <div style={{ height: this.state.heights[i] }}>{`In-Network: ${curBenefit[0].value}`}</div>
                                  </Table.Cell>
                                </Table.Row>
                              );
                            } else if (curBenefit.length === 2) {
                              return (
                                <Table.Row key={`${index}_${i}`}>
                                  <Table.Cell singleLine={false} verticalAlign="middle" className="benefit-data-cell">
                                    <div style={{ height: this.state.heights[i] }}>
                                      <p>{`In-Network: ${curBenefit[0].value}`}</p>
                                      <p>{`Out-Network: ${curBenefit[1].value}`}</p>
                                    </div>
                                  </Table.Cell>
                                </Table.Row>
                              );
                            }
                            return (
                              <Table.Row key={`${index}_${i}`}>
                                <Table.Cell singleLine={false} verticalAlign="middle" className="benefit-data-cell">
                                  <div style={{ height: this.state.heights[i] }}>In-Network: -</div>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table>
                    ))}
                  </div>
                </PerfectScrollbar>
              </Grid.Column>
            }
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ViewPlanDesign;
