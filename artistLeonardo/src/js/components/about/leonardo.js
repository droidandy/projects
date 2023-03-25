/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    content = require("./leonardoContent"),
    Link = require("./../link/link");


class About extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      desc: content.desc[LN],
      image: content.image
    };
    this.fetchCurriculum = this.fetchCurriculum.bind(this);
  }

  componentDidMount() {
    this.fetchCurriculum();
  }

  fetchCurriculum() {
    try {
      var curriculum = LN === "en" ? "EngCurriculum" : "SpainCurriculum";
      var SpainCurriculum = Parse.Object.extend(curriculum);
      var query = new Parse.Query(SpainCurriculum);
      query.find({
        success: curriculums => {
          // The object was retrieved successfully.
          var data = curriculums[0].toJSON();
          this.setState({
            desc: data.desc === "" ? content.desc[LN] : data.desc,
            image: data.image === "" ? content.image : content.image
          });
        },
        error: (others, error) => {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
          console.log(error);
          this.setState({
            desc: content.desc[LN],
            image: content.image
          });
        }
      });
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    return (
        <div className="about">
          <div
              className="about--image"
              style={{backgroundImage: `url("${this.state.image}")`}}
              />
          <div
              className="about--desc"
              dangerouslySetInnerHTML={{__html: this.state.desc}}
              />
          <Link
              href={content.link[LN]}
              text={content.linkText}
              style={{width: "90%", margin: "10px auto"}}
              />
        </div>
    );
  }
}

module.exports = About;
