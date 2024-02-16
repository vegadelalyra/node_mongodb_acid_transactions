const path = require('path');
const convict = require('convict');

convict.addFormat(require('convict-format-with-validator').ipaddress);

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: '',
    arg: 'env',
  },
  // debug: {
  //   doc: 'Debug',
  //   format: Boolean,
  //   default: true,
  // },
  // client: {
  //   host: {
  //     doc: 'Client host',
  //     format: '*',
  //     default: 'http://127.0.0.1'
  //   },
  //   domain: {
  //     doc: 'Client domain',
  //     format: String,
  //     default: 'localhost'
  //   },
  //   domainList: {
  //     doc: 'Client domain list',
  //     format: Array,
  //     default: [],
  //   }
  // },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 2000,
    arg: 'port',
  },
});

const env = config.get('env');

config.loadFile(path.join(__dirname, `${env}.json`));
config.validate({ allowed: 'strict' });

module.exports = config;
