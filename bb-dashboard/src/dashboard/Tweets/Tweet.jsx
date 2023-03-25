import React from 'react'

export default class Panel extends React.Component {
    render(){
        return(
            <div className="media">
                <div className="media-left media-middle">
                    <img src={this.props.avatar} className="img-circle" width="42" alt="avatar"/>
                </div>
                <div className="Media__mediaTableFix___17fd2 media-body">
                    <p className="m-b-0">
                        {this.props.username}
                        <small className="m-l-1">{this.props.date ? new Date(this.props.date).toLocaleString() : ""}</small>
                    </p>
                    <a href={this.props.url} target="_blank"> <h5 className="m-y-0">{this.props.text}</h5> </a>
                    {this.props.media && <img src={this.props.media} height="200" />}
                </div>
            </div>
        )
    }
}

Panel.defaultProps = {
    username: ' ',
    date: " ",
    text: " Waiting for new tweets... 🐳",
    avatar: "whale.png"

}