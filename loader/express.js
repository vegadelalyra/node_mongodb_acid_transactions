const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');

const config = require('../config');
const { errorHandler } = require('../lib/handleError');
const { Helper } = require('../lib/utils');

const mongoose = require('mongoose');
const uri =
  'mongodb://inspectorAdmin:1088352389@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=inspectDB&appName=mongosh+2.1.1';

const user_route = require('../src/routes/user.route');

module.exports = app => {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"],
        mediaSrc: ["'self'", 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // https://fonts.googleapis.com
        imgSrc: ["'self'", 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        reportUri: '/cspviolation',
      },
    })
  );
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(
    helmet.hsts({
      maxAge: 1000 * 60 * 60 * 24 * 365,
      includeSubDomains: true,
      preload: true,
    })
  );
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static(path.join(path.dirname(__dirname), 'public')));

  app.use('/user', user_route);

  app.use('/', (req, res) => {
    try {
      return Helper.httpResponse(res, StatusCodes.OK, 'Request successful');
    } catch (error) {
      return Helper.httpResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Something went wrong!'
      );
    }
  });

  app.use((error, req, res, next) => {
    if (typeof error === 'object') {
      if (error.isTrusted === undefined || error.isTrusted === null) {
        error.isTrusted = true;
      }
    }

    errorHandler.handleError(error);

    return Helper.httpResponse({
      res: res,
      statusCode: error.HTTPStatus || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `${error.message}`,
      data: null,
      code: error.code,
    });
  });

  // app.listen(config.get('port'), async () => {
  //   await mongoose.connect(uri);
  // });
};
