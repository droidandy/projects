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

function ChangePassword() {

    return (
        <Grid>
            <Row>
                <Col sm={10} md={8} lg={6} smOffset={1} mdOffset={2} lgOffset={3}>
                    <h1>Change Your Password</h1>

                    <Panel>
                        <Form
                            horizontal
                            noValidate
                            onSubmit={event => {
                                event.preventDefault();
                            }}
                        >
                            <FormGroup >
                                <Col componentClass={ControlLabel} sm={4}>
                                    New Password
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="password"
                                        placeholder="New Password"
                                        autoFocus
                                        // disabled={props.busy}
                                        // value={props.fields.newPassword}
                                        onChange={() => {}}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup >
                                <Col componentClass={ControlLabel} sm={4}>
                                    New Password Again
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="password"
                                        placeholder="Repetition New Password"
                                        // disabled={props.busy}
                                        // value={props.fields.repetitionPassword}
                                        onChange={() => {}}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup >
                                <Col sm={8} smOffset={4}>
                                </Col>

                                <Col sm={8} smOffset={4}>
                                    <Button
                                        type="submit"
                                        // disabled={props.busy}
                                    >
                                        Change Password
                                    </Button>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={8} smOffset={4}>
                                    <LinkContainer to="/login">
                                        <Button bsStyle="link">
                                            Remember your Password?
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

ChangePassword.propTypes = {

};

export default ChangePassword;
