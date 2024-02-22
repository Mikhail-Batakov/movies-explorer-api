const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateSignUp, validateSignIn } = require('../middlewares/validate');
const NotFoundError = require('../errors/NotFoundError');
const { ERROR_TEMPLATES } = require('../utils/errorMessages');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

// авторизация
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError(ERROR_TEMPLATES.pageNotFound));
});

module.exports = router;
