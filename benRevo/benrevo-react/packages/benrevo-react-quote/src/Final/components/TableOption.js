import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Button, Popup } from 'semantic-ui-react';
import { Link } from 'react-router';
import { FormattedNumber } from 'react-intl';
import {
  QuoteMedicalImage,
  QuoteDentalImage,
  QuoteVisionImage,
  QuoteDollarImage,
} from '@benrevo/benrevo-react-core';
import CarrierLogo from './../../CarrierLogo';
import { PLAN_TYPE_MEDICAL, PLAN_TYPE_DENTAL, PLAN_TYPE_VISION, LIFE, STD, LTD, SUPP_LIFE, STD_LTD, HEALTH } from '../../constants';

class TableOption extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    type: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    optionsUnSelect: PropTypes.func.isRequired,
    showAction: PropTypes.bool.isRequired,
    showKaiserMessage: PropTypes.bool.isRequired,
    showDentalDiscount: PropTypes.number,
    showVisionDiscount: PropTypes.number,
    data: PropTypes.array,
    total: PropTypes.number,
    id: PropTypes.number,
    name: PropTypes.string,
    medicalTotal: PropTypes.number,
    discount: PropTypes.object,
    extendedBundleDiscount: PropTypes.object,
  };

  render() {
    const {
      type,
      showAction,
      data,
      total,
      optionsUnSelect,
      id,
      name,
      medicalTotal,
      discount,
      showDentalDiscount,
      showVisionDiscount,
      extendedBundleDiscount,
      showKaiserMessage,
      link,
    } = this.props;
    let image;
    const allowKaiser = type === PLAN_TYPE_MEDICAL && discount.medicalWithoutKaiserTotal > 0 && showKaiserMessage;
    const showDental = type === PLAN_TYPE_MEDICAL && showDentalDiscount > 0 && discount.dentalBundleDiscountPercent > 0;
    const showVision = type === PLAN_TYPE_MEDICAL && showVisionDiscount > 0 && discount.visionBundleDiscountPercent > 0;
    const extDisc1 = type === PLAN_TYPE_MEDICAL && (extendedBundleDiscount[LIFE] || extendedBundleDiscount[SUPP_LIFE]);
    const extDisc2 = type === PLAN_TYPE_MEDICAL && (extendedBundleDiscount[LTD] || extendedBundleDiscount[STD_LTD]);
    const extDisc3 = type === PLAN_TYPE_MEDICAL && (extendedBundleDiscount[STD] || extendedBundleDiscount[HEALTH]);
    const empty = !name;
    if (type === 'medical') image = QuoteMedicalImage;
    else if (type === 'dental') image = QuoteDentalImage;
    else if (type === 'vision') image = QuoteVisionImage;

    return (
      <Table celled basic className="full-celled">
        <Table.Header>
          <Table.Row className="headerTop">
            <Table.HeaderCell colSpan="5">
              <Image className="section-icon" src={image} />
              <span>{type} plans {!empty && (`- ${name}`) }</span>
              {data.length > 0 && <CarrierLogo carrier={data[0].carrier} quoteType={data[0].quoteType} section={type} /> }
              {!empty && showAction && <a className="remove-button" tabIndex="0" onClick={() => { optionsUnSelect(type, id); }}>Remove</a>}
            </Table.HeaderCell>
          </Table.Row>
          {!empty &&
          <Table.Row className="headerBottom">
            <Table.HeaderCell width={5}>Plan Name</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">Plan Type</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">Employer Monthly Cost</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">Employee Monthly Cost</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">Total <br />Monthly Cost</Table.HeaderCell>
          </Table.Row>
          }
        </Table.Header>
        <Table.Body className="stripedBack">
          {!empty &&
            data.map((item, i) =>
              <Table.Row key={i}>
                <Table.Cell className="plan-name">{item.name}</Table.Cell>
                <Table.Cell textAlign="right">{item.type}</Table.Cell>
                <Table.Cell textAlign="right">
                  <FormattedNumber
                    style="currency" // eslint-disable-line react/style-prop-object
                    currency="USD"
                    maximumFractionDigits={2}
                    minimumFractionDigits={0}
                    value={item.employer}
                  />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <FormattedNumber
                    style="currency" // eslint-disable-line react/style-prop-object
                    currency="USD"
                    maximumFractionDigits={2}
                    minimumFractionDigits={0}
                    value={item.employee}
                  />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <FormattedNumber
                    style="currency" // eslint-disable-line react/style-prop-object
                    currency="USD"
                    maximumFractionDigits={2}
                    minimumFractionDigits={0}
                    value={item.total}
                  />
                </Table.Cell>
              </Table.Row>
            )
          }
          {empty &&
          <Table.Row className="empty-option">
            <Table.Cell colSpan="5">
              <span>(No option selected)</span>
              { showAction &&
                <span className="add-option">
                  { type !== PLAN_TYPE_MEDICAL && medicalTotal > 0 && ((type === PLAN_TYPE_DENTAL && discount.dentalBundleDiscount > 0) || (type === PLAN_TYPE_VISION && discount.visionBundleDiscount > 0)) &&
                  <span>
                    <Image src={QuoteDollarImage} />
                    <span className="blue">Add {type} and</span>
                    <span className="red">Save
                      <FormattedNumber
                        style="currency" // eslint-disable-line react/style-prop-object
                        currency="USD"
                        maximumFractionDigits={2}
                        minimumFractionDigits={0}
                        value={(type === PLAN_TYPE_DENTAL) ? discount.dentalBundleDiscount : discount.visionBundleDiscount}
                      />
                    </span>
                  </span>
                  }
                  <Popup
                    position="top center"
                    size="small"
                    trigger={<span className="field-info" style={{ left: '-20px' }} />}
                    content="Illustrative discount only. Confirm applicability with UnitedHealthcare."
                    inverted
                  />
                  <Button size="medium" primary as={Link} to={`${link}/${type}`}>Add</Button>
                </span>
              }
            </Table.Cell>
          </Table.Row>
          }
        </Table.Body>
        {!empty &&
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="5" textAlign="right" width="16">
              <div className={`${type === PLAN_TYPE_MEDICAL && (showDental || showVision || extDisc1 || extDisc2 || extDisc3) ? 'total-row' : ''}`}>
                <span className="total-row-title">Total Annual {type} Cost:</span>
                <span className="total-row-sum">
                  <FormattedNumber
                    style="currency" // eslint-disable-line react/style-prop-object
                    currency="USD"
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                    value={total}
                  />
                </span>
              </div>

            </Table.HeaderCell>
          </Table.Row>
          { type === PLAN_TYPE_MEDICAL && (showDental || showVision || extDisc1 || extDisc2 || extDisc3) &&
            <Table.Row>
              <Table.HeaderCell colSpan="5" textAlign="right" className="discounts-cell">
                { allowKaiser &&
                  <div className="table-footer-wrap">
                    <span className="table-footer-title">Subtotal of Anthem plans: </span>
                    <span className="table-footer-sum red">
                      <FormattedNumber
                        style="currency" // eslint-disable-line react/style-prop-object
                        currency="USD"
                        maximumFractionDigits={2}
                        minimumFractionDigits={2}
                        value={discount.medicalWithoutKaiserTotal || 0}
                      />
                    </span>
                  </div>
                }
                { showDental &&
                <div className="table-footer-wrap">
                  <span className="table-footer-title">Dental bundle discount applied{ allowKaiser ? '*' : '' }: </span>
                  <span className="table-footer-sum red">
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      value={discount.dentalBundleDiscount}
                    /> (-{discount.dentalBundleDiscountPercent}%)

                  </span>
                </div>
                }
                { showVision &&
                <div className="table-footer-wrap">
                  <span className="table-footer-title">Vision bundle discount applied{ allowKaiser ? '*' : '' }: </span>
                  <span className="table-footer-sum red">
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      value={discount.visionBundleDiscount}
                    /> (-{discount.visionBundleDiscountPercent}%)
                  </span>
                </div>
                }
                { extDisc1 &&
                <div className="table-footer-wrap">
                  <span className="table-footer-title">{extDisc1.displayName} Bundle Discount applied{ allowKaiser ? '*' : '' }: </span>
                  <span className="table-footer-sum red">
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      value={extDisc1.discount}
                    /> (-{extDisc1.discountPercent}%)
                  </span>
                </div>
                }
                { extDisc2 &&
                <div className="table-footer-wrap">
                  <span className="table-footer-title">{extDisc2.displayName} Bundle Discount applied{ allowKaiser ? '*' : '' }: </span>
                  <span className="table-footer-sum red">
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      value={extDisc2.discount}
                    /> (-{extDisc2.discountPercent}%)
                  </span>
                </div>
                }
                { extDisc3 &&
                <div className="table-footer-wrap">
                  <span className="table-footer-title">{extDisc3.displayName} Bundle Discount applied{ allowKaiser ? '*' : '' }: </span>
                  <span className="table-footer-sum red">
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      maximumFractionDigits={2}
                      minimumFractionDigits={2}
                      value={extDisc3.discount}
                    /> (-{extDisc3.discountPercent}%)
                  </span>
                </div>
                }
                { allowKaiser && (showDental || showVision || extDisc1 || extDisc2 || extDisc3) &&
                  <div className="allow-kaiser-note">
                    *Discount bundles do not apply to Kaiser
                  </div>
                }
              </Table.HeaderCell>
            </Table.Row>
          }
        </Table.Footer>
        }
      </Table>
    );
  }
}

export default TableOption;
