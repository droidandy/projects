/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    content = require("./booksContent"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store"),
    Link = require("./../link/link"),
    Courses = require("./../courses/courses"),
    words = require("./../../words");

const EBook = props => {
  return (
      <div className="books--eBook">
        <div className="books--eBook--name">{props.name}</div>
        <div
            className="books--eBook--image"
            style={{backgroundImage: `url("${props.image}")`}}
            />
        <div
            className="books--eBook--desc"
            dangerouslySetInnerHTML={{__html: props.desc}}
            />
        <Link
            href={props.link}
            text={words.book_buy[LN]}
            style={{width: "80%", margin: "10px auto"}}
            />
      </div>
  );
};

class MainBook extends React.Component {

  constructor(props) {
    super(props);
    this.swiper = null;
    this.initSwiper = this.initSwiper.bind(this);
  }

  componentDidMount() {
    Store.bind("booksWatch", this.initSwiper);
  }

  initSwiper() {
    if(this.swiper == null) {
      this.swiper = app.f7.swiper('.books--main--slider', {
        pagination:'.books--main--slider--pagination'
      });
    }
  }

  _renderSlides(images) {
    return images.map((image, i) => {
      return (
          <div
              key={i}
              className="swiper-slide books--main--slider--slide"
              style={{backgroundImage: `url("${image}")`}}
              />
      );
    });
  }

  render() {
    return (
        <div className="books--main">
          <div className="books--main--name">{this.props.name}</div>
          <div className="swiper-container books--main--slider">
            <div className="swiper-wrapper">{this._renderSlides(this.props.images)}</div>
            <div className="swiper-pagination books--main--slider--pagination"></div>
          </div>
          <div
              className="books--main--desc"
              dangerouslySetInnerHTML={{__html: this.props.desc}}
              />
          <Link
              href={this.props.link}
              text={words.book_atAmazon[LN]}
              style={{width: "80%", margin: "10px auto"}}
              />
        </div>
    );
  }
}

class Books extends React.Component {
  render() {
    return (
        <div className="books">
          <MainBook
              images={content.book1.images}
              name={content.book1.name[LN]}
              desc={content.book1.desc[LN]}
              link={content.book1.link[LN]}
              />
          <hr/>
          <Courses event="booksWatch"/>
          <hr/>
          <div className="checkout">
            Also checkout my e-books
          </div>
          <EBook
              name={content.book2.name[LN]}
              image={content.book2.image[LN]}
              desc={content.book2.desc[LN]}
              link={content.book2.link[LN]}
              />
          <hr/>
          <EBook
              name={content.book3.name[LN]}
              image={content.book3.image[LN]}
              desc={content.book3.desc[LN]}
              link={content.book3.link[LN]}
              />
        </div>
    );
  }
}

module.exports = Books;
