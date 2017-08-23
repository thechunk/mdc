#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs = require('fs');
//var routes = require('./routes');
var user = require('./routes/user');
var testApp = require('./routes/app');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var settings = require('./settings.json');
var fs = require('fs');

var iterations = 10000;

var defaultHash = "e8ea92b19a67500806b5db7114b584f3b1d1c41b3956266212a95947241592fbcf0473079ea7b3148078b856eacefc16cab7940cc15085c9f6c448668517f7f2";
var startingUser = "eapuser";


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;
    var users = settings.users;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */
    
    self.hashPasswordText = function(pwText, salt, callback) {
    	if(typeof salt === 'string') {
    		salt = new Buffer(salt, 'hex');
    	}
    	crypto.pbkdf2(pwText, salt, iterations, 64, function(err, key) {
    		if(err)
    			return callback(err);
    		var res = 'pbkdf2$' + iterations +
    			'$' + key.toString('hex') +
    			'$' + salt.toString('hex');
    			callback(null, res);
    		})
    }
    
    self.verifyPassword = function(userid, pwText, callback)
    {
    	var userPwHash = users[userid];
    	if(!userPwHash || !pwText) {
    		return callback(null, false);
    	}
    	var key = userPwHash.split('$');
    	if(key.length !== 4 || !key[2] || !key[3]) {
    		return callback('Hash not formatted correctly');
    	}
    	if(key[0] !== 'pbkdf2' || key[1] !== iterations.toString()){
    		return callback('Wrong algorithm and/or iterations');
    	}
    	self.hashPasswordText(pwText, key[3], function(error, newHash) {
	    	if(error) {
	    		return callback(error);
	    	}
	    	callback(null, newHash === userPwHash);	
   		});
    }

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        // Attempt to get the iSandbox (OpenShift) port first, then Visual Studio port and default if neither is set.
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8765;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
		
		self.routes['/users'] = user.list;
		self.routes['/app'] = testApp.testApp;
		self.routes['/envVars'] = testApp.envVars;
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

		// Set up the path to the views - express only allows one path
		self.app.set('views', path.join(__dirname, 'views'));
		
		// Map file extension .hbs to the express-handlebars template engine
		self.app.engine('.hbs', exphbs({extname: '.hbs'}));
		
		// Set up the default template engine for the views - files without an extension are assumed to be this type
		self.app.set("view engine", "jade");

		self.app.use(logger('dev'));
		self.app.use(bodyParser.urlencoded({ extended: false }));
		self.app.use(bodyParser.json());
		self.app.use(session({ secret: 'nfsda90234jk' }));
		self.app.use(cookieParser());
		self.app.use(passport.initialize());
		self.app.use(passport.session());
		//self.app.use(self.app.router);
		self.app.use(express.static(path.join(__dirname, 'public')));
		
		passport.serializeUser(function(user, done) {
			done(null, user);
		});

		passport.deserializeUser(function(user, done) {
			done(null, user);
		});
		
		passport.use(new LocalStrategy(
			function(username, password, done) {
				console.log('user: %s attempting to log in', username);
				// Must have a user name or fail
				if (!users[username]) { 
				    console.log('Logon failed!');
					return done(null, false); 
				}
                
				self.verifyPassword(username, password, function(error, matched) {
		    		if(error) {
		    			console.log('Logon failed!');
						return done(null, false);
		    		} else {
                        if (matched) {
                            console.log("Logon succeeded!");
                            return done(null, { username : username });
                        } else {
                            console.log('Logon failed!');
                            return done(null, false);
                        }
		    		}
		        });
			}
		));
		
		self.app.get('/login', 
			function (req, res) {
				var hashKey = users[startingUser].split('$')[2];
				if (hashKey === defaultHash) {
					res.render('logon.hbs', { targetURL: req.query.target, logonDisplay : "none", chgPwDisplay : "block"});
				} else {
					res.render('logon.hbs', { targetURL: req.query.target, logonDisplay : "block", chgPwDisplay : "none"});
				}
			}
		);
		self.app.post('/login',
			function(req, res, next) {
				// Check if this is a password change
				if (req.body.op == "chnPw") {
					var salt = crypto.randomBytes(128);
					// Assuming the UI enforced password requirements
					self.hashPasswordText(req.body.pw1, salt, function(error, newHash) {
				    	if(error) {
							console.log("Password change failed - hash failed");
				    	} else {
							users[startingUser] = newHash;
							var output = JSON.stringify(settings, null, 4);
							fs.writeFile('settings.json', output, function(err) {
							    if(err) {
							      console.log("Unable to save settings: %s", err);
							    }
								res.redirect(req.body.target);
							});
				    	}
			   		});
				} else {
					// Continue through the stack
					next();
				}
			}, 
			passport.authenticate('local', { failureRedirect: '/login' }),
			function(req, res, next) {
				res.redirect(req.body.target);
			}
		);
		
		self.app.all('*', function ensureAuthenticated(req, res, next) {
					  if (req.isAuthenticated()) { 
						  return next(); 
					  }
					  console.log('Auth failure on ' +req.url);
					  res.redirect('/login?target=' + encodeURIComponent(req.url));
        });
		
        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

