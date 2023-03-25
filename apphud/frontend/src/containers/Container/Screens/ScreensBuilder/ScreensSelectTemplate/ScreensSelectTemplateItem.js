import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import SweetAlert from "react-swal"
import Aux from "../../../../../hoc/Aux"
import history from "../../../../../history"
import Frame from "react-frame-component"
import IOSStatusBar from "../../../../../components/Common/IOSStatusBar"

class ScreensSelectTemplateItem extends Component {
  render() {
    const { appId, screen, options, handleChooseScreen } = this.props

    return (
      <div
        className="purchase-screen__item cp"
        onClick={handleChooseScreen.bind(null, screen.id)}
      >
        <div className="purchase-screen__item-screen">
          {options && (
            <div className="rules-actions__item-footer-item__menu">
              <div className="rules-actions__item-footer-item__menu-buttons">
                <div className="rules-actions__item-footer-item__menu-button">
                  <span>Select template</span>
                </div>
              </div>
            </div>
          )}
          <IOSStatusBar color={screen.status_bar_color} />
          <Frame style={{ width: "100%", height: "100%" }}>
            <div
              className="purchase-screen__item-screen__content"
              dangerouslySetInnerHTML={{
                __html: `${screen.html} <style>${screen.css}</style>`
              }}
            />
             <style>
              {
                `.purchase-screen__item-screen__content {height: 100%} .purchase-screen__item-screen__content:after {content: "";position: absolute;z-index: 1;left: 0;right: 0;bottom: 0;top: 0;} .frame-root, .frame-content { height: 100% } html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,hr,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif !important;border:0;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}ol,ul,li{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}b,strong{font-weight:600}html{position:static!important;top:0!important;box-sizing:border-box}*,:before,:after{box-sizing:inherit}html,body{height:100%}`
              }
            </style>
          </Frame>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreensSelectTemplateItem)
