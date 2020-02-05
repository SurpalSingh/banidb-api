const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cacheControl = require('express-cache-controller');
const { createPool } = require('mariadb');
const config = require('./api/config');
const swaggerUi = require('swagger-ui-express');
const routes = require('./api/routes');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.NODE_ENV === 'development' ? '3001' : '3000';

app.locals.pool = createPool(config.mysql);

app.use(cors());
app.use(cacheControl({ maxAge: 21600 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/v2', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.cacheControl = { noCache: true };
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

app.listen(port, () => {
  console.log(`BaniDB API start on port ${port}`);
});

module.exports = app;
