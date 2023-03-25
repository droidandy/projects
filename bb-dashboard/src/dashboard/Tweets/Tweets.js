import React from 'react'
import Panel from '../Panel'
import Tweet from './Tweet'
import randomId from '../helper'
import cryptosMap from '../cryptos.js'


export default class Tweets extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }
  componentWillMount(){
    this._loadPlaceHolder()
  }

  componentDidMount(){
    const id = cryptosMap[this.props.crypto].id
    const socket = require('socket.io-client')(process.env.REACT_APP_TWITTER_API + id)
    socket.on("tweet", this._streamTweets)
  }

  render() {
    const tweets = this._getTweets();
    return(
      <Panel {...this.props} title="Tweets">
        {tweets}
      </Panel>
    );
  }

  _getTweets() {
    return this.state.data.map((status) => {
      let url="https://twitter.com/"+status.user.screen_name+"/status/"+status.id_str
      if (status.created_at === "" ){
        url="#"
      }
      let media = null;
      if (status.extended_entities) {
        media = status.extended_entities.media[0].media_url;
      } else if (status.extended_tweet) {
        if (status.extended_tweet.extended_entities) {
          media = status.extended_tweet.extended_entities.media[0].media_url;
        }
      } else if (status.retweeted_status) {
        if (status.retweeted_status.extended_entities) {
          media = status.retweeted_status.extended_entities.media[0].media_url;
        } else if (status.retweeted_status.extended_tweet) {
          if (status.retweeted_status.extended_tweet.extended_entities) {
            media = status.retweeted_status.extended_tweet.extended_entities.media[0].media_url;
          }
        }
      }
      return (<Tweet
               text={status.text}
               username={status.user.name}
               avatar={status.user.profile_image_url}
               date={status.created_at}
               url={url}
               media={media}
               key={status.id}
              />);
    });
  }

  _streamTweets = tweet => {
    const SHOW_MAX_TWEETS = 30
    let data = this.state.data.slice(0,SHOW_MAX_TWEETS)
    data.unshift(tweet)
    this.setState({data})
  }

  _loadPlaceHolder(){
    let data = [
      {
          text:"Waiting for new tweets... 🐳",
          user:{
            name:"",
            profile_image_url:"/1px.png"
          },
          created_at:"",
          id: randomId()
      }
    ]
    for (let i of [" "," "," "," "," "," "," "," "," "]){
      data.push({
          text:i,
          user:{
            name:"",
            profile_image_url:"/1px.png"
          },
          created_at:"",
          id: randomId()
      })
    }
    this.setState({data})
  }
}

