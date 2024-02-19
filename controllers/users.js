const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
  StatusCodes,
} = require('http-status-codes');

const userModel = require('../models/user');

const { SALT_ROUNDS } = require('../utils/config');

const { ERROR_TEMPLATES } = require('../utils/errorMessages');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { signToken } = require('../utils/jwtAuth');

const getUserInfo = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError(ERROR_TEMPLATES.user.userNotFound));
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
            next(new BadRequestError(ERROR_TEMPLATES.user.invalidUserData));
          } else if (err.code === 11000) {
            next(new ConflictError(ERROR_TEMPLATES.user.userConflict));
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
        next(new BadRequestError(ERROR_TEMPLATES.user.invalidProfileData));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(ERROR_TEMPLATES.user.userNotFound));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Проверяем, что оба поля присутствуют
  if (!email || !password) {
    return next(new BadRequestError(ERROR_TEMPLATES.user.unauthorized));
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
