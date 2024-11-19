const { createReservation } = require('../../controllers/reservationsController');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('Reservas', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe crear una reserva con éxito', async () => {
        const mockEvent = { tickets: 100 };
        db.query.mockResolvedValueOnce([[mockEvent]]);
        db.query.mockResolvedValueOnce([]);
        db.query.mockResolvedValueOnce([]);

        const req = {
            body: { eventId: 1, userId: 2, quantity: 2 },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createReservation(req, res);

        expect(db.query).toHaveBeenCalledWith('SELECT tickets FROM events WHERE id = ?', [1]);
        expect(db.query).toHaveBeenCalledWith(
            'INSERT INTO reservations (event_id, user_id, quantity) VALUES (?, ?, ?)',
            [1, 2, 2]
        );
        expect(db.query).toHaveBeenCalledWith('UPDATE events SET tickets = tickets - ? WHERE id = ?', [2, 1]);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Reserva creada con éxito' });
    });

    test('Debe devolver error si no hay suficientes tickets', async () => {
        const mockEvent = { tickets: 1 };
        db.query.mockResolvedValueOnce([[mockEvent]]);

        const req = {
            body: { eventId: 1, userId: 2, quantity: 2 },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createReservation(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'No hay suficientes tickets disponibles' });
    });
});
