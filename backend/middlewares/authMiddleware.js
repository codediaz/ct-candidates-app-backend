const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado: Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Acceso denegado: Usuario no autenticado" });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado: Se requiere rol de administrador" });
    }
    next();
};
