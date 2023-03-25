jQuery(function($) {
  setTimeout(function(){
    var $bodyEl = $('body'),
        $sidedrawerEl = $('#sidedrawer');


    function showSidedrawer() {
      // show overlay
      var options = {
        onclose: function() {
          $sidedrawerEl
              .removeClass('active')
              .appendTo(document.body);
        }
      };

      var $overlayEl = $(mui.overlay('on', options));

      // show element
      $sidedrawerEl.appendTo($overlayEl);
      setTimeout(function() {
        $sidedrawerEl.addClass('active');
      }, 20);
    }


    function hideSidedrawer() {
      $bodyEl.toggleClass('hide-sidedrawer');
    }
    function oncloseOwerlay() {
      $( "#mui-overlay" ).trigger( "click" );
    }
    $('.oncloseOwerlay').on('click', oncloseOwerlay);
    $('.js-show-sidedrawer').on('click', showSidedrawer);
    $('.js-hide-sidedrawer').on('click', hideSidedrawer);

    var $titleEls = $('strong', $sidedrawerEl);

    $titleEls
        .next()
        .hide();

    $titleEls.on('click', function() {
      $(this).next().slideToggle(200);
    });
    $('#nav-icon4').click(function(){
      $(this).toggleClass('open');
    });
  },1000);


});
