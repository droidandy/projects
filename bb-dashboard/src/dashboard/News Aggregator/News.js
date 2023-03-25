import React from 'react'
import NewsItem from './NewsItem'
import Panel from '../Panel'

class News extends React.Component {
  constructor() {
    super()
    this.state = {
      data: []      
    }
    this._getNews = this._getNews.bind(this);
  }

  componentDidMount(){
    this._getNews()
    setInterval(this._getNews, 300000)
  }
  
  render() {
    const news = this._generateFeed()
    return(
      <Panel {...this.props} title="News Aggregator" crypto="">
        {news.map(stream => stream)}
      </Panel>
    )
  }

  _generateFeed() {

    const newsArry = []

    // sort by date descending
    this.state.data.sort((a, b) => {

      let aDate = new Date(a['pubDate']);
      let bDate = new Date(b['pubDate']);

      if (aDate.getTime() > bDate.getTime()) {
        return -1;
      } else if (bDate.getTime() > aDate.getTime()) {
        return 1;
      } else {
        return 0;
      }
    });

    this.state.data.map(item =>{
      for(let key in item ) {
        newsArry.push(
        <NewsItem 
        key={key}
        image={item[key].feed ? item[key].feed.image : ''}
        source={item[key]['feed']['link']}
        news={item[key].items} 
        />)
      }
    })
    return newsArry
  }


  _getNews() {
    let news = []
    this.props.crypto.map((newsSource) => {
      switch (newsSource){

        case 'CoinDesk':
          this._getFeed(`https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.feedburner.com%2FCoindesk%3Fformat%3Dxml`)
          .then((json) => {
            news.push({CoinDesk: json})
            this.setState({data: news})
          })
          break

        case 'CoinTelegraph':
          this._getFeed(`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.cointelegraph.com%2Frss`)
          .then((json) => {
            news.push({CoinTelegraph: json})
            this.setState({data: news})
          })
          break

        case 'News.bitcoin.com':
          this._getFeed(`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.bitcoin.com%2Ffeed%2F`)
          .then((json) => {
            news.push({'News.bitcoin.com': json})
            this.setState({data: news})
          })
          break

        case 'Crypto Coins News':
          this._getFeed(`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.cryptocoinsnews.com%2Fnews%2Ffeed%2F`)
          .then((json) => {
            news.push({'CryptoCoinsNews': json})
            this.setState({data: news})
            })
            break
        case 'NewsBTC':
          this._getFeed(`https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.newsbtc.com%2Ffeed%2F`)
          .then((json) => {
            news.push({'NewsBTC': json})
            this.setState({data: news})
          })
          break

        case 'Bitcoinist':
          this._getFeed(`https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fbitcoinist.com%2Ffeed%2F`)
          .then((json) => {
            news.push({'Bitcoinist': json})
            this.setState({data: news})
          })
          break

        case 'TheMerkle':
          this._getFeed(`https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fthemerkle.com%2Ffeed%2F`)
          .then((json) => {
            news.push({'themerkle': json})
            this.setState({data: news})
          })
          break

        default:
          console.error('news source not found: ' + newsSource);
          break
      }
    })
  }

  async _getFeed(feedURL) {
    const response = await fetch(feedURL)
    const json = await response.json()
    return json
  }
  
}

News.defaultProps = {
  crypto: [],
  source: "source",
  news: [],
}

export default News
