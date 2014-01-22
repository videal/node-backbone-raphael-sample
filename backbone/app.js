server = "http://localhost:8888";

;(function($) {
    /**
     * FORECAST CHART VIEW
     * @type @exp;Backbone@pro;View@call;extend
     */
    var ForecastChartView = Backbone.View.extend({
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
            chart.chart_el = 'forecast_chart';
                
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
    
    /**
     * ACTIVITY CHART VIEW
     * @type @exp;Backbone@pro;View@call;extend
     */
    var ActivityChartView = Backbone.View.extend({
        el : '#chart_statistics_view',
        
        initialize : function() {
            this.collection = new ActivityCollection();
            this.collection.bind('reset', this.render);
            this.render();
            
            var socket,
                self = this;
            
            if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
                socket = io.connect('http://localhost:8000', {'transports': ['xhr-polling']});
            } else {
                socket = io.connect('http://localhost:8000');
            }

            socket.on('message', function (resp) {
              var activityData = JSON.parse(resp.data);
              
              // TODO check merging.
              self.collection.models = new Array();
              
              for (var i in activityData) {
                  self.collection.add(activityData[i], {merge: true});
              }

              self.collection.trigger('reset');
            });
        },
 
        render:function() {
            $('#statistics_chart').empty();
            
            var chart = new ChartView();
            chart.chart_el = 'statistics_chart';
            
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
    
    
    /**
     * Forecast MODEL
     * @type @exp;Backbone@pro;Model@call;extend
     */
    var Forecast = Backbone.Model.extend({
        cid : "dt"
    });
    
    /**
     * Activity MODEL
     * @type @exp;Backbone@pro;Model@call;extend
     */
    var Activity = Backbone.Model.extend({
        cid : "time"
    });
    
    var ChartView = Backbone.View.extend({
        chart_el : '',
        xdata : [0],
        ydata : [0],
        xLabel : "",
        yLabel : "",
        
        getXData : function() {
            return this.xdata;
        },
        
        getYData : function() {
            return this.ydata;
        },
        render: function() {
            // Render chart
            var r = Raphael(this.chart_el),
                x = 50,
                y = 10,
                w = 750,
                h = 300;
            
            var xdata = this.getXData();
            var ydata = this.getYData();
            
            r.drawGrid(x + 10 , y + 10, w - x + 30, h - y - 10, 20, 5, "#ddd");
            
            var lines = r.linechart(x, y, w, h,
                xdata, // => x
                ydata, // => y,
                {
                    nostroke: false,   // lines between points are drawn
                    axis: "0 0 1 1",   // draw axes on the left and bottom
                    symbol: "circle",    // use a filled circle as the point symbol
                    smooth: false,      // curve the lines to smooth turns on the chart
                    dash: "-",         // draw the lines dashed
                    shade: true,
                    axisxstep : 5
                }
            ).hoverColumn(function () {
                this.tags = r.set();

                for (var i = 0, ii = this.y.length; i < ii; i++) {
                    this.tags.push(r.flag(this.x, this.y[i], this.values[i], 0).insertBefore(this).attr([{ fill: this.symbols[i].attr("fill") }, { fill: "#fff" }]));
                }
            }, function () {
                this.tags && this.tags.remove();
            });
            
            lines.attr({stroke:"#ccc"});
            
            r.text(w/2, h + 30, this.xLabel).attr({'font-size': '17px'});
            r.text(10, h/2, this.yLabel).attr({'font-size': '17px'}).rotate(270);
            
            // Transform unixtime values to dates.
            $.each(lines.axis[0].text.items , function ( index, label ) {
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    date = new Date(parseInt(label.attr("text")) * 1000),
                    day = date.getDate(),
                    month = months[date.getMonth()];
                
                var minutes = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
                var hours   = (date.getHours()   < 10 ? "0" + date.getHours()   : date.getHours());
                
                var dateText = month + " " + day + ", " + hours + ":" + minutes;
                
                label.attr({'text': dateText});
            });
        }
    });
    
    /**
     * Forecast COLLECTION
     * @type @exp;Backbone@pro;Collection@call;extend
     */
    var ForecastCollection = Backbone.Collection.extend({
        url : server + '/get-forecast-data',
        model : Forecast
    });
    
    /**
     * Activity COLLECTION
     * @type @exp;Backbone@pro;Collection@call;extend
     */
    var ActivityCollection = Backbone.Collection.extend({
        model : Activity
    });
    
    new ForecastChartView();
    new ActivityChartView();
})(jQuery);