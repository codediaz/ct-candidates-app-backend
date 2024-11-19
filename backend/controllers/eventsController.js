const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM events');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los eventos', error: err.message });
    }
};

exports.createEvent = async (req, res) => {
    const { name, date, location, tickets } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO events (name, date, location, tickets) VALUES (?, ?, ?, ?)',
            [name, date, location, tickets]
        );
        res.status(201).json({ message: 'Evento creado exitosamente', eventId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el evento', error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, date, location, tickets } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE events SET name = ?, date = ?, location = ?, tickets = ? WHERE id = ?',
            [name, date, location, tickets, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json({ message: 'Evento actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el evento', error: err.message });
    }
};

exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los detalles del evento', error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json({ message: 'Evento eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el evento', error: err.message });
    }
};
