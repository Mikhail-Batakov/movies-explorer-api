const router = require('express').Router();
const {
  getMovies, createMovie, delMovieById,
} = require('../controllers/movies');
const { validateCreateMovie, validatedelMovieById } = require('../middlewares/validate');

router.get('/', getMovies);

router.post('/', validateCreateMovie, createMovie);

router.delete('/:movieId', validatedelMovieById, delMovieById);

module.exports = router;
