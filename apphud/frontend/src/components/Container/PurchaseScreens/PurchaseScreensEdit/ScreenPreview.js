import React from "react"
import Frame from "react-frame-component"
import IOSStatusBar from "../../../Common/IOSStatusBar"

class ScreenPreview extends React.Component {
  render() {
    const {
      screenLoading,
      compiledHtml,
      width,
      height,
      status_bar_color,
      id,
      deviceId
    } = this.props

    return (
      <div
        className={
          "purchase-screen__item-screen purchase-screen__item-screen_edit " +
          ` purchase-screen__item-screen_${deviceId}`
        }
        style={{ width, height }}
      >
        {status_bar_color && <IOSStatusBar color={status_bar_color} />}
        {screenLoading ? (
          <div
            className="animated-background timeline-item"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Frame
            id="screen-frame"
            className="purchase-screen__item-screen__content purchase-screen__item-screen__content_scrollable"
            style={{ width: "100%", height: "100%" }}
          >
            <div
              className="purchase-screen__item-screen__content purchase-screen__item-screen__content_scrollable"
              dangerouslySetInnerHTML={{ __html: compiledHtml }}
            />
            <style>
              {
                '.purchase-screen__item-screen__content {height: 100%} .purchase-screen__item-screen__content:after {content: "";position: fixed;z-index: 1;top: 0;width: 100%; height: 100%;} .frame-root, .frame-content { height: 100% } html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,hr,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif !important;border:0;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}ol,ul,li{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}b,strong{font-weight:600}html{position:static!important;top:0!important;box-sizing:border-box}*,:before,:after{box-sizing:inherit}html,body{height:100%}'
              }
            </style>
          </Frame>
        )}
        {!screenLoading && (
          <div className="purchase-screen__edit-alert">
            Make sure you clearly describe all subscription terms on the screen
            and follow Apple Review Guidelines.
          </div>
        )}
      </div>
    )
  }
}

export default ScreenPreview
