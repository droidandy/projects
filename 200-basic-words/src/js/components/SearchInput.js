var React = require('react');
var app = require('../f7init/f7init');

var SearchInput = React.createClass({

  componentDidMount: function() {
    var self = this;
    var renderTargets = ['.main-searchbar', '.favorites-searchbar'];
    Dom7.each(renderTargets, function (idx, target) {
      self.renderInput(target);
    });
  },

  renderInput: function (target) {
    var Searchbar = app.f7.searchbar(target, {
      searchList: '.list-block-search',
      searchIn: '.searched-lang',
      customSearch: true,
      onSearch: function (e) {
        var val = e.value;
        if (!val) {
          Dom7('.page-content').scrollTop(0, 200);
          return;
        }
        var searchElemsArr = Dom7('.searched-lang');
        var searchbarHeight = Dom7('.main-searchbar').height();
        var navbarHeight = Dom7('.navbar').height();
        for (var i =0; i< searchElemsArr.length; i++){
          var elem = searchElemsArr[i];
          if(Dom7(elem).html().toLowerCase().indexOf(val.toLowerCase()) > -1){
              var offsetTop = Dom7(elem).parent().parent().offset().top;
              if (!Dom7(elem).hasClass('lang-from')) offsetTop = Dom7(elem)
                  .parent()
                  .parent()
                  .parent()
                  .parent().offset().top;
              var scrollPosition = Dom7('.page-content').scrollTop() + offsetTop - searchbarHeight - navbarHeight;
              if (scrollPosition !== Dom7('.page-content').scrollTop()) {
                Dom7('.page-content').scrollTop(scrollPosition, 200);
              }
              break;
            }
        }
      }
    });
  },

  render: function(){
      return(
          <div className="searchbar-input">
            <input className="search-input-black-placeholder" type="search" placeholder="Search"/>
          </div>
      );
  }

});

module.exports = SearchInput;
