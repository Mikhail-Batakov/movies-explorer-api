const { StatusCodes } = require('http-status-codes');

module.exports = (err, req, res, next) => {
  // Middleware для обработки ошибок

  // если у ошибки нет статуса, выставляем 500
  const { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === StatusCodes.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};
