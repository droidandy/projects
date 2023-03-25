'use strict';

// function SettingsContact($http, $q) {
//   return {
//     getFromJSON: function(params) {
//       //return $http
//       //  .get('/chart-html/sample-api.json');
//       var deferred = $q.defer();
//       var query_string = "";
//       var query_list = [];
//       var url = 'http://52.19.92.65/api/profile/contact/';
//       $http
//         .get(url)
//         .then(function(result) {
//           var contact = result.data;
//           deferred.resolve({
//             'contact': contact
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     update: function(data) {
//       var deferred = $q.defer();
//       $http.post('http://52.19.92.65/api/profile/contact/', {
//         data: data
//       })
//         .then(function(response) {
//           var contact = result.data;
//           deferred.resolve({
//             'contact': contact
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     }
//   }
// }

// function SettingsDiscovery($http, $q) {
//   return {
//     getFromJSON: function(params) {
//       //return $http
//       //  .get('/chart-html/sample-api.json');
//       var deferred = $q.defer();
//       var query_string = "";
//       var query_list = [];
//       var url = 'http://52.19.92.65/api/profile/discovery/';
//       $http
//         .get(url)
//         .then(function(result) {
//           var discovery = result.data;
//           deferred.resolve({
//             'discovery': discovery
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     update: function(data) {
//       var deferred = $q.defer();
//       $http.post('http://52.19.92.65/api/profile/discovery/', {
//         data: data
//       })
//         .then(function(response) {
//           var discovery = response.data;
//           deferred.resolve({
//             'discovery': discovery
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     }
//   }
// }

// function SettingsTags($http, $q) {
//   return {
//     getFromJSON: function(params) {
//       //return $http
//       //  .get('/chart-html/sample-api.json');
//       var deferred = $q.defer();
//       var query_string = "";
//       var query_list = [];
//       var url = 'http://52.19.92.65/api/profile/tags/';
//       $http
//         .get(url)
//         .then(function(result) {
//           var tags = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               tags.push({"text":result.data[i].tag,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'tags': tags
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     update: function(data) {
//       var deferred = $q.defer();
//       $http.post('http://52.19.92.65/api/profile/tags/', {
//         data: data
//       })
//         .then(function(result) {
//           var tags = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               tags.push({"text":result.data[i].tag,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'tags': tags
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     delete: function(id) {
//       var deferred = $q.defer();
//       $http.delete('http://52.19.92.65/api/profile/tags/' + id)
//         .then(function(result) {
//           var tags = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               tags.push({"text":result.data[i].tag,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'tags': tags
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     }
//   }
// }

// function SettingsLanguages($http, $q) {
//   return {
//     getFromJSON: function(params) {
//       //return $http
//       //  .get('/chart-html/sample-api.json');
//       var deferred = $q.defer();
//       var query_string = "";
//       var query_list = [];
//       var url = 'http://52.19.92.65/api/profile/languages/';
//       $http
//         .get(url)
//         .then(function(result) {
//           var languages = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               languages.push({"text":result.data[i].language,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'languages': languages
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     update: function(data) {
//       var deferred = $q.defer();
//       $http.post('http://52.19.92.65/api/profile/languages/', {
//         data: data
//       })
//         .then(function(result) {
//           var languages = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               languages.push({"text":result.data[i].language,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'languages': languages
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     delete: function(id) {
//       var deferred = $q.defer();
//       $http.delete('http://52.19.92.65/api/profile/languages/' + id)
//         .then(function(result) {
//           var languages = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               languages.push({"text":result.data[i].language,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'languages': languages
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     }
//   }
// }

// function SettingsPictures($http, $q) {
//   return {
//     getFromJSON: function(params) {
//       //return $http
//       //  .get('/chart-html/sample-api.json');
//       var deferred = $q.defer();
//       var query_string = "";
//       var query_list = [];
//       var url = 'http://52.19.92.65/api/profile/pictures/';
//       $http
//         .get(url)
//         .then(function(result) {
//           var pictures = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               pictures.push({"src": "http://52.19.92.65" + result.data[i].picture_100,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'pictures': pictures
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     update: function(formData) {
//       var deferred = $q.defer();
//       $http.post('http://52.19.92.65/api/profile/pictures/', formData, {
//         headers: {'Content-Type': undefined },
//         transformRequest: angular.identity
//       })
//         .then(function(result) {
//           var pictures = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               pictures.push({"src": "http://52.19.92.65" + result.data[i].picture_100,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'pictures': pictures
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     },
//     delete: function(id) {
//       var deferred = $q.defer();
//       $http.delete('http://52.19.92.65/api/profile/pictures/' + id)
//         .then(function(result) {
//           var pictures = [];
//           if (result.data && result.data.length) {
//             for (var i in result.data) {
//               pictures.push({"src": "http://52.19.92.65" + result.data[i].picture_100,"id":result.data[i].id});
//             }
//           }
//           deferred.resolve({
//             'pictures': pictures
//           });
//         })
//         .catch(function(err) {
//           deferred.reject(err);
//         });
//       return deferred.promise;
//     }
//   }
// }

function Profile($http, $q, $window, $state, $rootScope, GmAPI, gmAPIServerIP) {
  return {
    profile: null,
    load: function() {
      var _this = this;

      if(this.profile) {
        var deferred = $q.defer();
        deferred.resolve(this.profile);
        return deferred.promise;
      }

      return $q.all([
        $http.get('http://' + gmAPIServerIP + '/api/users/me/', {
          headers: {
            'Authorization': 'Token ' + GmAPI.apiKey
          }
        }),
      ])
      .then(function(responses) {
        return _this.setProfile(responses);
      })
        .catch(function(err) {
          $state.go("login");
        })
    },
    setProfile: function(data) {
      var _this = this;
      var me = data[0].data.user;
        me.preferences = data[0].data.user.preferences;
        me.contacts = data[0].data.contacts;
        me.pictures = data[0].data.user.photos;
        me.pockets = data[0].data.pockets;
        me.pokes = data[0].data.pokes;

        _this.userId = me.id;

        _this.profile = {
          userId: me.id,
          email: me.email,
          first_name: me.first_name,
          last_name: me.last_name,
          gender: me.gender,
          age: me.age,
          height: me.height,
          tags: me.tags,
          languages: me.languages,
          radius: me.preferences,
          photos: _this.getAbsolutePhotosFromData(me.pictures),
          preferences: me.preferences,
          contacts: me.contacts,
          pockets: me.pockets,
          pokes: me.pokes,
        };
        
        $window.localStorage["givme_profile"] = JSON.stringify(_this.profile);

        return _this.profile;
    },
    reload: function() {
      this.profile = undefined;
      return this.load();
    },
    getOrRedirect: function() {
      var deferred = $q.defer();
      if (!GmAPI.apiKey) {
        deferred.reject("error");
        $state.go("login");
        return deferred.promise;
      }
      if (!this.profile) {
        if (!$window.localStorage["givme_profile"]) {
          $state.go("login");
          deferred.reject("error");
          return deferred.promise;
        } else {
          this.profile = JSON.parse($window.localStorage["givme_profile"]);
        }
      }
      deferred.resolve(this.profile);
      return deferred.promise;
    },
    reloadGetOrRedirect: function() {
      // as above, but tries to reload the data as well
      var deferred = $q.defer();
      if (!GmAPI.apiKey) {
        deferred.reject("error");
        $state.go("login");
        return deferred.promise;
      }
      var _this = this;

      return $q.all([
        $http.get('http://' + gmAPIServerIP + '/api/users/me/', {
          headers: {
            'Authorization': 'Token ' + GmAPI.apiKey
          }
        }),
      ])
      .then(function(responses) {
        return _this.setProfile(responses);
      })
        .catch(function(err) {
          if (!_this.profile) {
            if (!$window.localStorage["givme_profile"]) {
              $state.go("login");
              return false;
            } else {
              _this.profile = JSON.parse($window.localStorage["givme_profile"]);
              return _this.profile
            }
          }
        })
    },
    save: function(profile) {
      var _this = this;
      $window.localStorage["givme_profile"] = JSON.stringify(_this.profile);
      return $q.all([
        $http({
          method: 'PATCH',
          url: 'http://' + gmAPIServerIP + '/api/users/' + _this.userId + '/',
          headers: {
            'Authorization': 'Token ' + GmAPI.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            gender: profile.gender,
            first_name: profile.first_name,
            last_name: profile.last_name,
            languages: JSON.stringify(profile.languages),
            tags: JSON.stringify(profile.tags),
            age: profile.age
          })
        }),
        $http({
          method: 'PUT',
          url: 'http://' + gmAPIServerIP + '/api/users/preferences/',
          headers: {
            'Authorization': 'Token ' + GmAPI.apiKey
          },
          data: {
            gender: profile.preferences.gender,
            min_age: profile.preferences.min_age,
            max_age: profile.preferences.max_age
          }
        })
      ])
        .then(function(responses) {
          return responses;
        })
        .catch(function(err) {
          return err;
        })
    },
    saveLocally: function(profile) {
      this.profile = profile;
      $window.localStorage["givme_profile"] = JSON.stringify(this.profile);
    },
    saveProfile: function(profile) {
      this.saveLocally(profile);
      return $http({
        method: 'POST',
        url: 'http://' + gmAPIServerIP + '/api-rest/profile/',
        data: {
            languages: JSON.stringify(profile.languages),
            tags: JSON.stringify(profile.tags),
            height: profile.height
          },
        headers: {
          'Authorization': 'Token ' + GmAPI.apiKey
        }
      })
        .then(function(response) {
          return response.data;
        })
        .catch(function(err) {
          return err;
        });
    },
    saveDiscovery: function(discovery) {
      var _this = this;
      return $http({
        method: 'POST',
        url: 'http://' + gmAPIServerIP + '/api-rest/profile/discovery/',
        data: discovery,
        headers: {
          'Authorization': 'Token ' + GmAPI.apiKey
        }
      })
        .then(function(response) {
          _this.profile.preferences = discovery;
          $window.localStorage["givme_profile"] = JSON.stringify(_this.profile);
          return response.data;
        })
        .catch(function(err) {
          return err;
        });
    },
    getAbsolutePhotosFromData : function(photos) {
      var newList = [];
      $.each(photos, function(index, value) {
        if (value.image.indexOf("http") < 0) {
          value.image = "http://" + gmAPIServerIP + value.image;
        }
        if (value.thumbnail.indexOf("http") < 0) {
          value.thumbnail = "http://" + gmAPIServerIP + value.thumbnail;
        }
        newList.push(value);
      });
      return newList;
    },
    savePhoto: function(formData) {
      var deferred = $q.defer();
      var _this = this;
      $http.post('http://' + gmAPIServerIP + '/api-rest/profile/pictures/', formData, {
        headers: {
            'Content-Type': undefined,
            'Authorization': 'Token ' + GmAPI.apiKey
          },
        transformRequest: angular.identity
      })
        .then(function(response) {
          var photos = _this.getAbsolutePhotosFromData(response.data);
          _this.profile.photos = photos;
          $window.localStorage["givme_profile"] = JSON.stringify(_this.profile);
          return deferred.resolve({
            "photos": _this.profile.photos
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
        return deferred.promise;
    },
    deletePhoto: function(id) {
      var deferred = $q.defer();
      var _this = this;
      $http.delete('http://' + gmAPIServerIP + '/api-rest/profile/pictures/' + id, {
        headers: {
            'Authorization': 'Token ' + GmAPI.apiKey
          }
      })
        .then(function(response) {
          var photos = _this.getAbsolutePhotosFromData(response.data);
          _this.profile.photos = photos;
          $window.localStorage["givme_profile"] = JSON.stringify(_this.profile);
          return deferred.resolve({
            "photos": _this.profile.photos
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
        return deferred.promise;
    },
    saveContact: function(contacts) {
      var _this = this;
      return $http({
        method: 'POST',
        url: 'http://' + gmAPIServerIP + '/api-rest/profile/contact/',
        data: contacts,
        headers: {
          'Authorization': 'Token ' + GmAPI.apiKey
        }
      })
        .then(function(response) {
          _this.profile.contacts = response.data;
          $window.localStorage["givme_profile"] = JSON.stringify(_this.profile);
          return response.data;
        })
        .catch(function(err) {
          deferred.reject(err);
        });
    },
    empty: function() {
      this.profile = undefined;
      $window.localStorage.removeItem("givme_profile");
      $window.localStorage.removeItem("givme_apikey");
    }
  }
}

angular.module('givmeApp.services')
  .factory('Profile', Profile);

// angular.module('givmeApp.services')
//   .factory('SettingsContact', ['$http', '$q', SettingsContact]);

// angular.module('givmeApp.services')
//   .factory('SettingsDiscovery', ['$http', '$q', SettingsDiscovery]);

// angular.module('givmeApp.services')
//   .factory('SettingsTags', ['$http', '$q', SettingsTags]);

// angular.module('givmeApp.services')
//   .factory('SettingsLanguages', ['$http', '$q', SettingsLanguages]);

// angular.module('givmeApp.services')
//   .factory('SettingsPictures', ['$http', '$q', SettingsPictures]);
