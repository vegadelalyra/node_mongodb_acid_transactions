const Error = {
  INTERNAL_ERROR: {
    name: 'INTERNAL_ERROR',
    message: 'Ocurrio un error al procesar la solicitud',
    cause: null,
    code: 1000,
  },
  INVALID_REQUEST: {
    name: 'INVALID_REQUEST',
    message: 'Los datos de entrada no son válidos',
    cause: null,
    code: 1001,
  },
  UNAUTHORIZED: {
    name: 'UNAUTHORIZED',
    message: 'No está autorizado',
    cause: null,
    code: 1002,
  },
  VALIDATION_ERROR: {
    name: 'VALIDATION_ERROR',
    message: 'Los datos requeridos no son válidos',
    cause: null,
    code: 1003,
  },
  SERVICE_ERROR: {
    name: 'SERVICE_ERROR',
    message: 'El servicio solicitado no está disponible',
    cause: null,
    code: 1004,
  },
  NOT_FOUND: {
    name: 'NOT_FOUND',
    message: 'El recurso solicitado no fue encontrado',
    cause: null,
    code: 1005,
  },
  DUPLICATE_KEY: {
    name: 'DUPLICATE_KEY',
    message: 'Uno o varios de los recursos a guardar ya existen',
    cause: null,
    code: 1006,
  },
  SERVICE_UNAVAILABLE: {
    name: 'SERVICE_UNAVAILABLE',
    message: 'En este momento el servicio no está disponible',
    cause: null,
    code: 1007,
  },
  HTTP_REQUEST_ERROR: {
    name: 'HTTP_REQUEST_ERROR',
    message: 'Ha ocurrido un error el realizar la petición',
    cause: null,
    code: 1008,
  },
  FORBIDDEN: {
    name: 'FORBIDDEN',
    message: 'Acceso prohibido',
    cause: null,
    code: 1009,
  },
};

const ModuleCode = {
  ACCOUNT: 2,
};

const DbErrorCode = {
  DUPLICATE_KEY: 11000,
};

module.exports = {
  Error,
  ModuleCode,
  DbErrorCode,
};
