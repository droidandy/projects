var React = require("react"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store");

class Buttons extends React.Component {

    constructor(props) {
        super(props);
        this.fanArtShowByUser = this.fanArtShowByUser.bind(this);
    }

    componentDidMount() {
        Store.bind("fetchFanArtUser", this.fanArtShowByUser);
    }

    test() {
        console.log("listen store");
    }

    fanArtShowByUser(){
        Store.fetchFanArtUser();
    }

    render() {
        return (
            <div>
                <span
                    className="buttons"
                    onClick={this.fanArtShowByUser}
                >BEST</span>
                <span
                    className="buttons"
                    onClick={this.fanArtShowByUser}
                >MY</span>
            </div>
        );
    }
}

module.exports = Buttons;