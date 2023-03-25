import React from 'react'
import {Glyphicon} from 'react-bootstrap'
import './Panel.css'

export default class Panel extends React.Component {
    render(){
        return(
            <div className="panel panel-default no-bg b-a-2 b-gray-dark collapsible-panel">

                <div className="panel-heading handle">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-4"></div>
                        <div className="col-lg-6 col-md-6 col-sm-4 text-center">{this.props.crypto} {this.props.title}</div>
                        <div className="col-lg-3 col-md-3 col-sm-4 text-right">
                            <a className="action-panel-close" href="#" onClick={this.props._handleRemoveWidget.bind(this,this.props.id)}>
                                <i className="fa fa-fw fa-close text-muted"><Glyphicon glyph="remove"/></i>
                            </a>
                        </div>
                    </div>
                </div>                
                <div className="scroller">
                        {this.props.children}
                </div>
            </div>
        )
    }

}