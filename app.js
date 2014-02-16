
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var log4js = require('log4js');
exports.logger = function(name){
	var logger = log4js.getLogger(name);
	logger.setLevel('INFO');
	return logger;
}

log4js.configure({
	appenders: [
	{type: 'console'},
	{type: 'file',
	filename: 'logs/access.log',
	maxLogSize: 1024,
	backups:3,
	category:'normal'
	}
	],
	replaceConsole: true
});



var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
	url: "mongodb://localhost/session",
	interval:120000
});


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('.html',ejs.__express);//2 underscores?
app.set('view engine','html');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'fens.me'}));
app.use(express.session({
secret : 'fens.me',
store: store,
cookie: { maxAge: 900000 }
}));
app.use(function(req, res, next){
res.locals.user = req.session.user;
//case: login failure
var err = req.session.error;
delete req.session.error;
res.locals.message='';
if(err) res.locals.message='<div class="alert alert-error">'+err+'</div>';
next();
});

app.use(log4js.connectLogger(this.logger('normal'), {level:log4js.levels.INFO,format:':method :url'}));


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login',notAuthentication);
app.get('/login', routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',authentication);
app.get('/logout',routes.logout);
//can't get home if login failed
app.get('/modify-request',authentication);
app.get('/modify-request',routes.mrequest);

function authentication(req, res, next) {
if (!req.session.user) {
req.session.error='Please Login first';
return res.redirect('/login');
}
next();
}
function notAuthentication(req, res, next) {
if (req.session.user) {
req.session.error='Already login';
return res.redirect('/');
}
next();
}



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
