import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Button, Popup } from 'semantic-ui-react';
import { RFP_STARTED, RFP_SUBMITTED, QUOTED, DECLINED } from '@benrevo/benrevo-react-clients';
import deleteCarrierImage from './../../../../assets/img/svg/deleteCarrier.svg';

class CarrierCardItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carrier: PropTypes.object.isRequired,
    updateMarketingStatusItem: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
    deleteCarrier: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
  };
  state = {
    isOpen: false,
  };
  handleOpen = () => {
    this.setState({ isOpen: true });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
    clearTimeout(this.timeout);
  }

  render() {
    const {
      carrier,
      updateMarketingStatusItem,
      clientId,
      deleteCarrier,
      section,
    } = this.props;
    let statusName = '';
    switch (carrier.status) {
      case RFP_STARTED:
        statusName = 'RFP STARTED';
        break;
      case RFP_SUBMITTED:
        statusName = 'RFP SUBMITTED';
        break;
      case QUOTED:
        statusName = 'QUOTED';
        break;
      case DECLINED:
        statusName = 'DTQ';
        break;
      default:
        statusName = 'N/A';
        break;
    }
    const leftButtonStatus = carrier.status === RFP_SUBMITTED ? QUOTED : RFP_SUBMITTED;
    const leftBottonClassName = carrier.status === RFP_SUBMITTED ? 'green' : 'grey';
    const leftBottonText = carrier.status === RFP_SUBMITTED ? 'QUOTED' : 'RFP SUBMITTED';
    const rightButtonStatus = carrier.status === DECLINED ? QUOTED : DECLINED;
    const rightBottonClassName = carrier.status === DECLINED ? 'green' : 'red';
    const rightBottonText = carrier.status === DECLINED ? 'QUOTED' : 'DTQ';
    let carrierClass = '';
    if (carrier.status === QUOTED) {
      carrierClass = 'green';
    } else if (carrier.status === DECLINED) {
      carrierClass = 'red';
    } else {
      carrierClass = 'grey';
    }
    return (
      <Grid className="carrier-card-item">
        <Grid.Row columns={2}>
          <Grid.Column className="carrier-name">
            <Image src={carrier.carrierLogoUrl} />
          </Grid.Column>
          <Grid.Column className="action-column">
            <Popup
              className="status-popup"
              open={this.state.isOpen}
              onClose={this.handleClose}
              onOpen={this.handleOpen}
              trigger={<Button className={carrierClass}>{statusName}</Button>}
              content={
                <Grid columns="equal">
                  <Grid.Column className="left">
                    <Button
                      onClick={() => { updateMarketingStatusItem(carrier.marketingStatusId, leftButtonStatus, clientId); this.handleClose(); }}
                      fluid
                      className={leftBottonClassName}
                    >
                      {leftBottonText}
                    </Button>
                  </Grid.Column>
                  <Grid.Column className="right">
                    <Button
                      fluid
                      onClick={() => { updateMarketingStatusItem(carrier.marketingStatusId, rightButtonStatus, clientId); this.handleClose(); }}
                      className={rightBottonClassName}
                    >
                      {rightBottonText}
                    </Button>
                  </Grid.Column>
                </Grid>
              }
              on="click"
              position="bottom center"
            />
            <Image role="button" src={deleteCarrierImage} onClick={() => deleteCarrier(carrier, section)} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default CarrierCardItem;

