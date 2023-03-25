var app = require('../f7init/f7init');

document.addEventListener("offline", function () {
  hasConnection();
});

document.addEventListener("online", function () {
  hasConnection();
});
function showOverlay() {
  if (localStorage.getItem('offline-mode') == "0") {
    var offlineMode = store.get('offline.mode');
    if (offlineMode && !offlineMode.owned) {
      localStorage.setItem('remind-offline', "1");
      Dom7('#offline').show();
    }
  }
}

function hideOverlay() {
  Dom7('#offline').hide();
  var offlineMode = store.get('offline.mode');
  if (!offlineMode.owned && +localStorage.getItem('remind-offline')) {
    localStorage.setItem('remind-offline', "0");
    setTimeout(function () {
      app.f7.confirm('You are now online. Would you like to purchase Offline Mode now?', 'Offline mode', function () {
        store.order('offline.mode');
      });
    }, 3000);
  }
}

function hasConnection() {
  Dom7.ajax({
    url: 'http://www.google.com',
    crossDomain: true,
    contentType: 'text/plain',
    success: function (data, status, xhr) {
      console.log('connection success', status );
      hideOverlay();
    },
    error: function (xhr, status) {
      console.log('connection error', status);
      localStorage.setItem('remind-offline', "1");
      showOverlay();
      setTimeout(hasConnection, 3000);
    }
  });
}

 module.exports = {hasConnection, showOverlay, hideOverlay};
