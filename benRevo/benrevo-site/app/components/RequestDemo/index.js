import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Grid, Container, Header, Form, Button, Loader } from 'semantic-ui-react';
import messages from './messages';
import { changeForm, formSubmit } from '../../pages/App/actions';

class RequestDemo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    intl: intlShape,
    loading: PropTypes.bool.isRequired,
    sent: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    changeForm: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { intl, form, loading, sent } = this.props;
    return (
      <div className="request-demo">
        <ul className="footer-top">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
        <Container>
          <Grid centered stackable textAlign="center" verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <Header className="column-header"><FormattedMessage {...messages.demoTitle} /></Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column tablet={16} computer={13} largeScreen={13} textAlign="center">
                <Form>
                  <Form.Group widths="equal" inline>
                    <Form.Input
                      onChange={(e, inputState) => { this.props.changeForm('name', inputState.value); }}
                      width="12"
                      placeholder={intl.formatMessage(messages.demoName)}
                    />
                    <Form.Input
                      onChange={(e, inputState) => { this.props.changeForm('companyName', inputState.value); }}
                      width="12"
                      placeholder={intl.formatMessage(messages.demoCompany)}
                    />
                    <Form.Field width="12">
                      <div className="ui input">
                        <MaskedInput
                          value={form.email}
                          mask={emailMask}
                          guide={false}
                          placeholder={intl.formatMessage(messages.demoEmail)}
                          onChange={(e) => { this.props.changeForm('email', e.target.value); }}
                        />
                      </div>
                    </Form.Field>
                    <Form.Field width="12">
                      <div className="ui input">
                        <MaskedInput
                          value={form.phoneNumber}
                          mask={['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          guide
                          placeholder={intl.formatMessage(messages.demoPhone)}
                          onChange={(e) => { this.props.changeForm('phoneNumber', e.target.value); }}
                        />
                      </div>
                    </Form.Field>
                  </Form.Group>
                  { loading &&
                    <Form.Field className="loader">
                      <Loader active={loading} inverted indeterminate inline size="big" />
                    </Form.Field>
                  }
                  { !loading && <Form.Field control={Button} onClick={this.props.formSubmit}><FormattedMessage {...messages.demoTitle} /></Form.Field> }
                  { sent &&
                    <div className="sent-message success">
                      <FormattedMessage {...messages.thanks} />
                    </div>
                  }
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const homeState = state.get('app');
  return {
    form: homeState.get('requestDemoForm').toJS(),
    sent: homeState.get('requestDemoSent'),
    loading: homeState.get('loading'),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    changeForm: (key, value) => {
      dispatch(changeForm(key, value));
    },
    formSubmit: () => {
      dispatch(formSubmit());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RequestDemo));
