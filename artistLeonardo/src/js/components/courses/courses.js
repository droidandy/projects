/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    content = require("./coursesContent"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store"),
    Link = require("./../link/link"),
    words = require("./../../words");

class Courses extends React.Component {

  constructor(props) {
    super(props);
    this.swiper = null;
    this.initSwiper = this.initSwiper.bind(this);
  }

  componentDidMount() {
    let { event } = this.props;
    if(!event) {
      event = "coursesWatch";
    }
    Store.bind(event, this.initSwiper);
  }

  initSwiper() {
    if(this.swiper == null) {
      setTimeout(() => {
        this.swiper = app.f7.swiper('.courses--slider', {
          pagination:'.courses--slider--pagination'
        });
      }, 300);
    }
  }

  _renderSlides(images) {
    return images.map((image, i) => {
      return (
          <div
              key={i}
              className="courses--slider--slide swiper-slide"
              style={{backgroundImage: `url("${image}")`}}
              />
      );
    });
  }


  render() {
    return (
        <div className="courses">
          <div className="courses--title">{content.title[LN]}</div>
          <div className="swiper-container courses--slider">
            <div className="swiper-wrapper">{this._renderSlides(content.images)}</div>
            <div className="swiper-pagination courses--slider--pagination"></div>
          </div>
          <div
              className="courses--desc"
              dangerouslySetInnerHTML={{__html: content.desc[LN]}}
              />
          <Link
              href={content.link[LN]}
              text={words.courses_take[LN]}
              style={{width: "80%", margin: "10px auto"}}
              />
        </div>
    );
  }
}

module.exports = Courses;
