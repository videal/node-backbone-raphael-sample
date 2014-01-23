window.ChartView = Backbone.View.extend({
    el : null,
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
        var r = Raphael(this.el),
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