const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// Маршруты для обычных пользователей
router.get('/', authenticateUser, orderController.getUserOrders);
router.post('/', authenticateUser, orderController.createOrder);
router.get('/:id', authenticateUser, orderController.getOrderById);
router.post('/:id/cancel', authenticateUser, orderController.cancelOrder);

// Маршруты для админов
router.get('/admin/all', authenticateUser, isAdmin, orderController.getAllOrders);
router.get('/admin/stats', authenticateUser, isAdmin, orderController.getOrderStats);
router.put('/admin/:id/status', authenticateUser, isAdmin, orderController.updateOrderStatus);
router.put('/admin/:id/payment', authenticateUser, isAdmin, orderController.updatePaymentStatus);

module.exports = router; 