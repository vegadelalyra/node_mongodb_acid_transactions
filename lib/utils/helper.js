// Funciones de utilidad especificas del proyecto

/**
 *
 * @param {*} res Objecto de respuesta de Express
 * @param {*} statusCode Código de estado HTTP
 * @param {*} message Descripción de la respuesta
 * @param {*} data Objeto plano con los datos de respuesta
 *
 * @returns Una respuesta de Express
 */
const httpResponse = (
  res,
  statusCode,
  message = '',
  data = null,
  code = null,
) => {
  let responseBody = { status: statusCode };

  if (message !== '') {
    responseBody = { ...responseBody, message };
  }

  if (code !== null) {
    responseBody = { ...responseBody, code };
  }

  if (data !== null) {
    responseBody = { ...responseBody, data };
  }

  return res.status(statusCode).json(responseBody);
};

const httpRender = (res, statusCode, template, data) => {
  res.status(statusCode).render(template, data);
};

const httpSimpleResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

const capitalize = (value) => {
  if (value) {
    if (typeof value === 'string') {
      const splitedValue = value.split(' ');
      const blank = ' ';
      let result = '';

      if (splitedValue.length > 1) {
        splitedValue.forEach((str, index) => {
          result += `${str.charAt(0).toUpperCase()}${str
            .slice(1)
            .toLowerCase()}${index !== splitedValue.length - 1 ? blank : ''}`;
        });
      } else {
        result = `${value.charAt(0).toUpperCase()}${value
          .slice(1)
          .toLowerCase()}`;
      }
      return result;
    }
    throw new Error('[capitalize]: "value" is not a string');
  }
  throw new Error('[capitalize]: "value" is not valid');
};

const randomNumber = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const findDistinct = (arr1, arr2) => {
  let i = 0;
  let j = 0;
  const distinct = [];

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] === arr2[j]) {
      i += 1;
      j += 1;
    } else if (arr1[i] < arr2[j]) {
      distinct.push(arr1[i]);
      i += 1;
    } else {
      distinct.push(arr2[j]);
      j += 1;
    }
  }

  while (i < arr1.length) {
    distinct.push(arr1[i]);
    i += 1;
  }

  while (j < arr2.length) {
    distinct.push(arr2[j]);
    j += 1;
  }

  return distinct;
};

const wait = (delay = 750) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), delay);
  });

module.exports = {
  httpResponse,
  httpRender,
  httpSimpleResponse,
  capitalize,
  randomNumber,
  findDistinct,
  wait,
};
