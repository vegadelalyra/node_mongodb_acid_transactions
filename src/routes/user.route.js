const express = require('express');
const { matchedData, check } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const { Helper } = require('../../lib/utils');
const { User_Model, Request_Model } = require('../models');

const mongoose = require('mongoose');
const uri =
  'mongodb://inspectorAdmin:1088352389@127.0.0.1:27020/?authSource=inspectDB';

const user_route = express.Router();

user_route.post(
  '/create',
  [
    check('name').notEmpty().isString(),
    check('age').notEmpty().isInt(),
    check('company.*.company_name').notEmpty().isString(),
    check('company.*.employer_name').notEmpty().isString(),
    check('married').notEmpty().isBoolean(),
    check('date_of_birth').notEmpty().isISO8601(),
  ],
  async (req, res) => {
    try {
      const new_user_data = matchedData(req);

      const new_user_request = new User_Model(new_user_data);
      await new_user_request.save();

      return Helper.httpResponse(res, StatusCodes.OK, 'Working fine!');
    } catch (error) {
      return Helper.httpResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'WOOPS! ' + error,
        error.code
      );
    }
  }
);

user_route.post(
  '/',
  [
    check('name').notEmpty().isString(),
    check('age').notEmpty().isInt(),
    check('company.*.company_name').notEmpty().isString(),
    check('company.*.employer_name').notEmpty().isString(),
    check('married').notEmpty().isBoolean(),
    check('date_of_birth').notEmpty().isISO8601(),
  ],
  async (req, res) => {
    try {
      const request_body = matchedData(req);

      const mongo_client = await mongoose.connect(uri);
      const session = await mongo_client.startSession();

      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcerns: { w: 'majority' },
      };

      try {
        await session.withTransaction(async () => {
          const new_user_request = new User_Model(request_body);
          const request_tracker = {};

          try {
            await new_user_request.save({ session });
          } catch (error) {
            await session.abortTransaction();

            return Helper.httpResponse(
              res,
              StatusCodes.BAD_REQUEST,
              'Transaction aborted during session new user registry ' + error,
              error,
              error.code
            );
          }

          request_tracker['name'] = request_body['name'];
          request_tracker['date_of_request'] = new Date();

          const new_request_tracker = new Request_Model(request_tracker);
          await new_request_tracker.save({ session });

          await session.commitTransaction();

          return Helper.httpResponse(
            res,
            StatusCodes.OK,
            'ACID MongoDB Transaction made'
          );
        }, transactionOptions);
      } catch (error) {
        return Helper.httpResponse(
          res,
          StatusCodes.BAD_REQUEST,
          'Transaction aborted during session new request registry ' + error,
          error.code
        );
      } finally {
        await session.endSession();
        return;
      }
    } catch (error) {
      return Helper.httpResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'ERROR CREATING A SECOND MONGO CLIENT AND SESSION! ' + error,
        error.code
      );
    }
  }
);

module.exports = user_route;
