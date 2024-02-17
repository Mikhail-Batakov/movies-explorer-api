require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const cors = require('cors');
const limiter = require('./utils/limiter');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env; // исправить

mongoose.connect(DB_URL, {

});

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение слушает порт: ${PORT}`);
});
