/**
 * @author Max Plavinskiy
 * @email m.plavinskiy@videal.net
 */

window.server_url = "http://localhost";

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