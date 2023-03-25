import React from 'react'
import Thing from './Thing.js'
import Panel from './Panel'
import cryptosMap from './cryptos.js'

var $ = require('jquery');


class SubReddit extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []      
    };
  }

  componentDidMount(){
    this._fetchPosts()
  }
  
  render() {
    const posts = this._getPosts();    
    return(
      <Panel {...this.props} title="Subreddit" >
        {posts}
      </Panel>
    );
  }

  _getPosts() {
    return this.state.data.map((thing) => {
      if (thing.data.stickied !==true){
        let textReddit = thing.data.selftext;
        return (<Thing
                title={thing.data.title}
                url={"https://reddit.com"+thing.data.permalink}
                date={new Date(thing.data.created*1000).toUTCString()}
                text={textReddit && textReddit.length > 200 ? textReddit.substring(0, 200) + "...." : textReddit}
                src={thing.data.preview && thing.data.preview.images[0].source.url}
                key={thing.data.id}
                />);
      }
    });
  }

  _fetchPosts() {
    const subReddit = cryptosMap[this.props.crypto].reddit
    $.ajax({
      method: 'GET',
      url: `https://www.reddit.com${subReddit}/hot.json`,
      success: (result) => {
        let data = result.data.children
        this.setState({ data });
      }
    });
  }
}

export default SubReddit;
