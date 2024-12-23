const authController = require("../../controllers/authController");
const db = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


jest.mock("../../db");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe("register", () => {
    it("deberia registrar un nuevo usuario y devolver un token", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      db.execute.mockResolvedValueOnce([[]]); // No existe usuario con el email/username
      bcrypt.hash.mockResolvedValueOnce("hashedPassword123");
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Simular inserción exitosa
      jwt.sign.mockReturnValueOnce("mockedToken123");

      await authController.register(req, res);

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [req.body.email, req.body.username]
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(db.execute).toHaveBeenCalledWith(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [req.body.username, req.body.email, "hashedPassword123"]
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          is_admin: false,
          email: req.body.email,
          username: req.body.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario registrado exitosamente.",
        token: "mockedToken123",
      });
    });

    it("deberia devolver un error si el usuario ya existe", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      db.execute.mockResolvedValueOnce([[{ id: 1 }]]); // Usuario ya existe

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario ya existe.",
      });
    });
  });

  describe("login", () => {
    it("deberia autenticar al usuario y devolver un token", async () => {
      const req = {
        body: {
          email: "testuser@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      db.execute.mockResolvedValueOnce([
        [
          {
            id: 1,
            email: "testuser@example.com",
            password: "hashedPassword123",
            is_admin: false,
            username: "testuser",
          },
        ],
      ]);
      bcrypt.compare.mockResolvedValueOnce(true); // Contraseña coincide
      jwt.sign.mockReturnValueOnce("mockedToken123");

      await authController.login(req, res);

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = ?",
        [req.body.email]
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        "hashedPassword123"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          is_admin: false,
          email: "testuser@example.com",
          username: "testuser",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({ token: "mockedToken123" });
    });

    it("deberia devolver un error si las credenciales son inválidas", async () => {
      const req = {
        body: {
          email: "testuser@example.com",
          password: "wrongpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      db.execute.mockResolvedValueOnce([
        [
          {
            id: 1,
            email: "testuser@example.com",
            password: "hashedPassword123",
            is_admin: false,
            username: "testuser",
          },
        ],
      ]);
      bcrypt.compare.mockResolvedValueOnce(false); // Contraseña no coincide

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Credenciales inválidas.",
      });
    });

    it("deberia devolver un error si el usuario no existe", async () => {
      const req = {
        body: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      db.execute.mockResolvedValueOnce([[]]); // Usuario no encontrado

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Credenciales inválidas.",
      });
    });
  });
});
