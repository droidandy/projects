/**
 * Created by developercomputer on 29.11.15.
 */
//Community guidelines

/*
 Community guidelines

 This app is intended for members to share images of original art that they themselves have created, and to interact with the community.

 Play nice.
 We're a global community of different types of people, who all have the right to feel comfortable. Please be polite and respectful in your interactions with other members.
 Only upload content that you have created.
 Remember that people of different religions and beliefs, as well as minors, use this app. Therefore, please do not upload photos with explicit nudity, or with violence. If you would hesitate to show your photo to a child or to your family, don’t post it here.

 This is your community. Celebrate your creativity, be social, and share your art. Myself and many others would love to see it.
*/

module.exports = function() {
  var app = require("./../../f7init/f7init");
  const LS_KEY = `__isAgreeCommunity${LN}${FREE}?`;
  var isAgree = localStorage.getItem(LS_KEY);
  if(isAgree != null) {
    return false;
  }
  var popupHTML = {
    en: `
      <div class="popup navbar-fixed agree--popup">
        <div class="page white">
          <div class="navbar">
                <div class="navbar-inner">
                    <div class="center">Community guidelines</div>
                </div>
            </div>
            <div class="page-content">
              <div class="content-block">
                <h1>Community guidelines</h1>
                <p>This app is intended for members to share images of original art that they themselves have created, and to interact with the community.</p>
                <p>Play nice.</p>
                <p>We're a global community of different types of people, who all have the right to feel comfortable. Please be polite and respectful in your interactions with other members.</p>
                <p>Only upload content that you have created.</p>
                <p>Remember that people of different religions and beliefs, as well as minors, use this app. Therefore, please do not upload photos with explicit nudity, or with violence. If you would hesitate to show your photo to a child or to your family, don’t post it here.</p>
                <p>This is your community. Celebrate your creativity, be social, and share your art. Myself and many others would love to see it.</p>
                <p class="buttons-row">
                  <a href="#" class="button color-red decline-button close-popup">Leave page</a>
                  <a href="#" class="button color-red agree-button close-popup">I agree</a>
                </p>
              </div>
            </div>
          </div>
      </div>`,
    es: `
        <div class="popup navbar-fixed agree--popup">
        <div class="page white">
          <div class="navbar">
                <div class="navbar-inner">
                    <div class="center">Reglas de la comunidad</div>
                </div>
            </div>
            <div class="page-content">
              <div class="content-block">
                <h1>Reglas de la comunidad</h1>
                <p>Esta App tiene el propósito de que sus miembros compartan imágenes de arte original así como el interactuar con la comunidad.</p>
                <p>Sé cortés.</p>
                <p>Somos una comunidad global con personas de distintas culturas y costumbres, todos tienen el derecho de sentirse a gusto. Por favor sé amable y respetuoso en tus interacciones con otros miembros.</p>
                <p>Sólo sube contenido que tú hayas creado.</p>
                <p>Recuerda que personas de diferentes religiones y creencias, así como menores de edad usan esta app. Por lo tanto, por favor no subas fotos con desnudos explícitos o con violencia. Si dudarías en mostrarle la imagen a un niño o a tu familia, no la subas aquí.</p>
                <p>Esta es tú comunidad. Celebra tu creatividad, interactúa con el grupo y comparte tu arte. A mi y a muchos otros nos encantará verla.</p>
                <p class="buttons-row">
                  <a href="#" class="button color-red decline-button close-popup">Salir de la página</a>
                  <a href="#" class="button color-red agree-button close-popup">Acepto</a>
                </p>
              </div>
            </div>
          </div>
      </div>
    `
  };
  app.f7.hideIndicator();
  app.f7.popup(popupHTML[LN]);
  app.f7.sizeNavbars($$(".agree--popup"));
  $$(".agree-button").on("click", () => {
    localStorage.setItem(LS_KEY, "agree");
  });
  $$(".decline-button").on("click", () => {
    app.mainView.router.back();
  });
};
