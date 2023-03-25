import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Icon, Modal, Form, Checkbox } from 'semantic-ui-react';

class CarriersFilter extends React.Component {
  static propTypes = {
    clientPlanCarriersSelected: PropTypes.array.isRequired,
    clientPlanCarriers: PropTypes.array.isRequired,
    changeSelectedClientPlanCarrier: PropTypes.func.isRequired,
    updateComparePlansList: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.modalToggle = this.modalToggle.bind(this);
    this.changeList = this.changeList.bind(this);
    this.saveFilters = this.saveFilters.bind(this);
    this.state = {
      modalOpen: false,
      carriers: {},
    };
  }

  componentDidMount() {
    const { carriers } = this.state;
    carriers.all = true;
    const selectedCarriers = [];
    const { clientPlanCarriers, changeSelectedClientPlanCarrier } = this.props;
    clientPlanCarriers.forEach((item) => {
      carriers[item.carrier.carrierId] = true;
      selectedCarriers.push(item.carrier.carrierId);
    });
    changeSelectedClientPlanCarrier(selectedCarriers);
    // this.props.updateComparePlansList();
  }

  modalToggle() {
    const { clientPlanCarriersSelected, clientPlanCarriers } = this.props;
    const { modalOpen } = this.state;
    const carriers = {};
    if (!modalOpen) {
      if (clientPlanCarriersSelected && clientPlanCarriersSelected.length) {
        clientPlanCarriersSelected.forEach((item) => {
          carriers[item] = true;
        });
      }
    }
    carriers.all = (clientPlanCarriersSelected && clientPlanCarriers && clientPlanCarriersSelected.length === clientPlanCarriers.length);
    this.setState({ modalOpen: !modalOpen, carriers });
  }

  changeList(carrierId, checked) {
    const { carriers } = this.state;
    if (carrierId === 'all') {
      carriers.all = checked;
      const { clientPlanCarriers } = this.props;
      clientPlanCarriers.forEach((item) => {
        carriers[item.carrier.carrierId] = checked;
      });
    } else {
      if (!checked) {
        carriers.all = false;
      }
      carriers[carrierId] = checked;
    }
    this.setState({ carriers });
  }

  saveFilters() {
    const { changeSelectedClientPlanCarrier } = this.props;
    const { carriers } = this.state;
    const selectedCarriers = [];
    Object.keys(carriers).forEach((carrier) => {
      if (carriers[carrier] && carrier !== 'all') {
        selectedCarriers.push(carrier);
      }
    });
    changeSelectedClientPlanCarrier(selectedCarriers);
    this.modalToggle();
  }

  render() {
    const { clientPlanCarriers, clientPlanCarriersSelected } = this.props;
    const { modalOpen, carriers } = this.state;
    const all = (clientPlanCarriersSelected && clientPlanCarriers && clientPlanCarriersSelected.length === clientPlanCarriers.length);
    // console.log('carriers-filter', this.state, this.props);
    return (
      <div className="carriers-filter">
        <Button className="filter-button" onClick={() => this.modalToggle()}>
          <span>{ all ? 'All Carriers' : 'Select Carriers'}</span>
          <Icon name="dropdown" />
        </Button>
        <Modal
          className="compare-modal-filters"
          open={modalOpen}
          onClose={() => this.modalToggle}
          closeOnDimmerClick
          dimmer={false}
          size="tiny"
        >
          <Modal.Content scrolling>
            <Grid stackable>
              <Grid.Row>
                { clientPlanCarriers.length > 0 &&
                <Grid.Column tablet="16" computer="16">
                  <Form inline>
                    <Form.Field key={'all'}>
                      <Checkbox
                        label={'All Carriers'}
                        checked={carriers.all}
                        onChange={(e, inputState) => { this.changeList('all', inputState.checked); }}
                      />
                    </Form.Field>
                    { clientPlanCarriers.map((item, i) =>
                      <Form.Field key={i}>
                        <Checkbox
                          label={item.carrier.displayName}
                          checked={carriers[item.carrier.carrierId]}
                          onChange={(e, inputState) => { this.changeList(item.carrier.carrierId, inputState.checked); }}
                        />
                      </Form.Field>
                    )}
                  </Form>
                </Grid.Column>
                }
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button size="medium" basic onClick={() => this.modalToggle()}>Cancel</Button>
            <Button size="medium" primary onClick={() => this.saveFilters()}>Apply</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default CarriersFilter;
