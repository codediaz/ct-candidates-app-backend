const eventController = require("../../controllers/eventController");
const db = require("../../db");

// Mockear la base de datos
jest.mock("../../db");

describe("Event Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe("getAllEvents", () => {
    it("deberia devolver todos los eventos", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockEvents = [
        { id: 1, name: "Evento 1" },
        { id: 2, name: "Evento 2" },
      ];

      db.execute.mockResolvedValueOnce([mockEvents]);

      await eventController.getAllEvents(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM events");
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    it("deberia devolver un error si ocurre un problema", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.execute.mockRejectedValueOnce(new Error("Database error"));

      await eventController.getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error al obtener eventos.",
        error: expect.any(Error),
      });
    });
  });

  describe("getEventById", () => {
    it("deberia devolver un evento por ID", async () => {
      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockEvent = [{ id: 1, name: "Evento 1" }];

      db.execute.mockResolvedValueOnce([mockEvent]);

      await eventController.getEventById(req, res);

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM events WHERE id = ?",
        [1]
      );
      expect(res.json).toHaveBeenCalledWith(mockEvent[0]);
    });

    it("deberia devolver un error si el evento no se encuentra", async () => {
      const req = { params: { id: 999 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.execute.mockResolvedValueOnce([[]]);

      await eventController.getEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Evento no encontrado",
      });
    });
  });

  describe("addEvent", () => {
    it("deberia agregar un nuevo evento", async () => {
      const req = {
        body: {
          name: "Nuevo Evento",
          description: "Descripción del evento",
          date: "2024-01-01",
          location: "Lugar",
          total_tickets: 100,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      await eventController.addEvent(req, res);

      expect(db.execute).toHaveBeenCalledWith(
        "INSERT INTO events (name, description, date, location, total_tickets, available_tickets) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "Nuevo Evento",
          "Descripción del evento",
          "2024-01-01",
          "Lugar",
          100,
          100,
        ]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Evento creado exitosamentee.",
        eventId: 1,
      });
    });

    it("deberia devolver un error si faltan campos obligatorios", async () => {
      const req = {
        body: {
          name: "",
          date: "",
          location: "",
          total_tickets: null,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await eventController.addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Faltan campos obligatorios.",
      });
    });
  });

  describe("updateEvent", () => {
    it("deberia actualizar un evento existente", async () => {
      const req = {
        params: { id: 1 },
        body: {
          name: "Evento Actualizado",
          description: "Nueva Descripción",
          date: "2024-01-01",
          location: "Lugar Nuevo",
          total_tickets: 150,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockEvent = [
        {
          id: 1,
          total_tickets: 100,
          available_tickets: 90,
        },
      ];

      db.execute.mockResolvedValueOnce([mockEvent]);
      db.execute.mockResolvedValueOnce([]);

      await eventController.updateEvent(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Evento actualizado exitosamente",
      });
    });
  });

  describe("deleteEvent", () => {
    it("deberia eliminar un evento", async () => {
      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockEvent = [{ id: 1 }];

      db.execute.mockResolvedValueOnce([mockEvent]);
      db.execute.mockResolvedValueOnce([]);

      await eventController.deleteEvent(req, res);

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM events WHERE id = ?",
        [1]
      );
      expect(db.execute).toHaveBeenCalledWith(
        "DELETE FROM events WHERE id = ?",
        [1]
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Evento eliminado exitosamete.",
      });
    });
  });
});
