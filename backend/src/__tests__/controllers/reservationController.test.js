const reservationController = require("../../controllers/reservationController");
const db = require("../../db");


jest.mock("../../db");

describe("Reservation Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe("makeReservation", () => {
    it("deberia realizar una reservacion con éxito", async () => {
      const req = {
        userId: 1,
        body: {
          event_id: 1,
          tickets: 2,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockEvent = [{ id: 1, available_tickets: 5 }];

      db.execute.mockResolvedValueOnce([mockEvent]); // Verificar evento
      db.getConnection.mockResolvedValue({
        beginTransaction: jest.fn(),
        execute: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
      });

      await reservationController.makeReservation(req, res);

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM events WHERE id = ?",
        [1]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Reservacion realizada exitosamente.",
      });
    });

    it("deberia devolver un error si faltan campos obligatorios", async () => {
      const req = {
        userId: 1,
        body: {},
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await reservationController.makeReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Faltan campos obligatorios.",
      });
    });

    it("deberia devolver un error si no hay suficientes tickets disponibles", async () => {
      const req = {
        userId: 1,
        body: {
          event_id: 1,
          tickets: 10,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockEvent = [{ id: 1, available_tickets: 5 }];
      db.execute.mockResolvedValueOnce([mockEvent]); // Verificar evento

      await reservationController.makeReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tickets insuficientes disponibles.",
      });
    });

    it("deberia devolver un error si el evento no existe", async () => {
      const req = {
        userId: 1,
        body: {
          event_id: 999,
          tickets: 2,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.execute.mockResolvedValueOnce([[]]); // Evento no encontrado

      await reservationController.makeReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Evento no encontrado.",
      });
    });
  });

  describe("getUserReservations", () => {
    it("deberia devolver las reservaciones del usuario", async () => {
      const req = { userId: 1 };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockReservations = [
        {
          id: 1,
          event_name: "Evento 1",
          event_date: "2024-01-01",
          event_location: "Lugar 1",
          tickets: 2,
          reservation_date: "2023-12-01",
        },
      ];

      db.execute.mockResolvedValueOnce([mockReservations]);

      await reservationController.getUserReservations(req, res);

      expect(db.execute).toHaveBeenCalledWith(
        `SELECT 
         r.id, 
         e.name AS event_name, 
         e.date AS event_date,
         e.location AS event_location,
         r.tickets, 
         r.reservation_date,
         e.location
       FROM reservations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ?`,
        [1]
      );
      expect(res.json).toHaveBeenCalledWith(mockReservations);
    });

    it("deberia devolver un error si ocurre un problema", async () => {
      const req = { userId: 1 };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.execute.mockRejectedValueOnce(new Error("Database error"));

      await reservationController.getUserReservations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error al obtener reservaciones.",
        error: expect.any(Error),
      });
    });
  });
});
