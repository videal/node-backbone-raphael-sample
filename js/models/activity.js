/**
 * Activity MODEL
 * @type @exp;Backbone@pro;Model@call;extend
 */
window.Activity = Backbone.Model.extend({
    cid : "time"
});

/**
 * Activity COLLECTION
 * @type @exp;Backbone@pro;Collection@call;extend
 */
window.ActivityCollection = Backbone.Collection.extend({
    model : Activity
});