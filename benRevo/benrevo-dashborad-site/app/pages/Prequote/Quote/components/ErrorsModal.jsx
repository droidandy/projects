import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Modal, Image } from 'semantic-ui-react';
import ErrorModal from '../../../../assets/img/svg/upload-modal-error.svg';


class ErrorsModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    errors: PropTypes.object,
    open: PropTypes.bool,
    close: PropTypes.func,
  };
  render() {
    return (
      <Modal
        open={this.props.open}
        size="small"
        className="error-modal"
        onClose={this.props.close}
        closeIcon
      >
        <Modal.Content>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <h2 className="quote-modal__heading">Oops! There was a problem with the file(s)</h2>
                <Grid.Row centered>
                  <div className="quote-modal__icon">
                    <Image centered src={ErrorModal} />
                  </div>
                </Grid.Row>
                <ul className="quote-modal__error-list">
                  {this.props.errors.map((error) => <li>
                    <h4>{error.get('mainMessage')}</h4>
                    <span>{error.get('subMessage')}</span>
                  </li>)}
                </ul>
                <Grid.Row centered>
                  <div className="upload-zone__center">
                    <div className="upload-zone__button" onClick={this.props.close}>Ok</div>
                  </div>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
  }

export default ErrorsModal;
