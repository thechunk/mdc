var express = require('express');
var path = require('path');
var lookup = require('./server/ctrl/lookup');

var SampleApp = function() {
	//  Scope.
	var self = this;
	self.app = express();
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

	self.initializeServer = function() {
		self.app.get('/api/v1/lookup/place', lookup.placesSearch);
		self.app.use('/dashboard', express.static(path.join(__dirname, 'mockup/dashboard')));
		self.app.use('/', express.static(path.join(__dirname, 'client')));
	}

	self.start = function() {
		//  Start the app on the specific interface (and port).
		self.app.listen(self.port, self.ipaddress, function() {
			console.log('%s: Node server started on %s:%d ...',
				Date(Date.now() ), self.ipaddress, self.port);
		});
	};

	self.initialize = function() {
		self.setupVariables();

		// Create the express server and routes.
		self.initializeServer();
	};
}

var zapp = new SampleApp();
zapp.initialize();
zapp.start();

