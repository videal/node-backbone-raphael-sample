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
    url   : 'http://10.0.1.23:8888/get-forecast-data',
    model : Forecast
});