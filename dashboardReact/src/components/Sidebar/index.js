import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
// import {
//     LinkContainer
// } from 'react-router-bootstrap';
// import {
//     Nav,
//     NavItem
// } from 'react-bootstrap';
// import LinkDuo from 'components/LinkDuo';

function SideBar() {

    return (
        <div styleName='container-sideBar'>
            <div>
                {/* <Nav className='sidebar' activeKey={1} onSelect={() => props.onClosePanel(false)}>*/}
                    {/* <LinkContainer to="/task/create">*/}
                        {/* <NavItem eventKey={1}>*/}
                            {/* <div styleName="item_row">*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* <div styleName="profile" />*/}
                                {/* </div>*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* Request GoFundi*/}
                                {/* </div>*/}
                            {/* </div>*/}
                        {/* </NavItem>*/}
                    {/* </LinkContainer>*/}

                    {/* <LinkContainer to="/dashboard/overview">*/}
                        {/* <NavItem eventKey={2}>*/}
                            {/* <div styleName="item_row">*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* <div styleName="browser" />*/}
                                {/* </div>*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* Dashboard*/}
                                {/* </div>*/}
                            {/* </div>*/}
                        {/* </NavItem>*/}
                    {/* </LinkContainer>*/}

                    {/* <LinkContainer to="/admin/tasks">*/}
                        {/* <NavItem eventKey={3}>*/}
                            {/* <div styleName="item_row">*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* <div styleName="settings" />*/}
                                {/* </div>*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* Admin*/}
                                {/* </div>*/}
                            {/* </div>*/}
                        {/* </NavItem>*/}
                    {/* </LinkContainer>*/}

                    {/* <LinkContainer to="/logout?returnUrl=/login">*/}
                        {/* <NavItem eventKey={4}>*/}
                            {/* <div styleName="item_row">*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* <div styleName="logout" />*/}
                                {/* </div>*/}
                                {/* <div style={{margin: 4}}>*/}
                                    {/* Logout*/}
                                {/* </div>*/}
                            {/* </div>*/}
                        {/* </NavItem>*/}
                    {/* </LinkContainer>*/}
                {/* </Nav>*/}
                <div className='sidebar'>

                    <div className="block_item">
                        <a href='/task/create' >
                            <div styleName="item_row">
                                <div style={{margin: 4}}>
                                    <div styleName="profile" />
                                </div>
                                <div style={{margin: 4}}>
                                    Request GoFundi
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="block_item">
                        <a href='/dashboard/overview' >
                            <div styleName="item_row">
                                <div style={{margin: 4}}>
                                    <div styleName="browser" />
                                </div>
                                <div style={{margin: 4}}>
                                    Dashboard
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="block_item">
                        <a href='/admin/tasks'>
                            <div styleName="item_row">
                                <div style={{margin: 4}}>
                                    <div styleName="settings" />
                                </div>
                                <div style={{margin: 4}}>
                                    Admin
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="block_item">
                        <a href='/logout?returnUrl=/login'>
                            <div styleName="item_row">
                                <div style={{margin: 4}}>
                                    <div styleName="logout" />
                                </div>
                                <div style={{margin: 4}}>
                                    Logout
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

SideBar.propTypes = {
    onClosePanel: PropTypes.func.isRequired
};

export default CSSModules(SideBar, styles);
