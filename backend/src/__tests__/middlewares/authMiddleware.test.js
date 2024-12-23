const { verifyToken, isAdmin } = require("../../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe("verifyToken", () => {
    it("debería devolver un error si no se proporciona el token", () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "No token proporcionado.",
      });
    });

    it("debería devolver un error si el token es inválido", () => {
      const req = {
        headers: {
          authorization: "Bearer invalidToken",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error("Invalid token"), null);
      });

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token inválido.",
        error: expect.any(Error),
      });
    });

    it("debería pasar al siguiente middleware si el token es válido", () => {
      const req = {
        headers: {
          authorization: "Bearer validToken",
        },
      };
      const res = {};
      const next = jest.fn();

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1, is_admin: true });
      });

      verifyToken(req, res, next);

      expect(req.userId).toBe(1);
      expect(req.isAdmin).toBe(true);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("isAdmin", () => {
    it("debería devolver un error si el usuario no es administrador", () => {
      const req = { isAdmin: false };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Acceso denegado. se requieren privilegios de administrador para esta accion.",
      });
    });

    it("debería pasar al siguiente middleware si el usuario es administrador", () => {
      const req = { isAdmin: true };
      const res = {};
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
