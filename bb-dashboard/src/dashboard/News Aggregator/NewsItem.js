import React from 'react'
const style = {
  text: {
    fontFamily: 'georgia, serif',
    fontSize:'12px',
    fontWeight:'bold',
    fontStyle:'italic',
    paddingBottom:'35px',
  }

}

class NewsItem extends React.Component {
  render(){
    const now = new Date()
    return (
      <li className="list-group-item no-bg">
          <div className="media">
              <div className="media-left">
                <img src={this.props.image} className="img-responsive" alt={this.props.source}/>
              </div>
              
                <div className="media-heading">
                  <span className="text-white">Source: {this.props.source}</span> <br />
                  <span className="text-white" style={style.text}>Fetched on: {now.toLocaleString()} </span>
                </div>
              <div className="media-body">
                {
                  this.props.news.map(item => {

                      // remove tags
                      let description = item.description.replace(/<[^>]+>/g, '');

                      // trim the description down
                      let originalLength = description.length;
                      description = description.substr(0, 100);
                      description = description.substr(0, Math.min(description.length, description.lastIndexOf(" ")));
                      if (originalLength > description.length) {
                          description += '...';
                      }

                      return(
                        <div style={ { maxWidth: '500px', margin: 'auto' } } key={ item.guid } >
                          <h6 className="m-t-0">
                            <a href={item.link} target="_blank_">
                              <span>{item.title}</span>
                            </a>
                          </h6>
                            <div className="text-white small m-b-0" dangerouslySetInnerHTML={{__html: description}} />
                          <hr/>

                        </div>)
                  })
                }
              </div>
          </div>
      </li>
    )
  }
}
NewsItem.defaultProps = {
  image: './image',
  source: "source",
  news: [],
}
export default NewsItem;
