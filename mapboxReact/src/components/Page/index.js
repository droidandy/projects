import React, { PropTypes } from 'react';
import {
    LinkContainer
} from 'react-router-bootstrap';
import {
    Navbar,
    Nav,
    NavItem
} from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import styles from './styles.css';


const textStyle = {
    color: '#000'
};

function Page(props) {
    return (
        <div>
            <Navbar fluid styleName="header">
                <Navbar.Header>
                    <Navbar.Brand style={textStyle}>
                        DASHBOARD
                    </Navbar.Brand>
                </Navbar.Header>

                <Nav pullRight>
                    <NavItem>
                        <span style={textStyle}>
                        </span>
                    </NavItem>
                </Nav>
            </Navbar>

            <div styleName="container">
                <div styleName="children">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

Page.propTypes = {
    children: PropTypes.element
};

export default CSSModules(Page, styles);
