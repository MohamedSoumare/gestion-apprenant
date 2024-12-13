import express from 'express';
// src/routes/registrationRoutes.js
import { getAllRegistrations, getRegistrationById, createRegistration, updateRegistration, deleteRegistration } from '../controllers/registrationController.js';


const router = express.Router();

router.get('/', getAllRegistrations);          // Récupérer toutes les inscriptions
router.get('/:id', getRegistrationById);       // Récupérer une inscription par ID
router.post('/', createRegistration);          // Créer une nouvelle inscription
router.put('/:id', updateRegistration);        // Mettre à jour une inscription par ID
router.delete('/:id', deleteRegistration);     // Supprimer une inscription par ID

export default router;