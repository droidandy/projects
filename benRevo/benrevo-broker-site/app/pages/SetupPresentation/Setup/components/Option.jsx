import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Image, Dropdown } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { CarrierLogo } from '@benrevo/benrevo-react-match';
import SetupMedical from '../../../../assets/img/svg/setup-medical.svg';
import SetupDental from '../../../../assets/img/svg/setup-dental.svg';
import SetupVision from '../../../../assets/img/svg/setup-vision.svg';
import deleteCarrierImage from './../../../../assets/img/svg/deleteCarrier.svg';

class SetupColumnOption extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    product: PropTypes.string.isRequired,
    isCurrent: PropTypes.bool.isRequired,
    showTitle: PropTypes.bool,
    presentationOptionId: PropTypes.string,
    data: PropTypes.object,
    options: PropTypes.object,
    updateAlternativeOption: PropTypes.func,
    deleteAlternativeOption: PropTypes.func,
  };

  static defaultProps = {
    showTitle: false,
    presentationOptionId: null,
    data: null,
    options: null,
    updateAlternativeOption: () => {},
    deleteAlternativeOption: () => {},
  };

  constructor(props) {
    super(props);
    this.icons = {
      medical: SetupMedical,
      dental: SetupDental,
      vision: SetupVision,
    };
  }

  render() {
    const {
      product,
      showTitle,
      data,
      isCurrent,
      updateAlternativeOption,
      deleteAlternativeOption,
      presentationOptionId,
    } = this.props;
    let options = [];
    if (this.props.options && this.props.options[product]) {
      options = (this.props.options && this.props.options[product]) && this.props.options[product].map((item) => ({
        key: item.id,
        value: item.id,
        text: item.displayName || item.name,
      }));
    }

    return (
      <div className="column-option">
        <div className="option-title">{showTitle && <Image src={this.icons[product]} inline verticalAlign="middle" />} {showTitle && product}</div>
        <Card className="option-card" as="div">
          {data &&
            <Card.Content>
              { data.rfpQuoteOptionId && <Image className="remove-button" role="button" src={deleteCarrierImage} onClick={() => deleteAlternativeOption(presentationOptionId, product, data.rfpQuoteOptionId)} /> }
              <CarrierLogo carrier={data.carrier || data.carrierName} quoteType={data.quoteType} section={product} />
              <Grid className="option-total">
                <Grid.Row>
                  <Grid.Column width={8}>
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      minimumFractionDigits={0}
                      maximumFractionDigits={0}
                      value={(data.totalAnnualPremium === undefined) ? data.total : data.totalAnnualPremium}
                    />
                  </Grid.Column>
                  { !isCurrent &&
                  <Grid.Column width={8}>
                    <span>{(data.percentDifference === undefined) ? data.percentage : data.percentDifference}%</span>
                  </Grid.Column>
                  }
                </Grid.Row>
              </Grid>
            </Card.Content>
          }
          {!data && presentationOptionId &&
            <Card.Content>
              <Dropdown
                placeholder="Choose Option"
                search
                selection
                options={options}
                onChange={(e, inputState) => {
                  updateAlternativeOption(presentationOptionId, product, inputState.value);
                }}
              />
            </Card.Content>
          }
          {!data && !presentationOptionId &&
            <Card.Content>
              <p className="no-renewal">No Renewal</p>
            </Card.Content>
          }
        </Card>
      </div>
    );
  }
}

export default SetupColumnOption;
