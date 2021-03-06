/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This module contains the logger configuration
 * @author TCSCODER
 * @version 1.0
 */
const bunyan = require('bunyan');
const bunyanLogentries = require('bunyan-logentries');
const config = require('config');
const _ = require('lodash');

const streams = [{
  stream: process.stdout,
}];
if (_.get(config, 'CAPTURE_LOGS', 'false').toLowerCase() === 'true') {
  streams.push({
    stream: bunyanLogentries.createStream({ token: config.get('LOGENTRIES_TOKEN') }),
    type: 'raw',
  });
}
const logger = bunyan.createLogger({
  name: 'tc-connect-notifications',
  level: config.get('LOG_LEVEL'),
  serializers: { err: bunyan.stdSerializers.err },
  streams,
});


module.exports = logger;
