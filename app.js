import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import moduleRoutes from './src/routes/moduleRoutes.js';
import registrationRoutes from './src/routes/registrationRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';

import studentRoutes from './src/routes/studentRoutes.js';



dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// CORS Configuration
const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELEstudentRoutesTE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Routes

// Déclaration des routes
app.use('/api/students', studentRoutes);  
app.use('/api/modules', moduleRoutes);
app.use('/api/registrations', registrationRoutes); 
app.use('/api/payments', paymentRoutes); 

// app.use();

// 404 Error for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;
