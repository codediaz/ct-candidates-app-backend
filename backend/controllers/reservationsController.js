const db = require('../config/db');

exports.createReservation = async (req, res) => {
    const { eventId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const [[event]] = await db.query('SELECT tickets FROM events WHERE id = ?', [eventId]);
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

        if (event.tickets < quantity) {
            return res.status(400).json({ message: 'No hay suficientes tickets disponibles' });
        }

        await db.query('INSERT INTO reservations (event_id, user_id, quantity) VALUES (?, ?, ?)', [
            eventId,
            userId,
            quantity,
        ]);

        await db.query('UPDATE events SET tickets = tickets - ? WHERE id = ?', [quantity, eventId]);

        res.status(201).json({ message: 'Reserva creada con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la reserva', error: err.message });
    }
};

exports.getReservationsByUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const [reservations] = await db.query(
            'SELECT r.id, r.event_id, e.name AS event_name, r.quantity, r.created_at FROM reservations r INNER JOIN events e ON r.event_id = e.id WHERE r.user_id = ?',
            [userId]
        );

        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener reservas', error: err.message });
    }
};
