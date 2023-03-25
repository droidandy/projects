import React from "react";
import { translate } from "@Core/i18n";
import {menuPrepare} from "@Components/SharedComponents/SiteHeader";
import RegionIcon from "../RegionIcon";
import "./index.scss";

@translate({}, "common")
export default class MobileMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: props.menu ? props.menu : menuPrepare(this),
      host: props.host
    }
  }

  render() {
    return (
      <div className="MobileMenu">
         <nav>
          <div className="main">
          {this.state.menu.left.map((link, i) => {
            return <a
                  key={i}
                  className={`${link.url == "/pages/quiz" && "highlight"}`}
                  href={link.url}
                >
                  {link.title}
                </a>
          })}
          {this.state.menu.right.map((link, i) => {
            return <a key={i} href={link.url}>{link.title}</a>
          })}
          </div>
         
          <div className="other">
          {this.state.menu.footer.map((link, i) => {
            return (
                <a key={i} href={link.url}>{link.title}</a>
            );
          })}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                this.props.actionOnClickRegionChange()
              }}
            >
              {this.t("common:menu.customizeRegion")} <RegionIcon />
            </a>
          </div>
        </nav>
      
      
    </div>
    );
  }
}
