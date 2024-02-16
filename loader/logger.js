const pino = require('pino');

const { tmpdir } = require('os');
const { join } = require('path');

const file = join(tmpdir(), `pino-${process.pid}-example`);

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty',
      options: {
        destination: file,
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        ignore: 'hostname',
      },
    },
    {
      level: 'info',
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        ignore: 'hostname',
      },
    },
  ],
});

module.exports = pino(transport);
