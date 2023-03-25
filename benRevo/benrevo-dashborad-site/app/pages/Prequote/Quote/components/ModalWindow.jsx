import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Modal, Button, Radio, Form } from 'semantic-ui-react';
import UploadModal from '../../../../assets/img/svg/upload-modal.svg';

class ModalWindow extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    open: PropTypes.bool,
    cancel: PropTypes.func,
    changeRadio: PropTypes.func,
    continue: PropTypes.func,
    labelOne: PropTypes.string,
    labelTwo: PropTypes.string,
    valueOne: PropTypes.string,
    valueTwo: PropTypes.string,
    name: PropTypes.string,
  };
  state = {
    radio: this.props.valueOne,
  }
  changeRadio = (e, { value }) => {
    this.setState({ radio: value });
    this.props.changeRadio(value);
  }
  render() {
    return (
      <Modal
        open={this.props.open}
        size="tiny"
        className="quote-modal"
      >
        <Modal.Content className="quote-modal__content">
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <h2 className="quote-modal__heading">Upload Quote</h2>
                <Grid.Row centered>
                  <div className="quote-modal__icon">
                    <Image centered src={UploadModal} />
                  </div>
                </Grid.Row>
                <Form className="quote-modal__form">
                  <Form.Field>
                    <p><b>What type of medical quote are you uploading?</b></p>
                  </Form.Field>
                  <Form.Field>
                    <Radio
                      label={this.props.labelOne}
                      name={this.props.name}
                      value={this.props.valueOne}
                      checked={this.state.radio === this.props.valueOne}
                      onChange={this.changeRadio}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Radio
                      label={this.props.labelTwo}
                      name={this.props.name}
                      value={this.props.valueTwo}
                      checked={this.state.radio === this.props.valueTwo}
                      onChange={this.changeRadio}
                    />
                  </Form.Field>
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <div className="quote-modal__btn-holder">
                <Button size="medium" basic onClick={this.props.cancel} className="quote-modal__btn">Cancel</Button>
                <Button size="medium" primary onClick={this.props.continue} className="quote-modal__btn">Continue</Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalWindow;
