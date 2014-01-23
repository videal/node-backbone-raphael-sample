window.server_url = "http://10.0.1.23:8888";

window.Router = Backbone.Router.extend({
    routes: {
        "": "home"
    },

    home: function () {
        new ForecastChartView();
        new ActivityChartView();
    }
});

(function($) {
    app = new Router();
    Backbone.history.start();
})(jQuery);