/**
 * Forecast MODEL
 * @type @exp;Backbone@pro;Model@call;extend
 */
window.Forecast = Backbone.Model.extend({
    cid : "dt"
});

/**
 * Forecast COLLECTION
 * @type @exp;Backbone@pro;Collection@call;extend
 */
window.ForecastCollection = Backbone.Collection.extend({
    url   : null,
    model : Forecast,
    initialize: function() {
        this.url = window.server_url + ":8888/get-forecast-data";
    }
});