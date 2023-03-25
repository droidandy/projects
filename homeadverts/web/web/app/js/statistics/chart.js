;(function (window, $) {
    'use strict';

    function Charts(className) {
        this.charts = $(className);

        if (!this.charts.length) {
            return;
        }

        this.navItem = this.charts.find('.item');
        this.chartTotalViews = this.charts.find('[data-type=views] .number');
        this.chartTotalImpressions = this.charts.find('[data-type=impressions] .number');
        this.chartTotalLikes = this.charts.find('[data-type=likes] .number');
        this.chartTotalShares = this.charts.find('[data-type=shares] .number');

        this.prevButton = this.charts.find('.show-prev');
        this.nextButton = this.charts.find('.show-next');

        this.statistics = $('.statistics');
        this.statisticsGrid = this.statistics.find('.grid');
        this.statisticsGridItems = this.statisticsGrid.find('tbody tr');
        this.statisticsTitle = this.statistics.find('.stats-title');

        this.chart = null;
        this.chartData = [];
        this.months = [];
        this.currentMonthIndex = -1;
        this.currentType = 'impressions';

        this.bindEvents();
        this.initChart();
    }

    Charts.prototype.bindEvents = function () {
        var _this = this;

        this.statisticsGridItems.on('click', function () {
            _this.getData($(this).attr('data-statistics-get'));
            _this.updateTitle(this);

            _this.statisticsGridItems.removeClass('--active');
            $(this).addClass('--active');

            $("html, body").animate({
                scrollTop: _this.charts.position().top
            }, 500, 'swing');
        });

        this.navItem.on('click', function () {
            var item = $(this);

            _this.currentType = item.attr('data-type');

            if (item.hasClass('--active') === false) {
                _this.navItem.removeClass('--active');
                item.addClass('--active');

                _this.renderChart();
            }
        });

        this.prevButton.on('click', function (e) {
            e.preventDefault();

            if (_this.currentMonthIndex > 0) {
                _this.currentMonthIndex--;
                _this.renderChart();
            }
        });

        this.nextButton.on('click', function (e) {
            e.preventDefault();

            if (_this.currentMonthIndex < _this.months.length - 1) {
                _this.currentMonthIndex++;
                _this.renderChart();
            }
        });
    };

    Charts.prototype.initChart = function () {
        var initialUrl = this.statisticsGrid.attr('data-statistics-get');

        this.chart = AmCharts.makeChart('chart', window.chartSettings);

        if (initialUrl) {
            this.getData(initialUrl);
        }
    };

    Charts.prototype.getData = function (url) {
        if (this.charts.css('display') === 'none') {
            this.statisticsGrid.trigger('chartLoaded');
            return;
        }

        var _this = this;

        $.ajax({
            url: url,
            dataType: "json",
            method: "GET",
            contentType: "application/json",
            success: function (res, status, xhr) {
                _this.resetData();
                _this.aggregateData(res);
                _this.addMissingDays();
                _this.renderChart();
            }
        });
    };

    Charts.prototype.resetData = function () {
        this.months = [];
        this.currentMonthIndex = -1;
    };

    Charts.prototype.aggregateData = function (rawData) {
        var _this = this;
        this.cleanupData();

        rawData.forEach(function (row) {
            var d = new Date(row.date.split('T')[0]);
            var yearMonth = d.getFullYear().toString() + d.getMonth().toString();
            var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());

            _this.chartData.views[yearMonth] = _this.chartData.views[yearMonth] || {data: [], total: 0};
            _this.chartData.impressions[yearMonth] = _this.chartData.impressions[yearMonth] || {data: [], total: 0};
            _this.chartData.likes[yearMonth] = _this.chartData.likes[yearMonth] || {data: [], total: 0};
            _this.chartData.shares[yearMonth] = _this.chartData.shares[yearMonth] || {data: [], total: 0};

            _this.chartData.impressions[yearMonth].data.push({
                "date": date,
                "value": row.impressions
            });
            _this.chartData.views[yearMonth].data.push({
                "date": date,
                "value": row.views
            });
            _this.chartData.likes[yearMonth].data.push({
                "date": date,
                "value": row.likes
            });
            _this.chartData.shares[yearMonth].data.push({
                "date": date,
                "value": row.shares
            });

            _this.chartData.views[yearMonth].total = _this.chartData.views[yearMonth].total + row.views;
            _this.chartData.impressions[yearMonth].total = _this.chartData.impressions[yearMonth].total + row.impressions;
            _this.chartData.likes[yearMonth].total = _this.chartData.likes[yearMonth].total + row.likes;
            _this.chartData.shares[yearMonth].total = _this.chartData.shares[yearMonth].total + row.shares;

            if (_this.months[_this.months.length - 1] !== yearMonth) {
                _this.months.push(yearMonth);
                _this.currentMonthIndex++;
            }
        });
    };

    Charts.prototype.addMissingDays = function () {
        this.chartData.views.forEach(function (month) {
            var d = month.data[0].date;
            var days = new Date(d.getFullYear(), d.getMonth(), 0).getDate();
        })
    };

    Charts.prototype.renderChart = function () {
        var type = this.currentType,
            month = this.months[this.currentMonthIndex];

        if (month) {
            this.chart.dataProvider = this.chartData[type][month].data;
            this.chart.validateData();
            this.chart.animateAgain();

            this.chartTotalImpressions.text(this.chartData.impressions[month].total);
            this.chartTotalViews.text(this.chartData.views[month].total);
            this.chartTotalLikes.text(this.chartData.likes[month].total);
            this.chartTotalShares.text(this.chartData.shares[month].total);
        } else {
            this.chart.dataProvider = [];
            this.chart.validateData();

            this.chartTotalImpressions.text(0);
            this.chartTotalViews.text(0);
            this.chartTotalLikes.text(0);
            this.chartTotalShares.text(0);
        }

        this.updateButtons();
        this.statisticsGrid.trigger('chartLoaded');
    };

    Charts.prototype.updateTitle = function (gridEntry) {
        var $entry = $(gridEntry),
            href = $entry.find('a').attr('href'),
            text = $entry.find('.title').html();

        this.statisticsTitle.find('a')
            .attr('href', href)
            .text(text);
    };

    Charts.prototype.updateButtons = function () {
        var anyPrev = this.currentMonthIndex > 0,
            anyNext = this.currentMonthIndex < this.months.length - 1;

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

    Charts.prototype.cleanupData = function () {
        this.chartData = {
            "views": [],
            "likes": [],
            "shares": [],
            "impressions": []
        };
    };

    $(document).ready(function () {
        new Charts('.charts');
    });

})(window, jQuery);
