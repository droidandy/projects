/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    app = require("./../../f7init/f7init"),
    Feed = require("./../../api/feed_blog"),
    moment = require("moment"),
    words = require("./../../words");

var parser = new DOMParser();

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.fetchBlog = this.fetchBlog.bind(this);
    this._renderFeed = this._renderFeed.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchBlog", this.fetchBlog);
  }

  fetchBlog() {
    if(this.state.items.length !== 0) {
      return false;
    }
    app.f7.showIndicator();
    $$.getJSON(Feed.query[LN], data => {
      app.f7.hideIndicator();
      //let feed = data.responseData.feed;
      //this.setState({ items: feed.entries });
      let feed = data.feed;
      this.setState({ items: feed.entry });
    });
  }

  showBlog() {
    var popupHTML = `
      <div class="popup navbar-fixed blog--popup tablet-fullscreen">
        <div class="page white">
          <div class="navbar">
                <div class="navbar-inner">
                    <div class="left">
                      <a href="#" class="link close-popup redLabel">${words.close[LN]}</a>
                    </div>
                    <div class="center">${this.title}</div>
                    <div class="right"></div>
                </div>
            </div>
            <div class="page-content blog--container" id="blog-content">
              ${this.content}
            </div>
          </div>
      </div>`;
    app.f7.popup(popupHTML);
    app.f7.sizeNavbars($$(".blog--popup"));
    $$(".blog--popup a").each((i, el) => {
      if(el.classList.contains("link")) return false;
      $$(el).on("click", function() {
        cordova.InAppBrowser.open(this.href, "_system", 'location=no');
      });
    });
    $$("#blog-content a img").each(function(i, el)  {
      if (/\.(jpe?g|png|gif|bmp)$/i.test($$(el).parent().attr('href'))) { 
        $$(el).parent().append('<div class="img-replace" style="background-image: url('+ $$(el).parent().attr('href') +');"></div>')
      } else 
      if ($$(el).attr('src')) {
        $$(el).parent().append('<div class="img-replace" style="background-image: url('+ $$(el).attr('src') +');"></div>')
      }
    });

    var blogContent = document.getElementById("blog-content");
    //If user will click to iframe, site would open in our webview, so we would lose control and our app weill turn to site
    //here is fix of this problem
    //create overlay at every iframe
    $$("iframe").each((i, el) => {
      if(el.classList.contains("YOUTUBE-iframe-video")) {
        return false;
      }
      el.onload = () => {
        var layer = document.createElement("div");
        layer.style.position = "absolute";
        layer.style.width = `${el.offsetWidth}px`;
        layer.style.height = `${el.offsetHeight}px`;
        layer.style.left = `${el.offsetLeft}px`;
        layer.style.top = `${el.offsetTop}px`;
        var link;
        try {
          link = el.contentDocument.getElementsByTagName("a")[0].href;
        } catch(e) {
          console.log(e);
          link = el.src;
        }
        $$(layer).on("click", function() {
          cordova.InAppBrowser.open(link, "_system", 'location=no');
        });
        blogContent.appendChild(layer);
      };
    });
  }

  _renderFeed() {
    if(this.state.items.length === 0) {
      return (
          <div/>
      );
    }
    return this.state.items.map((item, i) => {
      let content = item.content.$t.replace(/style/g, "x-style");
      /*
      stupid thing
      By some reason this space is in answer of api.
      To display text fine we delete it
      */
      var regExp = new RegExp(`//ws`, "g");
      content = content.replace(regExp, "https://ws");
      let context;
      try {
        context = {
          publishedDate: moment(item.published.$t).format('LL'),
          title: item.title.$t,
          content: content,
          author: item.author[0].name.$t
        };
      } catch(e) {
        console.log(e);
        return null;
      }
      let thumbnail = null;
      let goodThumb = null;
      var parseString = item.content.$t;
      var doc = parser.parseFromString(parseString, "text/html")
      var youtube_preview_img = $$('<div>' + item.content.$t + '</div>').find('.YOUTUBE-iframe-video');
      var blogger_youtube_preview_img = $$('<div>' + item.content.$t + '</div>').find('.BLOGGER-youtube-video');
      if (item.content.$t) {
        if( item.hasOwnProperty("media$thumbnail")) {
          thumbnail = <div className="thumbnail" style={{backgroundImage: `url(${item.media$thumbnail.url})`}}></div>;
        }
        if (youtube_preview_img.length > 0) {
          thumbnail = <div className="thumbnail" style={{backgroundImage: 'url('+ youtube_preview_img.dataset().thumbnailSrc +')'}}></div>;
        }if (blogger_youtube_preview_img.length > 0) {
          thumbnail = <div className="thumbnail" style={{backgroundImage: 'url('+ blogger_youtube_preview_img.dataset().thumbnailSrc +')'}}></div>;
        }
        if (doc.getElementsByTagName('img')[0] && (!youtube_preview_img.length > 0 || !blogger_youtube_preview_img.length > 0)) {
          goodThumb = doc.getElementsByTagName('img')[0].src;
          thumbnail = <div className="thumbnail" style={{backgroundImage: `url(${goodThumb})`}}></div>;
        }
      }
      return (
          <div className="blog--item" key={i}>
            <div className="author">{context.author}</div>
            <div className="posted">Publish date: {context.publishedDate}</div>
            <div className="title">{context.title}</div>
            {thumbnail}
            <p><a className="button" onClick={this.showBlog.bind(context)}>{words.blog_read[LN]}</a></p>
          </div>
      );
    });
  }


  render() {
    return (
        <div className="blog">
          {this._renderFeed()}
        </div>
    );
  }
}

module.exports = Blog;
