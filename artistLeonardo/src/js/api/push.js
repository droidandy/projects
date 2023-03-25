/**
 * Created by developercomputer on 22.12.15.
 */

var { f7 } = require("./../f7init/f7init");

module.exports = {
  keys: {
    ios: {
      artist_leonardo: "e4182f70-1e87-4496-9b0a-98d27988c665",
      artist_leonardo_free: "816c78ee-9192-4ec6-a313-f1a870ddf0e6"
    }
  },
  google: {
    project_number: {
      artist_leonardo: "215666093439",
      artist_leonardo_free: "1024457787778",
      current: ""
    },
    server_key: {
      artist_leonardo: "AIzaSyBLzeRhphXLDtBMLKyAeKC9wb5qMUNnBqE",
      artist_leonardo_free: "AIzaSyDte6kah7Zrzpj4pm9K2bEiLdMe3k_FDb8"
    }
  },
  current_key: null,
  init(free) {
    if(typeof(window.plugins) === "undefined") return console.warn("Push initialization failed: there is no any plugins");
    if(typeof(window.plugins.OneSignal) === "undefined") return console.warn("Push initialization failed: there is no OneSignal plugin");
    console.log('Push initialization');
    if(free) {
      this.current_key = this.keys.ios.artist_leonardo_free;
      this.google.project_number.current = this.google.project_number.artist_leonardo_free;
    } else {
      this.current_key = this.keys.ios.artist_leonardo;
      this.google.project_number.current = this.google.project_number.artist_leonardo;
    }
    const { current_key } = this;
    const projectNumber = this.google.project_number.current;
    console.log(current_key, projectNumber);
    if(window.plugins.OneSignal) {
      // window.plugins.OneSignal.setLogLevel({logLevel: 0, visualLevel: 0});
      const notificationOpenedCallback = (jsonData) => {
        console.log('didReceiveRemoteNotificationCallBack: ' + jsonData);
        let data;
        if(typeof(jsonData) === "string") {
          data = JSON.parse(jsonData);
        } else {
          data = jsonData;
        }
        if(data.hasOwnProperty("additionalData") && data.additionalData.videoId) {
          let browser = f7.photoBrowser({
            photos: [data.additionalData.newImage],
            theme: "dark",
            navbarTemplate: `
              <div class="navbar">
                  <div class="navbar-inner">
                      <div class="left">
                          <a href="#" class="link close-popup photo-browser-close-link">
                              <span>Close</span>
                          </a>
                      </div>
                      <div class="right">
                          <a href="#" class="link icon-only share-button">
                              <i class="icon icon-share"></i>
                          </a>
                          <a href="#" class="link icon-only pinterest-button">
                              <i class="icon icon-pinterest"></i>
                          </a>
                      </div>
                  </div>
              </div>`,
            toolbarTemplate: "<div></div>"
          });
          browser.open();
          const pin_url = "http://www.artistleonardo.com/";
          const desc = "";
          $$(".pinterest-button").on("click", () => {
            try {
              PDK.pin(data.newImage, desc, pin_url, () => console.log("done"));
            } catch(e) {
              console.log(e);
            }
          });
          $$(".share-button").on("click", () => {
            window.plugins.socialsharing.share(null, null, data.newImage, null);
          });
        } else if (data.hasOwnProperty("additionalData") && data.additionalData.blogID && data.additionalData.postID) {          
          var post_url = 'https://www.blogger.com/feeds/'+ data.additionalData.blogID +
                    '/posts/default/'+ data.additionalData.postID +'?alt=json';
          
          f7.showIndicator();
          $$.getJSON(post_url, data => {
            f7.hideIndicator();
            content = data.entry.content.$t;
            title = data.entry.title.$t;
            var popupHTML = 
              '<div class="popup navbar-fixed blog--popup tablet-fullscreen">'+
                '<div class="page white">'+
                  '<div class="navbar">'+
                        '<div class="navbar-inner">'+
                            '<div class="left">'+
                              '<a href="#" class="link close-popup redLabel">' + words.close[LN] + '</a>'+
                            '</div>'+
                            '<div class="center">' + title + '</div>'+
                            '<div class="right"></div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="page-content blog--container" id="blog-content">'+
                      content+
                    '</div>'+
                  '</div>'+
              '</div>';
            f7.popup(popupHTML);
            f7.sizeNavbars($$(".blog--popup"));
            $$(".blog--popup a").each((i, el) => {
              if(el.classList.contains("link")) return false;
              $$(el).on("click", function() {
                cordova.InAppBrowser.open(this.href, "_system", 'location=no');
              });
            });
            var blogContent = document.getElementById("blog-content");
            //If user will click to iframe, site would open in our webview, so we would lose control and our app change to site
            //here is fix of this problem
            //create overlay at every iframe
            $$("iframe").each((i, el) => {
              if(el.classList.contains("YOUTUBE-iframe-video")) {
                return false;
              }
              el.onload = () => {
                var layer = document.createElement("div");
                layer.style.position = "absolute";
                layer.style.width = `${el.offsetWidth}px`;
                layer.style.height = `${el.offsetHeight}px`;
                layer.style.left = `${el.offsetLeft}px`;
                layer.style.top = `${el.offsetTop}px`;
                var link;
                try {
                  link = el.contentDocument.getElementsByTagName("a")[0].href;
                } catch(e) {
                  console.log(e);
                  link = el.src;
                }
                $$(layer).on("click", function() {
                  cordova.InAppBrowser.open(link, "_system", 'location=no');
                });
                blogContent.appendChild(layer);
              };
            });
          });
        }
      };
      window.plugins.OneSignal.init(current_key, {
        googleProjectNumber: projectNumber,
        autoRegister: true
      }, notificationOpenedCallback);
      // Show an alert box if a notification comes in when the user is in your app.
      window.plugins.OneSignal.enableInAppAlertNotification(true);
    } else {
      console.warn("Can not find variable OneSignal. Push initialization failed.");
    }
  }
};
