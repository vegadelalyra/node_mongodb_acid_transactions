const express = require('express');
const helmet = require('helmet');

const config = require('./config');

const app = express();

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

app.use('/', (req, res) => {
  try {
    return res.status(200).json({ message: 'Request successful' });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

app.listen(config.get('port'), () => {
  console.log(`Server is running on http://localhost:${config.get('port')}`);
});
