const mongoose = require('mongoose');
const {
  StatusCodes,
} = require('http-status-codes');
const movieModel = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  const userId = req.user._id; // Получаем идентификатор текущего пользователя
  movieModel
    .find({ owner: userId }) // Находим все фильмы, сохраненные текущим пользователем
    .then((movies) => {
      res.status(StatusCodes.OK).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  movieModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((movie) => {
      res.status(StatusCodes.CREATED).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Отправлены некорректные данные при создании фильма: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const delMovieById = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  movieModel
    .findById(movieId).orFail()
    .then((movie) => {
      if (!movie.owner.equals(userId)) {
        throw new ForbiddenError('Попытка удалить чужой фильм');
      }

      return movieModel.deleteOne({ _id: movieId }).orFail();
    })
    .then(() => {
      res.status(StatusCodes.OK).send({
        message: 'Фильм успешно удален',
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Неверный формат id фильма'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Фильм по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  delMovieById,

};
