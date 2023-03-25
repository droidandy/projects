import React from 'react'
import Thing from './Thing.js'
import Panel from './Panel'
import cryptosMap from './cryptos.js'
var $ = require('jquery');


class Gnews extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []      
    };
  }

  componentWillMount(){
    this._fetchGnews()
  }
  
  render() {
    const gnews = this._getGnews();    
    return(
      <Panel {...this.props} title="Google News" >
        {gnews}
      </Panel>
    );
  }


  _getGnews() {
    return this.state.data.slice(0,10).map((items) => {
      return (<Thing
               title={items.title}
               url={items.link}
               date={new Date(items.pubDate).toLocaleString()}
               key={items.guid}
              />);
    });
  }

  _fetchGnews() {
    const id = cryptosMap[this.props.crypto].id
    $.ajax({
      method: 'GET',
      url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Fnews%2Frss%2Fexplore%2Fsection%2Fq%2F${id}%2F${id}%3Fned%3Dca%26hl%3Den-CA`,
      success: (result) => {
        let data = result.items
        if (data && data.length > 0 ){
          this.setState({ data });
        }
      }
    });
  }
  
}


export default Gnews;
