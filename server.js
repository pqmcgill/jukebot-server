// Require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var queryString = require('querystring');
var request = require('request');

// Server Configuration
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var port = process.env.PORT || 3000;

var client_id = process.env.API_KEY;
var client_secret = process.env.SECRET_KEY;

// Routes
app.post('/api/v1/rhapsody/auth', function(req, res) {
  var code = req.body.code;
  if (code) {
    request.post({
      url: 'https://api.rhapsody.com/oauth/access_token',
      form: {
        'client_id': client_id,
        'client_secret': client_secret,
        'response_type': 'code',
        'code': code,
        'redirect_uri': 'http://google.com',
        'grant_type': 'authorization_code'
      }
    }, function(err, response, body) {
      if (err) {
        res.status(500);
        res.json({
          error: err,
          status: 500,
          msg: 'Error connecting to rhapsody auth service'
        });
      } else {
        res.json(JSON.parse(body));
      }
    });
  } else {
    res.status(400);
    res.json({
      status: 400,
      msg: 'Bad Request: valid code required'
    });
  }
});

// Run Server
var server = app.listen(port);
