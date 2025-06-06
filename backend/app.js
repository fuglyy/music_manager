const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const groupRoutes = require('./routes/groupRoutes');
const songRoutes = require('./routes/songRoutes');
const tourRoutes = require('./routes/tourRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes')
const memberRoutes = require('./routes/memberRoutes')
const albumRoutes = require('./routes/albumRoutes')
const cityRoutes = require('./routes/cityRoutes')
const tourCityRoutes = require('./routes/tourCityRoutes')
const authRoutes = require('./routes/authRoutes')
const adminUserRoutes = require('./routes/adminUserRoutes');

const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Music Manager API',
      version: '1.0.0',
      description: 'Документация для курсового проекта',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Локальный сервер' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // Где искать аннотации
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

app.use('/api', groupRoutes);
app.use('/api', songRoutes);
app.use('/api', tourRoutes);
app.use('/api/analytics', analyticsRoutes)
app.use('/api', memberRoutes);
app.use('/api', albumRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api', tourCityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', adminUserRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
  });

app.listen(3000, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});