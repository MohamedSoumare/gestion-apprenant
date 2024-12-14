import express from 'express';
import { getAllModules, getModuleById, createModule, updateModule, deleteModule } from '../controllers/moduleController.js';
import {
    createModuleValidators,
    updateModuleValidators,
    deleteModuleValidators,
  } from '../validators/moduleValidators.js';
  
const router = express.Router();

router.get('/', getAllModules);         
router.get('/:id', getModuleById);      
router.post('/', createModuleValidators, createModule);          // Créer un nouveau module
router.put('/:id', updateModuleValidators, updateModule);        // Mettre à jour un module par ID
router.delete('/:id', deleteModuleValidators,deleteModule);     // Supprimer un module par ID

export default router;
