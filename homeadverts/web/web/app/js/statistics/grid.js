;(function (window, $) {
    'use strict';

    function Grid(className) {
        this.table = $(className);

        if (!this.table.length) {
            return;
        }

        this.paginationWrapper = $('.statistics .grid-pagination');
        this.prevButton = this.paginationWrapper.find('.show-prev');
        this.nextButton = this.paginationWrapper.find('.show-next');

        this.pageLength = 5;
        this.page = 0;
        this.pageCount = Math.ceil( this.getEntries().length / this.pageLength );

        new Tablesort(this.table.get(0), {
            descending: true
        });

        this.initPagination();
        this.bindEvents();
    }

    Grid.prototype.initPagination = function () {
        if (this.pageCount <= 1) {
            this.paginationWrapper.hide();
            return;
        }

        var prevText = this.prevButton.first().text();
        var nextText = this.nextButton.first().text();

        this.prevButton.text(prevText + ' ' + this.pageLength);
        this.nextButton.text(nextText + ' ' + this.pageLength);

        this.updatePaginationButtons();
    };

    Grid.prototype.bindEvents = function () {
        this.table.one('chartLoaded', $.proxy(this, 'loadImages'));
        this.table.on('afterSort', $.proxy(this, 'resetPagination'));
        this.prevButton.on('click', $.proxy(this, 'prevPage'));
        this.nextButton.on('click', $.proxy(this, 'nextPage'));
    };

    Grid.prototype.loadImages = function () {
        this.table
            .find('[data-background-image]')
            .each(function (i, node) {
                node.style.backgroundImage = 'url("' + node.dataset.backgroundImage + '")';
            });
    };

    Grid.prototype.getEntries = function () {
        return this.table.find('tbody tr');
    };

    Grid.prototype.prevPage = function (e) {
        e.preventDefault();

        if (this.page <= 0) {
            return;
        }

        this.page--;
        this.updatePagination();
    };

    Grid.prototype.nextPage = function (e) {
        e.preventDefault();

        if (this.page >= this.pageCount - 1) {
            return;
        }

        this.page++;
        this.updatePagination();
    };

    Grid.prototype.updatePagination = function () {
        var from = this.page * this.pageLength,
            to = from + this.pageLength;

        this.getEntries().hide();
        this.getEntries().slice(from, to).show();
        this.updatePaginationButtons();
    };

    Grid.prototype.updatePaginationButtons = function () {
        var anyPrev = this.page > 0,
            anyNext = this.page < this.pageCount - 1;

        if (anyPrev) {
            this.prevButton.addClass('--active');
        } else {
            this.prevButton.removeClass('--active');
        }

        if (anyNext) {
            this.nextButton.addClass('--active');
        } else {
            this.nextButton.removeClass('--active');
        }
    };

    Grid.prototype.resetPagination = function () {
        this.page = 0;
        this.updatePagination();
        this.updatePaginationButtons();
    };

    $(document).ready(function () {
        new Grid('.statistics .grid');
    });

})(window, jQuery);
