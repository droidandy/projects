/**
 * Created by developercomputer on 10.12.15.
 */
var { f7 } = require("./../f7init/f7init"),
    words = require("./../words");

const notificationOpenedCallback = (jsonData) => {
  console.log('didReceiveRemoteNotificationCallBack: ' + jsonData);
  let data;
  var content, title;
  if(typeof(jsonData) === "string") {
    data = JSON.parse(jsonData);
  } else {
    data = jsonData;
  }
  if (data.hasOwnProperty("additionalData") && data.additionalData.videoId) {
    let browser = f7.photoBrowser({
      photos: [
        {
          html: `<iframe src="https://www.youtube.com/embed/${data.additionalData.videoId}/?autoplay=1&controls=1&showinfo=0&autohide=1&feature=player_embedded&rel=0" allowfullscreen frameborder="0"></iframe>`
        }
      ],
      theme: 'dark',
      navbarTemplate: `
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="link close-popup photo-browser-close-link">
                        <span>${words.close[LN]}</span>
                    </a>
                </div>
            </div>
        </div>`,
      toolbarTemplate: "<div></div>",
      onOpen: () => $$(".statusbar-overlay").css({ background: "#000" }),
      onClose: () => $$(".statusbar-overlay").css({ background: "#f7f7f8" })
    });
    browser.open();
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

        $$("#blog-content a img").each(function(i, el)  {
          if (/\.(jpe?g|png|gif|bmp)$/i.test($$(el).parent().attr('href'))) {
            $$(el).parent().append('<div class="img-replace" style="background-image: url('+ $$(el).parent().attr('href') +');"></div>')
          } else
          if ($$(el).attr('src')) {
            $$(el).parent().append('<div class="img-replace" style="background-image: url('+ $$(el).attr('src') +');"></div>')
          }
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

module.exports = {
keys: {
    ios: {
      fine_art_tips_en: `a5d1a397-5787-47b0-915c-0da20db82d9d`,
      fine_art_tips_en_free: `af7cc6cf-d3f8-4d5f-9bf9-b93294c52534`,
      arte_devierte_es: `6d443b86-d5e5-4017-8535-3b6143daa7db`,
      arte_devierte_es_free: `54bd4df1-05e7-468e-999c-e02a32b4abd5`,
      test: '84ad11e4-78a0-4f98-a846-b6d74581cbb3',
    }
  },
  google: {
    project_number: {
      fine_art_tips_en: "958298270528",
      fine_art_tips_en_free: "807869208668",
      arte_devierte_es: "187618207125",
      arte_devierte_es_free: "367262442681",
      current: "",
      test: "16084764417",

    },
    server_key: {
      fine_art_tips_en: "AIzaSyBVnXwQg3F33dy4C7TAXz6N2hK03OVP_kI",
      fine_art_tips_en_free: "AIzaSyBj95BLU7Bfvd8rhy352xB3aHd0J9uwxGY",
      arte_devierte_es: "AIzaSyDezp0sZMEOuAoDlSu3BqNybY34zN9NLvo",
      arte_devierte_es_free: "AIzaSyCuj7p9371c-DxLOjGfkSt6wfphgIVU4QA",
      test: "AIzaSyDQWKjtuREQCEWB1WkeoInF77MEbGLuVL8",
    }
  },
  current_key: null,
  init(lang, free) {
    console.log('Push initialization');
    switch (lang) {
      case "en":
        if(free) {
          // this.current_key = this.keys.ios.test;
          // this.google.project_number.current = this.google.project_number.test;
          this.current_key = this.keys.ios.fine_art_tips_en_free;
          this.google.project_number.current = this.google.project_number.fine_art_tips_en_free;
        } else {
          this.current_key = this.keys.ios.fine_art_tips_en;
          this.google.project_number.current = this.google.project_number.fine_art_tips_en;
        }
        break;
      case "es":
        if(free) {
          this.current_key = this.keys.ios.arte_devierte_es_free;
          this.google.project_number.current = this.google.project_number.arte_devierte_es_free;
        } else {
          this.current_key = this.keys.ios.arte_devierte_es;
          this.google.project_number.current = this.google.project_number.arte_devierte_es;
        }
        break;
      default:
        this.current_key = this.keys.ios.arte_devierte_es_free;
        this.google.project_number.current = this.google.project_number.arte_devierte_es_free;
        break;
    }
    const { current_key } = this;
    const projectNumber = this.google.project_number.current;
    console.log(current_key, projectNumber);
    if(window.plugins.OneSignal) {
      //window.plugins.OneSignal.setLogLevel({logLevel: 0, visualLevel: 0});
      window.plugins.OneSignal.init(current_key, {
        googleProjectNumber: projectNumber,
        autoRegister: true
      }, notificationOpenedCallback);
      // Show an alert box if a notification comes in when the user is in your app.
      window.plugins.OneSignal.enableInAppAlertNotification(true);
    } else {
      console.log("Can not find variable OneSignal. Push initialization failed.");
    }
  }
};
