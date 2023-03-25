import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Form, Button, Message, Icon, Loader } from 'semantic-ui-react';
import Helmet from 'react-helmet';

class Contact extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    sent: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    changeForm: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { form, sent, loading } = this.props;
    const enable = form.name && form.companyName && form.message && form.email;

    return (
      <div>
        <Helmet
          title="Contact us"
          meta={[
            { name: 'description', content: 'Description of Contact us' },
          ]}
        />
        <Grid stackable container className="contact section-wrap">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment" textAlign="center">
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header className="form-header" as="h1">GET IN TOUCH</Header>
                  <Message info hidden={!sent}>
                    <Message.Header>Your message has been sent. Thank you!</Message.Header>
                  </Message>
                  <Form className="home">
                    <Form.Group widths="equal">
                      <Form.Input
                        label="Name"
                        placeholder="First Last"
                        value={form.name}
                        onChange={(e, inputState) => { this.props.changeForm('name', inputState.value); }}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.Input
                        label="Company Name"
                        placeholder="Company"
                        value={form.companyName}
                        onChange={(e, inputState) => { this.props.changeForm('companyName', inputState.value); }}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.Input
                        label="Email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e, inputState) => { this.props.changeForm('email', inputState.value); }}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.TextArea
                        label="Message..."
                        rows="5"
                        placeholder="Message..."
                        value={form.message}
                        onChange={(e, inputState) => { this.props.changeForm('message', inputState.value); }}
                      />
                    </Form.Group>
                    <Form.Field className="button-field" width="16">
                      <Loader active={loading} indeterminate inline size="big" />
                      { !loading && <Button disabled={!enable} className="form-home-button" onClick={(e) => { e.preventDefault(); this.props.formSubmit(); }}>Send Message</Button> }
                    </Form.Field>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Contact;
