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
const { PORT, mongoDbUrl } = require('./utils/config');

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

mongoose.connect(mongoDbUrl)
  .then(() => {
    console.log(`БД: ${mongoDbUrl} успешно подключено`);
  })
  .catch((error) => {
    console.error('Ошибка подключения к БД:', error.message);
    process.exit(1); // Завершаем процесс при ошибке подключения
  });

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});
