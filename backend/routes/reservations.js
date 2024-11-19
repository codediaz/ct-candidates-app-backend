const express = require('express');
const { createReservation, getReservationsByUser } = require('../controllers/reservationsController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createReservation);

router.get('/:userId', verifyToken, getReservationsByUser);

module.exports = router;
