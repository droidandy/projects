import React from 'react';
import {
    LinkContainer
} from 'react-router-bootstrap';
import {
    Grid,
    Row,
    Col,
    Panel,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';


function RecoveryPassword() {

    return (
        <Grid>
            <Row>
                <Col sm={10} md={8} lg={6} smOffset={1} mdOffset={2} lgOffset={3}>
                    <h1>Forgot Your Password?</h1>

                    <Panel>
                        <Form
                            horizontal
                            noValidate
                            onSubmit={event => {
                                event.preventDefault();
                            }}
                        >
                            <FormGroup >
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="email"
                                        placeholder="Email"
                                        autoFocus
                                        // disabled={props.busy}
                                        // value={props.fields.email}
                                        onChange={() => {}}
                                    />

                                </Col>
                            </FormGroup>

                            <FormGroup >
                                <Col sm={10} smOffset={2}>
                                </Col>

                                <Col sm={10} smOffset={2}>
                                    <Button
                                        type="submit"
                                        // disabled={props.busy}
                                    >
                                        Send
                                    </Button>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={10} smOffset={2}>
                                    Return to
                                    <LinkContainer to="/login">
                                        <Button bsStyle="link">
                                            Login page
                                        </Button>
                                    </LinkContainer>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel>
                </Col>
            </Row>
        </Grid>
    );
}

RecoveryPassword.propTypes = {
};

export default RecoveryPassword;
