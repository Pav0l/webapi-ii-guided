const express = require('express');
const hubRoutes = require('./routes');

const server = express();

// Use middleware 'hubRoutes', which contains all the endpoints
/*
if you write it like:
server.use('/api/hubs', hubRoutes)
you filter that middleware to routes that match the route passed into the middleware

*/
server.use(hubRoutes);

module.exports = server;
