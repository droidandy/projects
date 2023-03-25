import React from "react";
import "./index.scss";
import Header from "@Components/Structure/Header";
import { translate } from "@Core/i18n";

const messengers = [
  {
    key: "telegram",
    name: "Telegram",
    url: "https://telegram.me/creamly",
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    url: "whatsapp://send?phone=31657493359",
  },
  {
    key: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/cream.ly/",
  },
  {
    key: "facebook",
    name: "Messenger",
    url:
      "https://m.me/1959936880896657?ref=messenger_commerce_1163199097047119_https://cream.ly/",
  },
];

const orderEN = ["facebook", "whatsapp", "instagram", "telegram"];

@translate(
  {
    title: "Мы отвечаем на сообщения",
  },
  "MessageUs"
)
export default class MessageUs extends React.Component {
  constructor(props) {
    super(props);

    this.messengers = this.orderMessenger();
    this.renderButton = this.renderButton.bind(this);
  }

  orderMessenger() {
    if (this.props.lang == "en") {
      return orderEN.map((key) => {
        return messengers.filter((messenger) => messenger.key == key).shift();
      });
    }

    return messengers;
  }

  renderButton(messenger) {
    return (
      <div key={messenger.key} className="col-12 col-sm-6 col-md-3 button">
        <a className={messenger.key} target="_blank" href={messenger.url}>
          <div className="row no-gutters btn-content">
            <div className="col">
              <div className="img" />
            </div>
            <div key="name" className="align-self-center label col-8">
              {messenger.name}
            </div>
          </div>
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className="message-us-component" data-nosnippet>
        <Header text={this.t("title")} />
        <div key="buttons" className="buttons row no-gutters">
          {this.messengers.map(this.renderButton)}
        </div>
      </div>
    );
  }
}
