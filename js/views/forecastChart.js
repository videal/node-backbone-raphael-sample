/**
 * FORECAST CHART VIEW
 * @type @exp;Backbone@pro;View@call;extend
 */
window.ForecastChartView = Backbone.View.extend({
    el : '#chart_forecast_view',

    events : {
        'click #statistics_show' : 'showForecast'
    },

    initialize : function() {
        this.collection = new ForecastCollection();
        this.render();
    },

    render:function() {
        var chart = new ChartView();
        chart.el = 'forecast_chart';

        if (this.collection.models.length > 0) {
            chart.ydata = [];
            chart.xdata = [];

            $.each(this.collection.models, function(i, model) {
                chart.ydata.push(Math.round(model.attributes.main.temp - 272));
                chart.xdata.push(model.attributes.dt);
            });
        }
        chart.xLabel = 'Time';
        chart.yLabel = 'Degrees, C';

        chart.render();
    },

    showForecast:function() {
        this.city = $('#location').val();
        this.loadStatistics();
    },

    loadStatistics: function() {
        var self = this;
        this.collection.fetch({
            success : function() {
                $('#forecast_chart').empty();
                self.render();
            },
            data: { city : self.city}
        });
    }
});