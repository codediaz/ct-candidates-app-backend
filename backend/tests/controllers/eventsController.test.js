const { getAllEvents, createEvent } = require('../../controllers/eventsController');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('Eventos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe obtener todos los eventos', async () => {
        const mockEvents = [
            { id: 1, name: 'Evento 1', date: '2024-12-01', location: 'Lugar 1', tickets: 100 },
        ];

        db.query.mockResolvedValueOnce([mockEvents]);

        const req = {};
        const res = {
            json: jest.fn(),
        };

        await getAllEvents(req, res);

        expect(res.json).toHaveBeenCalledWith(mockEvents);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM events');
    });

    test('Debe crear un nuevo evento', async () => {
        db.query.mockResolvedValueOnce([{ insertId: 1 }]);

        const req = {
            body: { name: 'Nuevo Evento', date: '2024-12-01', location: 'Lugar X', tickets: 200 },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createEvent(req, res);

        expect(db.query).toHaveBeenCalledWith(
            'INSERT INTO events (name, date, location, tickets) VALUES (?, ?, ?, ?)',
            ['Nuevo Evento', '2024-12-01', 'Lugar X', 200]
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Evento creado exitosamente', eventId: 1 });
    });
});
