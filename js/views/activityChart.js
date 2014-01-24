/**
 * ACTIVITY CHART VIEW
 * @type @exp;Backbone@pro;View@call;extend
 */
window.ActivityChartView = Backbone.View.extend({
    el : '#chart_statistics_view',

    initialize : function() {
        this.collection = new ActivityCollection();
        this.collection.bind('reset', this.render);
        this.render();

        var socket,
            self = this;

        if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
            socket = io.connect(window.server_url + ":8000", {'transports': ['xhr-polling']});
        } else {
            socket = io.connect(window.server_url + ":8000");
        }

        socket.on('message', function (resp) {
          self.collection.reset(JSON.parse(resp.data));
        });
    },

    render:function() {
        $('#statistics_chart').empty();

        var chart = new ChartView();
        chart.el = 'statistics_chart';

        if (this.models && this.models.length > 0) {
            chart.xdata = [];
            chart.ydata = [];

            $.each(this.models, function(i, model) {
                chart.xdata.push(model.attributes.time);
                chart.ydata.push(model.attributes.value);
            });
        }
        chart.xLabel = 'Time';
        chart.yLabel = 'Quantity';

        chart.render();
    },
});