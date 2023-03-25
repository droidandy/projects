import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import './Navbar.css'


export default class Navbar extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" 
                                className="navbar-toggle collapsed" 
                                data-toggle="collapse" 
                                data-target="#bs-example-navbar-collapse-1" 
                                aria-expanded="false"
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" 
                                href="/" 
                                onClick={this.goTo.bind(this, 'home')}
                            >
                                <img alt="Spin Logo Inverted" height="36" src="/whale.png" />
                            </a>
                        </div>

                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <a className="text-color" href="/dashboard/">Dashboard</a>
                                </li>
                                {/*<li>
                                    <a href="/market-cap">Market Cap</a>
                                </li>*/}
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a href="#" onClick={this.logout.bind(this)}>
                                        <Glyphicon glyph="log-out"/> Log out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                
            </div>
        )
    }

    goTo(route) {
        this.props.history.replace(`/${route}`)
    }

    login() {
        this.props.auth.login();
    }

    logout() {
        this.props.auth.logout();
    }
}