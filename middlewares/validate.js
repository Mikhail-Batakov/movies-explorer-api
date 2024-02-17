const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// Объект с функциями валидации для использования с Joi
const validationFunctions = {
  // Функция валидации URL
  isUrl: (value, helpers) => {
    if (!validator.isURL(value)) {
      return helpers.message('Некорректный формат URL');
    }
    return value;
  },

  // Функция валидации email
  isEmail: (value, helpers) => {
    if (!validator.isEmail(value)) {
      return helpers.message('Некорректный формат email адреса');
    }
    return value;
  },
};

const {
  isUrl,
  isEmail,
} = validationFunctions;

// Схема валидации для регистрации
const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
  }),
});

// Схема валидации для входа
const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
  }),
});

// Схема валидации для обновления профиля
const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().custom(isEmail),
  }),
});

// Схема валидации для создания фильма
const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(isUrl).required(),
    trailerLink: Joi.string().custom(isUrl).required(),
    thumbnail: Joi.string().custom(isUrl).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// Схема валидации для удаления фильма по ID
const validatedelMovieById = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

// Экспорт схем валидации
module.exports = {
  validateSignUp,
  validateSignIn,
  validateUpdateProfile,
  validateCreateMovie,
  validatedelMovieById,
};
