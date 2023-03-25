import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import CarrierCardItem from './CarrierCardItem';

class SectionCarrier extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    openAddCarrierModal: PropTypes.func.isRequired,
    marketingStatusList: PropTypes.array.isRequired,
    updateMarketingStatusItem: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
    deleteCarrier: PropTypes.func.isRequired,
    title: PropTypes.string, // eslint-disable-line
  };

  render() {
    const {
      section,
      openAddCarrierModal,
      marketingStatusList,
      updateMarketingStatusItem,
      clientId,
      deleteCarrier,
      title,
    } = this.props;
    const carrierItems = marketingStatusList.filter((item) => {
      if (item.product === section.toUpperCase()) {
        return item;
      }
    });
    return (
      <div className="section-carrier">
        <Grid>
          <Grid.Column>
            <Grid.Row className="header-row">
              <Grid>
                <Grid.Row>
                  <Grid.Column width={9} className="section-name">{title || section}</Grid.Column>
                  <Grid.Column width={7}>
                    <Button primary fluid size="medium" onClick={() => openAddCarrierModal(section)}>ADD CARRIER</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Row>
            { (carrierItems && carrierItems.length > 0) &&
            <Grid.Row className="body-row">
              { carrierItems.map((carrier, i) =>
                <CarrierCardItem section={section} deleteCarrier={deleteCarrier} clientId={clientId} updateMarketingStatusItem={updateMarketingStatusItem} carrier={carrier} key={i} />
              )}
            </Grid.Row>
            }
            { (carrierItems && !carrierItems.length) &&
            <Grid.Row className="empty-body-row">
            </Grid.Row>
            }
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default SectionCarrier;

