const { chekToken } = require('../utils/jwtAuth');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = chekToken(token);
  } catch (err) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
