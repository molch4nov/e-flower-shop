const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

// Маршруты для профиля пользователя
router.get('/profile', authenticateUser, userController.getProfile);
router.put('/profile', authenticateUser, userController.updateProfile);

// Маршруты для адресов пользователя
router.get('/addresses', authenticateUser, userController.getAddresses);
router.post('/addresses', authenticateUser, userController.createAddress);
router.get('/addresses/:id', authenticateUser, userController.getAddressById);
router.put('/addresses/:id', authenticateUser, userController.updateAddress);
router.delete('/addresses/:id', authenticateUser, userController.deleteAddress);
router.put('/addresses/:id/default', authenticateUser, userController.setAddressAsDefault);

// Маршруты для праздников пользователя
router.get('/holidays', authenticateUser, userController.getHolidays);
router.post('/holidays', authenticateUser, userController.createHoliday);
router.get('/holidays/:id', authenticateUser, userController.getHolidayById);
router.put('/holidays/:id', authenticateUser, userController.updateHoliday);
router.delete('/holidays/:id', authenticateUser, userController.deleteHoliday);

module.exports = router; 