const router = require('express').Router();
const { updateProfile, getUserInfo } = require('../controllers/users');
const { validateUpdateProfile } = require('../middlewares/validate');

// Получение информацию о текущем пользователе
router.get('/me', getUserInfo);

// Обновление профиля текущего пользователя
router.patch('/me', validateUpdateProfile, updateProfile);

router.patch('/me', updateProfile);

module.exports = router;
