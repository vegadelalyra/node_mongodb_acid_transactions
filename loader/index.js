const expressLoader = require('./express');
const Logger = require('./logger');

const init = async expressApp => {
  try {
    expressLoader(expressApp);
  } catch (err) {
    Logger.error(err);
  }
};

module.exports = { init, Logger, expressLoader };
