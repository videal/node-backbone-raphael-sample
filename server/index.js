var http = require("http");
var url  = require('url');
var io   = require('socket.io').listen(8000);

io.set('log level', 1);

http.createServer(function(request, response) {
  var res = null;
  var url_parts = url.parse(request.url, true);
  
  if (url_parts.pathname === "/get-forecast-data") {
    var options = {
      host: 'api.openweathermap.org',
      path: '/data/2.5/forecast?q=' + url_parts.query.city  + '&mode=json'
    };

    http.get(options, function(resp) {
      var str;
      resp.on('data', function(chunk) {
          str += chunk;
      });

      resp.on('end', function () {
        var data = JSON.parse(str.replace(/undefined/, ""));
        
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.writeHead(200, {"Content-Type": "application/json"});

        response.end(JSON.stringify(data.list));
      });

    }).on("error", function(e){
      console.log("Got error: " + e.message);
    });
  }

}).listen(8888);

StatisticsActivity = {
    data   : []
};

function loadStatistics () {
    var options = {
        host : "www.mamba.ru"
    }
    
    http.get(options, function(resp) {
      var str;
      resp.on('data', function(chunk) {
          str += chunk;
      });

      resp.on('end', function () {
        var time = Math.round(new Date().getTime() / 1000);
        // Process data
        var regexp = new RegExp('<b>([0-9 ]{1,})</b>');
        var quantity = parseInt(regexp.exec(str)[1].replace(" ", ""));
        
        quantity = Math.round(Math.random() * ((quantity + 100) - (quantity - 100)) + (quantity - 100));
        
        StatisticsActivity.data.push({
            'time'  : time,
            'value' : quantity
        });
        
        if (StatisticsActivity.data.length > 20)  {
            StatisticsActivity.data.shift();
        };
      });
    });
}

//setInterval(loadStatistics, 300000);
setInterval(loadStatistics, 3000);

io.sockets.on('connection', function (socket) {
    setInterval(function() {
        socket.json.send({'event': 'activity-data', 'data': JSON.stringify(StatisticsActivity.data)});
    }, 3000);
});


process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
