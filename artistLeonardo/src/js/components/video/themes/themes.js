/**
 * Created by developercomputer on 27.10.15.
 */

var React = require("react"),
    Store = require("./../../../stores/store"),
    YouTubeApi = require("../../../api/youtube"),
    app = require("./../../../f7init/f7init");


class Themes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.fetchPlayLists = this.fetchPlayLists.bind(this);
    this._renderPlayLists = this._renderPlayLists.bind(this);
  }

  componentDidMount() {
    Store.bind("fetchPlayLists", this.fetchPlayLists);
  }

  fetchPlayLists() {
    if(this.state.items.length !== 0) {
      return false;
    }
    return $$.getJSON(YouTubeApi.getPlayLists(YouTubeApi.youtube_channel_id), data => {
      /*
      * Order of playlists
      * 1. Basics - PLOdvsn4gGyr-Sdc-inqnGMmNruC6uxbTu
      * 2. Surfaces & Textures - PLB669DC1AD5E50B12
      * 3. People - PL2CBF335893D28F41
      * 4. Animals - PL4C4B11CCFAF64B8F
      * 5. Optical Illusions - PL001B156652D59533
      * 6. Landscapes - PL70AA61A269C3C2C0
      * 7. Flowers - PLOdvsn4gGyr8HL6NVhwHyq9DViIozIAC3
      * 8. Painting - PLC28DDA0784C45F6A
      * 9. Cars - PLOdvsn4gGyr_sI4-LQweIEwoE6dzZuaAB
      * 10. Sculpture - PLOdvsn4gGyr8cGf8B6reSGDORVM_7STLs
      * 11. Culture - PL221C4835E908846A
      * 12. X-Mas Specials - DIY PLOdvsn4gGyr9CYvBgx4ZYafCnTSxvbMOA
      * 13. Timelapse Videos PLOdvsn4gGyr9979oKx45uEF9RnlnOzNey
      * */

      var orderES = [
        "PLI2QDeRwRQw55v07e2C6xtR83kpMflP38",
        "PLD16F72AEC4C5CB88",
        "PLD1E6F0619AD4AE81",
        "PLE952F0CA4B6A7B32",
        "PLFE3AD60CECAE0B0D",
        "PLAEC778F6E5F0C533",
        "PLI2QDeRwRQw4Iz95L6A-DV46EgyPMhI7s",
        "PLB78216288FE26C7E",
        "PLI2QDeRwRQw7a1fBU2QPvw--2WHDmhEbC",
        "PLI2QDeRwRQw7zQcQggjBVIFFkODc1cB6m",
        "PLAA837F99CC1E525A",
        "PLI2QDeRwRQw6p9Zjfq5B7SPcZeRy5GGZz"
      ];
      var orderEN = [
          "PLOdvsn4gGyr-Sdc-inqnGMmNruC6uxbTu",
          "PLB669DC1AD5E50B12",
          "PL2CBF335893D28F41",
          "PL4C4B11CCFAF64B8F",
          "PL001B156652D59533",
          "PL70AA61A269C3C2C0",
          "PLOdvsn4gGyr8HL6NVhwHyq9DViIozIAC3",
          "PLC28DDA0784C45F6A",
          "PLOdvsn4gGyr_sI4-LQweIEwoE6dzZuaAB",
          "PLOdvsn4gGyr8cGf8B6reSGDORVM_7STLs",
          "PL221C4835E908846A",
          "PLOdvsn4gGyr9CYvBgx4ZYafCnTSxvbMOA",
          "PLOdvsn4gGyr9979oKx45uEF9RnlnOzNey"
      ];
      var order = LN === "en" ? orderEN.slice() : orderES.slice();
      var items = data.items.slice();
      var orderedItems = [];
      for(let i =  0, len = order.length; i < len; i++) {
        let id = order[i];
        for(let j = 0, len2 = items.length; j < len2; j++) {
          let item = items[j];
          if(item.id === id) {
            orderedItems.push(item);
            break;
          }
        }
      }
      if(items.length !== orderedItems.length) {
        for(let i = 0, len = items.length; i < len; i++) {
          let item = items[i];
          let flag = false;
          for(let j = 0, len2 = orderedItems.length; j < len2; j++) {
            let id = orderedItems[j].id;
            if(id === item.id) {
              flag = true;
            }
          }
          if(!flag) {
            orderedItems.push(item);
          }
        }
      }
      const vipId = "PLI2QDeRwRQw6QR9rimTd__XNgpYSRNnV-";
      orderedItems.filter(item => item.id !== vipId);
      this.setState({ items: orderedItems });
    });
  }



  _renderPlayLists() {
    if(this.state.items.length === 0) {
      return (
          <div></div>
      );
    }
    return this.state.items.map((item, i) => {
      var bg = {
        backgroundImage: `url("${item.snippet.thumbnails.high.url}")`
      };
      return (
          <a href={`#videoTutorials-tutorials?id=${item.id}&title=${item.snippet.title}`} className="video--playLists--elem" key={i}>
            <div className="title">{item.snippet.title}</div>
            <div className="thumbnail" style={bg}></div>
          </a>
      );
    });
  }

  render() {
    return (
        <div className="video--playLists">
          {this._renderPlayLists()}
        </div>
    );
  }
}

module.exports = Themes;
