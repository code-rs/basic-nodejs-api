/**
 * API
 */

// Dependencies
var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;

//Create http Server
var httpServer = http.createServer(function(req,res){
       
    //Parse URLs
    var parsedUrl = url.parse(req.url,true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //get Query
    var queryStringObject = parsedUrl.query;

    //get HTTP Method
    var method = req.method.toLowerCase();

    //get Headers

    var headers = req.headers;
   
    //get Data from petition
    var decoder = new stringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();

        //Choose the correct handler from route
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
        //Get the Data
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        //call the logic of the route selected
        chosenHandler(data, function(statusCode,payload){
                        
            //default payload
            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);

            // Response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            
            //Log
            console.log('Returning: ', statusCode,payloadString);
        });
    });   
});

// Serve on port 3000
httpServer.listen(3000,function(){
    console.log('Server listening on port 3000');
});


//Routes and handlers
var handlers = {};

//Hello logic
handlers.hello =  function(data,callback){
    
     var values = JSON.parse(data.payload);

    var name = '';
    name += typeof(values.name) == 'string' ? values.name : '';
    name += typeof(values.surname) == 'string' ? ' '+values.surname : '';

    name = name.trim();
    name = name == '' ? 'Jhon Doe' : name;

    callback(200, {"messaje": "Hello "+name});
};

//URL Error
handlers.notFound = function(data,callback){
    callback(404);
};

//Router
var router = {
    'hello' : handlers.hello
};