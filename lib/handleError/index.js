const { Container } = require('typedi');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const chalk = require('chalk');

const Logger = require('../../loader/logger');
const { Constant } = require('../utils');

let httpServerRef = null;

class AppError extends Error {
  constructor(
    name,
    message,
    code = null,
    cause = null,
    HTTPStatus = null,
    isTrusted = true
  ) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.code = code;
    this.HTTPStatus = HTTPStatus;
    this.isTrusted = isTrusted;
  }
}

// This simulates a typical monitoring solution that allow firing custom metrics when
// like Prometheus, DataDog, CloudWatch, etc
const metricsExporter = {
  async fireMetric(name, labels) {
    Logger.info('In real production code I will really fire metrics');
  },
};

// The input might won't be 'AppError' or even 'Error' instance, the output of this function will be - AppError.
const normalizeError = errorToHandle => {
  if (errorToHandle instanceof AppError) {
    return errorToHandle;
  }
  if (errorToHandle instanceof Error) {
    return new AppError(errorToHandle.name, errorToHandle.message);
  }
  // meaning it could e any type,
  const inputType = typeof errorToHandle;

  return new AppError(
    'general-error',
    `Error Handler received a none error instance with type - ${inputType}, value - ${errorToHandle}`
  );
};

const terminateHttpServer = async () => {
  // maybe implement more complex logic here (like using 'http-terminator' library)
  if (httpServerRef) {
    Logger.info('terminate server...');
    const redis = Container.get('redis');
    // Se cierra la conexión a la base de datos
    mongoose.connection.close(async () => {
      Logger.info(
        `${chalk.bold.magenta(
          'Mongoose default connection is disconnected due to application termination'
        )}`
      );

      // Se elimina el cache y se cierra la conexión
      if (redis && redis.redisClient) {
        redis.redisClient.quit();
        Logger.info('Redis connection closed');
      }

      await httpServerRef.close();

      // eslint-disable-next-line no-process-exit
      process.exit();
    });
  }
};

const errorHandler = {
  listenToErrorEvents(httpServer) {
    httpServerRef = httpServer;

    process.on('uncaughtException', error => {
      errorHandler.handleError(error);
    });

    process.on('unhandledRejection', reason => {
      errorHandler.handleError(reason);
    });

    process.on('SIGTERM', () => {
      Logger.error(
        'App received SIGTERM event, try to gracefully close the server'
      );

      terminateHttpServer();
    });

    process.on('SIGINT', () => {
      Logger.error(
        'App received SIGINT event, try to gracefully close the server'
      );
      terminateHttpServer();
    });
  },
  handleError(errorToHandle) {
    try {
      const appError = normalizeError(errorToHandle);
      Logger.error(appError);
      metricsExporter.fireMetric('error', { errorName: appError.name });
      // A common best practice is to crash when an unknown error (non-trusted) is being thrown
      if (!appError.isTrusted) {
        terminateHttpServer();
      }
    } catch (e) {
      Logger.error('Error Handler failed to handleError properly');
      Logger.error(e);
      // Should we crash here?
    }
  },
};

const notFoundError = (message = '') =>
  new AppError(
    Constant.Error.NOT_FOUND.name,
    message === '' ? Constant.Error.NOT_FOUND.message : message,
    Constant.Error.NOT_FOUND.code,
    Constant.Error.NOT_FOUND.cause,
    StatusCodes.NOT_FOUND
  );

const forbiddenError = (message = '') =>
  new AppError(
    Constant.Error.FORBIDDEN.name,
    message === '' ? Constant.Error.FORBIDDEN.message : message,
    Constant.Error.FORBIDDEN.code,
    Constant.Error.FORBIDDEN.cause,
    StatusCodes.FORBIDDEN
  );

const badRequestError = (message = '') =>
  new AppError(
    Constant.Error.INVALID_REQUEST.name,
    message === '' ? Constant.Error.INVALID_REQUEST.message : message,
    Constant.Error.INVALID_REQUEST.code,
    Constant.Error.INVALID_REQUEST.cause,
    StatusCodes.BAD_REQUEST
  );

const unauthorizedError = () =>
  new AppError(
    Constant.Error.UNAUTHORIZED.name,
    Constant.Error.UNAUTHORIZED.message,
    Constant.Error.UNAUTHORIZED.code,
    Constant.Error.UNAUTHORIZED.cause,
    StatusCodes.UNAUTHORIZED
  );

const serviceUnavailableError = () =>
  new AppError(
    Constant.Error.SERVICE_UNAVAILABLE.name,
    Constant.Error.SERVICE_UNAVAILABLE.message,
    Constant.Error.SERVICE_UNAVAILABLE.code,
    Constant.Error.SERVICE_UNAVAILABLE.cause,
    StatusCodes.SERVICE_UNAVAILABLE
  );

const invalidRequestError = () =>
  new AppError(
    Constant.Error.INVALID_REQUEST.name,
    Constant.Error.INVALID_REQUEST.message,
    Constant.Error.INVALID_REQUEST.code,
    Constant.Error.INVALID_REQUEST.cause,
    StatusCodes.BAD_REQUEST
  );

const httpRequestError = () =>
  new AppError(
    Error.HTTP_REQUEST_ERROR.name,
    Error.HTTP_REQUEST_ERROR.message,
    Error.HTTP_REQUEST_ERROR.code,
    Error.HTTP_REQUEST_ERROR.cause,
    StatusCodes.BAD_REQUEST
  );

module.exports = {
  errorHandler,
  AppError,
  metricsExporter,
  notFoundError,
  unauthorizedError,
  serviceUnavailableError,
  invalidRequestError,
  badRequestError,
  httpRequestError,
  forbiddenError,
};
