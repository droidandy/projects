import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    LinkContainer
} from 'react-router-bootstrap';
import {
    Navbar,
    Nav,
    NavItem
} from 'react-bootstrap';
import Hamburger from 'components/Hamburger';

const textStyle = {
    color: '#000'
};

function Page(props) {
    return (
        <div>
            <Navbar fluid styleName="header" className="navbar_header">
                <Navbar.Header>
                    <Navbar.Brand style={textStyle}>
                        REPORTING SYSTEM
                    </Navbar.Brand>
                </Navbar.Header>
                <Hamburger
                    style={{float: 'right', position: 'relative', zIndex: 10005, backgroundColor: '#173A37'}}
                    active={props.hamburger.active}
                    type="slider"
                    onClick={props.setStatus}
                />
            </Navbar>

            <div styleName="container">
                <Nav styleName="nav_header" bsStyle="pills">
                    <LinkContainer to="/dashboard/overview">
                        <NavItem>
                            Overview
                        </NavItem>
                    </LinkContainer>

                    <LinkContainer to="/dashboard/tasks">
                        <NavItem>
                            Tasks
                        </NavItem>
                    </LinkContainer>

                    <LinkContainer to="/dashboard/gofundis">
                        <NavItem>
                            GoFundis
                        </NavItem>
                    </LinkContainer>

                    <LinkContainer to="/dashboard/subscribers">
                        <NavItem>
                            Subscribers
                        </NavItem>
                    </LinkContainer>
                </Nav>

                <div styleName="children">
                    {props.children}
                </div>
                <Navbar fluid styleName="fotter">
                    <Navbar.Header>
                        <Navbar.Brand style={{
                            fontWeight: 300,
                            color: '#fff',
                            fontSize: 13
                        }}>
                            For support contact info@supportmultichoice.com
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Header styleName="fotter_brand_right">
                        <Navbar.Brand style={{
                            fontWeight: 300,
                            color: '#fff',
                            fontSize: 13,
                            paddingRight: 0
                        }}>
                            <span>Powered by</span>&nbsp;
                            <span style={{fontWeight: 500}}>Task</span>
                            <span style={{fontWeight: 400}}>Fundi</span>
                        </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>
            </div>
        </div>
    );
}

Page.propTypes = {
    children: PropTypes.element,
    hamburger: PropTypes.object.isRequired,
    setStatus: PropTypes.func.isRequired
};

export default CSSModules(Page, styles);
