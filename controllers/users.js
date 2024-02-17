const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
  StatusCodes,
} = require('http-status-codes');

const userModel = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { signToken } = require('../utils/jwtAuth');

const SALT_ROUNDS = 10; // перенести

const getUserInfo = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      userModel
        .create({
          name, email, password: hash,
        })
        .then((user) => res.status(StatusCodes.CREATED).send({
          name: user.name,
          email: user.email,
          _id: user._id,
        }))
        .catch((err) => {
          if (err instanceof mongoose.Error.CastError
            || err instanceof mongoose.Error.ValidationError) {
            next(new BadRequestError(`Отправлены некорректные данные при создании пользователя: ${err.message}`));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
         || err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при обновлении профиля: ${err.name}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Проверяем, что оба поля присутствуют
  if (!email || !password) {
    return next(new BadRequestError('Необходимо заполнить все поля'));
  }

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = signToken(user); // изменить

      // вернём токен
      res.status(StatusCodes.OK).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUserInfo,
  createUser,
  updateProfile,
  login,

};
