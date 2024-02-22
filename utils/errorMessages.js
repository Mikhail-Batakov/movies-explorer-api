const ERROR_TEMPLATES = {
  user: {
    invalidUserData: 'Отправлены некорректные данные при создании пользователя',
    userConflict: 'Пользователь с таким email уже зарегистрирован',
    invalidProfileData: 'Переданы некорректные данные при обновлении профиля',
    userNotFound: 'Пользователь по указанному id не найден',
    unauthorized: 'Неправильные почта или пароль',
  },
  movie: {
    invalidMovieData: 'Отправлены некорректные данные при создании фильма',
    invalidMovieIdFormat: 'Неверный формат id фильма',
    movieNotFound: 'Фильм по указанному id не найден',
    forbiddenDelete: 'Попытка удалить чужой фильм',
  },
  pageNotFound: 'Запрашиваемая страница не найдена',
};

const SUCCESS_TEMPLATES = {
  movieDeleted: 'Фильм успешно удален',
};

module.exports = {
  ERROR_TEMPLATES,
  SUCCESS_TEMPLATES,
};
