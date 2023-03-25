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
    Checkbox,
    Button
} from 'react-bootstrap';

function Login() {
    return (
        <Grid>
            <Row>
                <Col sm={10} md={8} lg={6} smOffset={1} mdOffset={2} lgOffset={3}>
                    <h1>Login</h1>

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
                                <Col componentClass={ControlLabel} sm={2}>
                                    Password
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        placeholder="Password"
                                        // disabled={props.busy}
                                        // value={props.fields.password}
                                        onChange={() => {}}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={10} smOffset={2}>
                                    <Checkbox
                                        // checked={props.fields.remembereMe}
                                        onChange={() => {}}
                                        // disabled={props.busy}
                                    >
                                        Remember me
                                    </Checkbox>
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
                                        Login
                                    </Button>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={10} smOffset={2}>
                                    <LinkContainer to="/restore-password">
                                        <Button bsStyle="link">
                                            Lost your Password?
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

Login.propTypes = {
};

export default Login;
