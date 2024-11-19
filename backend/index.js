require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
app.use('/reservations', reservationRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación API: http://localhost:${PORT}/api-docs`);
});
