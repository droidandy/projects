import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import SweetAlert from "react-swal"
import Aux from "../../../hoc/Aux"
import history from "../../../history"
import Frame from "react-frame-component"
import IOSStatusBar from "../../../components/Common/IOSStatusBar"

class PurchaseScreensItemConfigured extends Component {
  render() {
    const {
      appId,
      screen,
      options,
      screensType,
      handleOpenScreensBuilder,
      hideHeader,
      screenStatus,
      archive,
      unarchive,
      duplicate
    } = this.props
    return (
      <div className="purchase-screen__item">
        {!hideHeader && (
          <div className="purchase-screen__item-header ta-left">
            <div className="purchase-screen__item-info">
              <div className="purchase-screen__item-header__name">
                {screen.name}
              </div>
              <div className="purchase-screen__item-header__id">
                <span className="capitalize">{screen.kind}</span>
                &nbsp;screen
              </div>
            </div>
            {screen.version === "v1" && (
              <div className="fr tag tag_silver mt10">View only</div>
            )}
          </div>
        )}
        <div className="purchase-screen__item-screen">
          {screen.version === "v2" && options && (
            <div className="rules-actions__item-footer-item__menu">
              <div className="rules-actions__item-footer-item__menu-buttons">
                <div
                  onClick={handleOpenScreensBuilder.bind(null, screen.id)}
                  className="rules-actions__item-footer-item__menu-button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.33698 3.53932L13.0491 9.25302L9.25377 13.0473L3.54168 7.33355L7.33698 3.53932Z"
                      fill="white"
                    />
                    <path
                      d="M2.59864 6.39333L2.11864 5.914C1.07264 4.868 1.07264 3.16533 2.11864 2.11867C3.16464 1.07267 4.86798 1.07267 5.91398 2.11867L6.39331 2.59867L2.59864 6.39333Z"
                      fill="white"
                    />
                    <path
                      d="M10.4013 13.7867L13.8387 14.6453C14.066 14.7013 14.3067 14.6353 14.472 14.47C14.6373 14.3047 14.704 14.064 14.6473 13.8373L13.788 10.4L10.4013 13.7867Z"
                      fill="white"
                    />
                  </svg>
                  <span>Edit</span>
                </div>
                <div
                  onClick={duplicate.bind(null, screen)}
                  className="rules-actions__item-footer-item__menu-button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.5 1C3.11929 1 2 2.11929 2 3.5V11.5H3V3.5C3 2.67157 3.67157 2 4.5 2H11.5V1H4.5ZM6 3C4.89543 3 4 3.89543 4 5V13C4 14.1046 4.89543 15 6 15H12C13.1046 15 14 14.1046 14 13V5C14 3.89543 13.1046 3 12 3H6Z"
                      fill="white"
                    />
                  </svg>
                  <span>Duplicate</span>
                </div>
                {screenStatus === "archived" ? (
                  <div
                    onClick={unarchive.bind(null, screen)}
                    className="rules-actions__item-footer-item__menu-button"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 2C0.895431 2 0 2.89543 0 4V5H16V4C16 2.89543 15.1046 2 14 2H2ZM1 6H15V12C15 13.1046 14.1046 14 13 14H3C1.89543 14 1 13.1046 1 12V6ZM5 8H11V9H5V8Z"
                        fill="white"
                      />
                    </svg>
                    <span>Unarchive</span>
                  </div>
                ) : (
                  <div
                    onClick={archive.bind(null, screen)}
                    className="rules-actions__item-footer-item__menu-button"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 2C0.895431 2 0 2.89543 0 4V5H16V4C16 2.89543 15.1046 2 14 2H2ZM1 6H15V12C15 13.1046 14.1046 14 13 14H3C1.89543 14 1 13.1046 1 12V6ZM5 8H11V9H5V8Z"
                        fill="white"
                      />
                    </svg>
                    <span>Archive</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* <div className="purchase-screen__item-screen__status">
            <svg className="purchase-screen__item-screen__status-signal" width="35" height="7" viewBox="0 0 35 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.75 6.5C5.26878 6.5 6.5 5.26878 6.5 3.75C6.5 2.23122 5.26878 1 3.75 1C2.23122 1 1 2.23122 1 3.75C1 5.26878 2.23122 6.5 3.75 6.5Z" fill="black" stroke="black" strokeWidth="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M10.75 6.5C12.2688 6.5 13.5 5.26878 13.5 3.75C13.5 2.23122 12.2688 1 10.75 1C9.23122 1 8 2.23122 8 3.75C8 5.26878 9.23122 6.5 10.75 6.5Z" fill="black" stroke="black" strokeWidth="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M17.75 6.5C19.2688 6.5 20.5 5.26878 20.5 3.75C20.5 2.23122 19.2688 1 17.75 1C16.2312 1 15 2.23122 15 3.75C15 5.26878 16.2312 6.5 17.75 6.5Z" fill="black" stroke="black" strokeWidth="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M24.75 6.5C26.2688 6.5 27.5 5.26878 27.5 3.75C27.5 2.23122 26.2688 1 24.75 1C23.2312 1 22 2.23122 22 3.75C22 5.26878 23.2312 6.5 24.75 6.5Z" fill="black" stroke="black" strokeWidth="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M31.75 6.5C33.2688 6.5 34.5 5.26878 34.5 3.75C34.5 2.23122 33.2688 1 31.75 1C30.2312 1 29 2.23122 29 3.75C29 5.26878 30.2312 6.5 31.75 6.5Z" fill="black" stroke="black" strokeWidth="0.5"/>
            </svg>
            <svg className="purchase-screen__item-screen__status-wifi" width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.3635 0C8.849 0 11.099 1.0075 12.728 2.636L11.667 3.6965C10.31 2.3395 8.435 1.4995 6.364 1.4995C4.293 1.4995 2.418 2.339 1.061 3.6965L0 2.636C1.628 1.0075 3.878 0 6.3635 0ZM10.606 4.7575L9.545 5.818C8.731 5.004 7.606 4.5 6.3635 4.5C5.121 4.5 3.996 5.004 3.1815 5.818L2.121 4.7575C3.207 3.672 4.707 3 6.3635 3C8.02 3 9.52 3.6715 10.606 4.7575ZM6.3635 6C7.192 6 7.9415 6.336 8.4845 6.879L6.3635 9L4.242 6.879C4.785 6.336 5.535 6 6.3635 6Z" fill="black"/>
            </svg>
            <svg className="purchase-screen__item-screen__status-time" width="45" height="10" viewBox="0 0 45 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.66822 5.928H4.21222V2.232H4.18822L1.66822 5.928ZM6.58822 7.008H5.50822V9H4.21222V7.008H0.612219V5.652L4.21222 0.599999H5.50822V5.928H6.58822V7.008ZM7.82019 7.38H9.48819V9H7.82019V7.38ZM7.82019 2.928H9.48819V4.548H7.82019V2.928ZM13.668 0.431999C14.268 0.431999 14.756 0.572 15.132 0.852C15.516 1.124 15.812 1.476 16.02 1.908C16.236 2.332 16.38 2.8 16.452 3.312C16.532 3.824 16.572 4.32 16.572 4.8C16.572 5.28 16.532 5.776 16.452 6.288C16.38 6.8 16.236 7.272 16.02 7.704C15.812 8.128 15.516 8.48 15.132 8.76C14.756 9.032 14.268 9.168 13.668 9.168C13.068 9.168 12.576 9.032 12.192 8.76C11.816 8.48 11.52 8.128 11.304 7.704C11.096 7.272 10.952 6.8 10.872 6.288C10.8 5.776 10.764 5.28 10.764 4.8C10.764 4.32 10.8 3.824 10.872 3.312C10.952 2.8 11.096 2.332 11.304 1.908C11.52 1.476 11.816 1.124 12.192 0.852C12.576 0.572 13.068 0.431999 13.668 0.431999ZM13.668 8.028C13.964 8.028 14.212 7.944 14.412 7.776C14.612 7.6 14.768 7.368 14.88 7.08C15 6.784 15.084 6.44 15.132 6.048C15.18 5.656 15.204 5.24 15.204 4.8C15.204 4.36 15.18 3.948 15.132 3.564C15.084 3.172 15 2.828 14.88 2.532C14.768 2.236 14.612 2.004 14.412 1.836C14.212 1.66 13.964 1.572 13.668 1.572C13.364 1.572 13.112 1.66 12.912 1.836C12.72 2.004 12.564 2.236 12.444 2.532C12.332 2.828 12.252 3.172 12.204 3.564C12.156 3.948 12.132 4.36 12.132 4.8C12.132 5.24 12.156 5.656 12.204 6.048C12.252 6.44 12.332 6.784 12.444 7.08C12.564 7.368 12.72 7.6 12.912 7.776C13.112 7.944 13.364 8.028 13.668 8.028ZM20.336 0.431999C20.936 0.431999 21.424 0.572 21.8 0.852C22.184 1.124 22.48 1.476 22.688 1.908C22.904 2.332 23.048 2.8 23.12 3.312C23.2 3.824 23.24 4.32 23.24 4.8C23.24 5.28 23.2 5.776 23.12 6.288C23.048 6.8 22.904 7.272 22.688 7.704C22.48 8.128 22.184 8.48 21.8 8.76C21.424 9.032 20.936 9.168 20.336 9.168C19.736 9.168 19.244 9.032 18.86 8.76C18.484 8.48 18.188 8.128 17.972 7.704C17.764 7.272 17.62 6.8 17.54 6.288C17.468 5.776 17.432 5.28 17.432 4.8C17.432 4.32 17.468 3.824 17.54 3.312C17.62 2.8 17.764 2.332 17.972 1.908C18.188 1.476 18.484 1.124 18.86 0.852C19.244 0.572 19.736 0.431999 20.336 0.431999ZM20.336 8.028C20.632 8.028 20.88 7.944 21.08 7.776C21.28 7.6 21.436 7.368 21.548 7.08C21.668 6.784 21.752 6.44 21.8 6.048C21.848 5.656 21.872 5.24 21.872 4.8C21.872 4.36 21.848 3.948 21.8 3.564C21.752 3.172 21.668 2.828 21.548 2.532C21.436 2.236 21.28 2.004 21.08 1.836C20.88 1.66 20.632 1.572 20.336 1.572C20.032 1.572 19.78 1.66 19.58 1.836C19.388 2.004 19.232 2.236 19.112 2.532C19 2.828 18.92 3.172 18.872 3.564C18.824 3.948 18.8 4.36 18.8 4.8C18.8 5.24 18.824 5.656 18.872 6.048C18.92 6.44 19 6.784 19.112 7.08C19.232 7.368 19.388 7.6 19.58 7.776C19.78 7.944 20.032 8.028 20.336 8.028ZM27.9198 0.431999H31.6998C32.3078 0.431999 32.8038 0.52 33.1878 0.696C33.5718 0.872 33.8678 1.092 34.0758 1.356C34.2838 1.62 34.4238 1.908 34.4958 2.22C34.5758 2.532 34.6158 2.82 34.6158 3.084C34.6158 3.348 34.5758 3.636 34.4958 3.948C34.4238 4.252 34.2838 4.536 34.0758 4.8C33.8678 5.064 33.5718 5.284 33.1878 5.46C32.8038 5.628 32.3078 5.712 31.6998 5.712H29.4198V9H27.9198V0.431999ZM29.4198 4.488H31.6158C31.7838 4.488 31.9558 4.464 32.1318 4.416C32.3078 4.368 32.4678 4.292 32.6118 4.188C32.7638 4.076 32.8838 3.932 32.9718 3.756C33.0678 3.572 33.1158 3.344 33.1158 3.072C33.1158 2.792 33.0758 2.56 32.9958 2.376C32.9158 2.192 32.8078 2.048 32.6718 1.944C32.5358 1.832 32.3798 1.756 32.2038 1.716C32.0278 1.676 31.8398 1.656 31.6398 1.656H29.4198V4.488ZM35.8997 0.431999H38.0117L40.3757 7.14H40.3997L42.7037 0.431999H44.7917V9H43.3637V2.388H43.3397L40.9637 9H39.7277L37.3517 2.388H37.3277V9H35.8997V0.431999Z" fill="black"/>
            </svg>
            <svg className="purchase-screen__item-screen__status-battery" width="25" height="10" viewBox="0 0 25 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M23 3V6.5C23.8285 6.5 24.5 5.828 24.5 5V4.5C24.5 3.6715 23.8285 3 23 3ZM21 0H1.5C0.6715 0 0 0.6715 0 1.5V8C0 8.828 0.6715 9.5 1.5 9.5H21C21.828 9.5 22.5 8.828 22.5 8V1.5C22.5 0.6715 21.828 0 21 0ZM22 7.658C22 8.399 21.388 9 20.6335 9H1.867C1.112 9 0.5005 8.3995 0.5005 7.658V1.842C0.5005 1.101 1.1125 0.5 1.867 0.5H20.6335C21.3885 0.5 22 1.101 22 1.842V7.658ZM20.2605 1H2.2395C1.555 1 1 1.5305 1 2.184V7.316C1 7.97 1.555 8.5 2.2395 8.5H20.2605C20.9455 8.5 21.5 7.9695 21.5 7.316V2.184C21.5 1.5305 20.9455 1 20.2605 1Z" fill="black"/>
            </svg>
          </div> */}
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
)(PurchaseScreensItemConfigured)
