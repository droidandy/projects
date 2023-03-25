import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Grid, Header, Image, Form, Container, Button, Loader } from 'semantic-ui-react';
import messages from './messages';
import MainImg from '../../assets/img/common-main.svg';

class Contact extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    intl: intlShape.isRequired,
    loading: PropTypes.bool.isRequired,
    sent: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    changeForm: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
  };

  get enableButton() {
    const { form } = this.props;
    return !!form.name && !!form.message && !!form.email;
  }

  render() {
    const { intl, form, formSubmit, loading, sent } = this.props;

    return (
      <div className="app-contact">
        <div className="top">
          <Grid>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Header as="h1" className="page-header"><FormattedMessage {...messages.title} /></Header>
                <Image src={MainImg} centered verticalAlign="bottom" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid className="bottom">
          <Grid.Row className="home-row">
            <Grid.Column>
              <Container>
                <Grid stackable>
                  <Grid.Row centered>
                    <Grid.Column tablet="10" computer="8" largeScreen="7">
                      <Form>
                        <Form.Input
                          onChange={(e, inputState) => { this.props.changeForm('name', inputState.value); }}
                          value={form.name}
                          label={intl.formatMessage(messages.name)}
                        />
                        <Form.Field>
                          <label htmlFor="email-field"><FormattedMessage {...messages.email} /></label>
                          <div className="ui input">
                            <MaskedInput
                              value={form.email}
                              mask={emailMask}
                              guide={false}
                              id="email-field"
                              onChange={(e) => { this.props.changeForm('email', e.target.value); }}
                            />
                          </div>
                        </Form.Field>
                        <Form.Field>
                          <label htmlFor="phoneNumber-field"><FormattedMessage {...messages.phone} /></label>
                          <div className="ui input">
                            <MaskedInput
                              value={form.phoneNumber}
                              mask={['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              guide
                              placeholder="+1 (111) 111-1111"
                              id="phoneNumber-field"
                              onChange={(e) => { this.props.changeForm('phoneNumber', e.target.value); }}
                            />
                          </div>
                        </Form.Field>
                        <Form.TextArea
                          onChange={(e, inputState) => { this.props.changeForm('message', inputState.value); }}
                          value={form.message}
                          label={intl.formatMessage(messages.tell)}
                        />
                        { loading &&
                          <Form.Field className="loader">
                            <Loader active={loading} indeterminate inline size="big" />
                          </Form.Field>
                        }
                        { !loading && <Form.Field disabled={!this.enableButton} control={Button} onClick={formSubmit}><FormattedMessage {...messages.send} /></Form.Field> }
                      </Form>
                      { sent &&
                        <div className="sent-message success">
                          <FormattedMessage {...messages.thanks} />
                        </div>
                      }
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default injectIntl(Contact);
