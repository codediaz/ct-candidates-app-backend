const express = require('express');
const {
    getAllEvents,
    createEvent,
    updateEvent,
    getEventById,
    deleteEvent,
} = require('../controllers/eventsController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllEvents);

router.post('/', verifyToken, isAdmin, createEvent);
router.put('/:id', verifyToken, isAdmin, updateEvent);
router.get('/:id', getEventById);
router.delete('/:id', verifyToken, isAdmin, deleteEvent);

module.exports = router;
