import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { MEDICAL_SECTION, DENTAL_SECTION, VISION_SECTION, LIFE_SECTION, STD_SECTION, LTD_SECTION } from '@benrevo/benrevo-react-clients';
import SectionCarrier from './SectionCarrier';
import AddCarrierModal from './AddCarrierModal';

class MarketingStatus extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    addCarrier: PropTypes.func.isRequired,
    selectCarrier: PropTypes.func.isRequired,
    openAddCarrierModal: PropTypes.func.isRequired,
    marketingStatusList: PropTypes.array.isRequired,
    rfpCarriers: PropTypes.object.isRequired,
    selectedCarriers: PropTypes.object.isRequired,
    updateMarketingStatusItem: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
    deleteCarrier: PropTypes.func.isRequired,
    products: PropTypes.object.isRequired,
  };

  render() {
    const {
      openModal,
      closeModal,
      addCarrier,
      openAddCarrierModal,
      marketingStatusList,
      rfpCarriers,
      selectedCarriers,
      selectCarrier,
      updateMarketingStatusItem,
      clientId,
      deleteCarrier,
      products,
    } = this.props;
    return (
      <div className="marketing-status">
        <div className="marketing-status-title">Marketing Status</div>
        <div className="marketing-status-title">List of carriers who received the RFP, and track the status of their quotes.</div>
        <Grid>
          <Grid.Row columns="3" className="section-carrier-block">
            {products.medical &&
            <Grid.Column>
              <SectionCarrier
                deleteCarrier={deleteCarrier}
                section={MEDICAL_SECTION}
                openAddCarrierModal={openAddCarrierModal}
                marketingStatusList={marketingStatusList}
                updateMarketingStatusItem={updateMarketingStatusItem}
                clientId={clientId}
              />
            </Grid.Column>
            }
            {products.dental &&
            <Grid.Column>
              <SectionCarrier
                deleteCarrier={deleteCarrier}
                section={DENTAL_SECTION}
                openAddCarrierModal={openAddCarrierModal}
                marketingStatusList={marketingStatusList}
                updateMarketingStatusItem={updateMarketingStatusItem}
                clientId={clientId}
              />
            </Grid.Column>
            }
            {products.vision &&
            <Grid.Column>
              <SectionCarrier
                deleteCarrier={deleteCarrier}
                section={VISION_SECTION}
                openAddCarrierModal={openAddCarrierModal}
                marketingStatusList={marketingStatusList}
                updateMarketingStatusItem={updateMarketingStatusItem}
                clientId={clientId}
              />
            </Grid.Column>
            }
            {products.life &&
            <Grid.Column>
              <SectionCarrier
                title="Life/AD&amp;D"
                deleteCarrier={deleteCarrier}
                section={LIFE_SECTION}
                openAddCarrierModal={openAddCarrierModal}
                marketingStatusList={marketingStatusList}
                updateMarketingStatusItem={updateMarketingStatusItem}
                clientId={clientId}
              />
            </Grid.Column>
            }
            {products.ltd &&
            <Grid.Column>
              <SectionCarrier
                title="Long-Term Disability"
                deleteCarrier={deleteCarrier}
                section={LTD_SECTION}
                openAddCarrierModal={openAddCarrierModal}
                marketingStatusList={marketingStatusList}
                updateMarketingStatusItem={updateMarketingStatusItem}
                clientId={clientId}
              />
            </Grid.Column>
            }
            {products.std &&
            <Grid.Column>
              <SectionCarrier
                title="Short-Term Disability"
                deleteCarrier={deleteCarrier}
                section={STD_SECTION}
                openAddCarrierModal={openAddCarrierModal}
                marketingStatusList={marketingStatusList}
                updateMarketingStatusItem={updateMarketingStatusItem}
                clientId={clientId}
              />
            </Grid.Column>
            }
          </Grid.Row>
          <Grid.Row columns="3" className="section-carrier-block">
          </Grid.Row>
          <AddCarrierModal
            products={products}
            selectCarrier={selectCarrier}
            selectedCarriers={selectedCarriers}
            carriers={rfpCarriers}
            openModal={openModal}
            closeModal={closeModal}
            addCarrier={addCarrier}
          />

        </Grid>
      </div>
    );
  }
}

export default MarketingStatus;

