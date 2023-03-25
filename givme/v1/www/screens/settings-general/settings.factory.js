'use strict';

function SettingsContact($http, $q) {
  return {
    getFromJSON: function(params) {
      //return $http
      //  .get('/chart-html/sample-api.json');
      var deferred = $q.defer();
      var query_string = "";
      var query_list = [];
      var url = 'http://52.19.92.65/api/profile/contact/';
      $http
        .get(url)
        .then(function(result) {
          var contact = result.data;
          deferred.resolve({
            'contact': contact
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    update: function(data) {
      var deferred = $q.defer();
      $http.post('http://52.19.92.65/api/profile/contact/', {
        data: data
      })
        .then(function(response) {
          var contact = result.data;
          deferred.resolve({
            'contact': contact
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
}

function SettingsDiscovery($http, $q) {
  return {
    getFromJSON: function(params) {
      //return $http
      //  .get('/chart-html/sample-api.json');
      var deferred = $q.defer();
      var query_string = "";
      var query_list = [];
      var url = 'http://52.19.92.65/api/profile/discovery/';
      $http
        .get(url)
        .then(function(result) {
          var discovery = result.data;
          deferred.resolve({
            'discovery': discovery
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    update: function(data) {
      var deferred = $q.defer();
      $http.post('http://52.19.92.65/api/profile/discovery/', {
        data: data
      })
        .then(function(response) {
          var discovery = response.data;
          deferred.resolve({
            'discovery': discovery
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
}

function SettingsTags($http, $q) {
  return {
    getFromJSON: function(params) {
      //return $http
      //  .get('/chart-html/sample-api.json');
      var deferred = $q.defer();
      var query_string = "";
      var query_list = [];
      var url = 'http://52.19.92.65/api/profile/tags/';
      $http
        .get(url)
        .then(function(result) {
          var tags = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              tags.push({"text":result.data[i].tag,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'tags': tags
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    update: function(data) {
      var deferred = $q.defer();
      $http.post('http://52.19.92.65/api/profile/tags/', {
        data: data
      })
        .then(function(result) {
          var tags = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              tags.push({"text":result.data[i].tag,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'tags': tags
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    delete: function(id) {
      var deferred = $q.defer();
      $http.delete('http://52.19.92.65/api/profile/tags/' + id)
        .then(function(result) {
          var tags = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              tags.push({"text":result.data[i].tag,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'tags': tags
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
}

function SettingsLanguages($http, $q) {
  return {
    getFromJSON: function(params) {
      //return $http
      //  .get('/chart-html/sample-api.json');
      var deferred = $q.defer();
      var query_string = "";
      var query_list = [];
      var url = 'http://52.19.92.65/api/profile/languages/';
      $http
        .get(url)
        .then(function(result) {
          var languages = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              languages.push({"text":result.data[i].language,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'languages': languages
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    update: function(data) {
      var deferred = $q.defer();
      $http.post('http://52.19.92.65/api/profile/languages/', {
        data: data
      })
        .then(function(result) {
          var languages = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              languages.push({"text":result.data[i].language,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'languages': languages
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    delete: function(id) {
      var deferred = $q.defer();
      $http.delete('http://52.19.92.65/api/profile/languages/' + id)
        .then(function(result) {
          var languages = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              languages.push({"text":result.data[i].language,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'languages': languages
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
}

function SettingsPictures($http, $q) {
  return {
    getFromJSON: function(params) {
      //return $http
      //  .get('/chart-html/sample-api.json');
      var deferred = $q.defer();
      var query_string = "";
      var query_list = [];
      var url = 'http://52.19.92.65/api/profile/pictures/';
      $http
        .get(url)
        .then(function(result) {
          var pictures = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              pictures.push({"src": "http://52.19.92.65" + result.data[i].picture_100,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'pictures': pictures
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    update: function(formData) {
      var deferred = $q.defer();
      $http.post('http://52.19.92.65/api/profile/pictures/', formData, {
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
      })
        .then(function(result) {
          var pictures = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              pictures.push({"src": "http://52.19.92.65" + result.data[i].picture_100,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'pictures': pictures
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    delete: function(id) {
      var deferred = $q.defer();
      $http.delete('http://52.19.92.65/api/profile/pictures/' + id)
        .then(function(result) {
          var pictures = [];
          if (result.data && result.data.length) {
            for (var i in result.data) {
              pictures.push({"src": "http://52.19.92.65" + result.data[i].picture_100,"id":result.data[i].id});
            }
          }
          deferred.resolve({
            'pictures': pictures
          });
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
}

function Profile ($http, $q, GmAPI, gmAPIServerIP) {
  return {
    profile: null,
    load: function() {
      var _this = this;
      var defaultProfile = {
        "gender": "m",
        "age": 30,
        "first_name": "Ollie",
        "last_name": "Bolland",
        "tags": ["Ice Cream"],
        "languages": ["English","French"],
        "preferences": {
          "gender": "f",
          "min_age": 25,
          "max_age": 40,
          "radius": 40,
        },
        "contacts": {
          "phone_number":"07894563899",
          "address":"London",
          "snapchat":"olligopoly",
          "twitter":"olligopoly",
          "facebook":"obolland",
          "instagram":"obolland",
          "whatsapp":"07894563899",
          "email":"obolland@gmail.com"
        }
      }

      if(this.profile) {
        var deferred = $q.defer();
        deferred.resolve(_this.profile);
        return deferred.promise;
      }

      return $q.all([
        // $http.get('http://' + gmAPIServerIP + '/api/users/me', {
        //   headers: {
        //     'Authorization': 'Token ' + GmAPI.apiKey
        //   }
        // }),
        // $http.get('http://' + gmAPIServerIP + '/api/users/preferences/', {
        //   headers: {
        //     'Authorization': 'Token ' + GmAPI.apiKey
        //   }
        // }),
        // $http.get('http://' + gmAPIServerIP + '/api-rest/profile/contact/', {
        //   headers: {
        //     'Authorization': 'Token ' + GmAPI.apiKey
        //   }
        // }),
        // $http.get('http://' + gmAPIServerIP + '/api-rest/profile/pictures/', {
        //  headers: {
        //    'Authorization': 'Token ' + GmAPI.apiKey
        //  }
        // })
      ])
      .then(function(responses) {
          if (responses && responses[0]) {
            var me = responses[0].data;
            me.preferences = responses[1].data;
            me.contacts = responses[2].data;
            //me.pictures = responses[3].data;
          } else {
            var me = {};
            me.preferences = {};
            me.contacts = {};
            //me.pictures = responses[3].data;
          }

          _this.userId = me.id;

          _this.profile = {
            userId: me.id,
            email: me.email ? me.email:defaultProfile["contacts"]["email"],
            first_name: me.first_name ? me.first_name:defaultProfile["first_name"],
            last_name: me.last_name ? me.last_name:defaultProfile["last_name"],
            gender: me.gender ? me.gender:defaultProfile["gender"],
            age: me.age ? me.age:defaultProfile["age"],
            tags: me.tags ? me.tags : [],
            languages: me.languages ? me.languages : [],
            photos: me.photos,
            radius: (me.preferences && me.preferences.radius) ? me.preferences.radius : defaultProfile["preferences"]["radius"],
            preferences: (me.preferences && me.preferences.min_age) ? me.preferences : defaultProfile["preferences"],
            contacts: (me.contacts && me.contacts.phone_number) ? me.contacts : defaultProfile["contacts"]
          };
          console.log(me, _this.profile);
          return _this.profile;
      })
        .catch(function(err) {
          return err;
        })
    },
    save: function(profile) {
      var _this = this;
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
            //languages: JSON.stringify(profile.languages),
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
    saveContacts: function(contacts) {
      return $http({
        method: 'POST',
        url: 'http://' + gmAPIServerIP + '/api-rest/profile/contact/',
        data: contacts,
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
    }
  }
}

angular.module('givmeApp.services')
  .factory('Profile', Profile);

angular.module('givmeApp.services')
  .factory('SettingsContact', ['$http', '$q', SettingsContact]);

angular.module('givmeApp.services')
  .factory('SettingsDiscovery', ['$http', '$q', SettingsDiscovery]);

angular.module('givmeApp.services')
  .factory('SettingsTags', ['$http', '$q', SettingsTags]);

angular.module('givmeApp.services')
  .factory('SettingsLanguages', ['$http', '$q', SettingsLanguages]);

angular.module('givmeApp.services')
  .factory('SettingsPictures', ['$http', '$q', SettingsPictures]);
