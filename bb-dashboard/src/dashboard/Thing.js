import React from 'react'

class Thing extends React.Component {
  render(){
    return (
      <li className="list-group-item no-bg">
          <div className="media">
              <div className="media-left">
                  <span className="fa-stack fa-lg">
                  <i className="fa fa-circle-thin fa-stack-2x text-danger"></i>
                  <i className="fa fa-close fa-stack-1x fa-fw text-danger"></i></span>
              </div>
              <div className="media-body">
                  <h6 className="m-t-0">
                      <a href={this.props.url} target="_blank_">
                        <span>{this.props.title}</span>
                      </a>
                  </h6>
                  {this.props.text && <div className="text-white small m-b-0">{this.props.text}</div>}
                  {this.props.src && <img src={this.props.src} height="200px" />}
                  <p className="text-nowrap small m-b-0">
                      <span>{this.props.date}</span>
                  </p>
              </div>
          </div>
      </li>
    )
  }
}

export default Thing;
