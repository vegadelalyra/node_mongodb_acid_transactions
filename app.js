const express = require('express');
const loader = require('./loader');

// Se inicializa el servidor express
const app = express();

const loadApp = async () => {
  await loader.init(app);
};

loadApp();

module.exports = app;
