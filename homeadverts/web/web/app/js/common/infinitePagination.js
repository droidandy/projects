;(function (window, $) {
	"use strict";

	function InfinitePagination(className) {
		this.className = className;
		this.collection = $(className);

		if (!this.collection.length) {
			return;
		}

		this.bindEvents();
	}

	InfinitePagination.prototype.bindEvents = function () {
		this.collection.lazyloader({
			'pages': this.collection.attr('data-page-total'), //total number of pages
			'page': this.collection.attr('data-page-current'), // starting page
			'selector': this.className+' > li',
			'url': window.location.pathname + '?p={page}'
		});

		window.addEventListener('paginationUpdated', function () {
			componentHandler.upgradeDom();
            $(document).trigger('video-events-update');
		}, false);
	};

	$(document).ready(function () {
		new InfinitePagination('.list[data-page-total]');
	});

})(window, jQuery);
