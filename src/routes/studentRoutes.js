import express from 'express';
import studentController from '../controllers/studentControllers.js';
import {
  handleValidationErrors,
  createValidators,
  updateValidators,
  deleteValidators,
} from '../validators/studentValidators.js';

const router = express.Router();

router.post(
  '/',
  handleValidationErrors,
  createValidators,
  studentController.addStudent
);

router.put(
  '/:id',
  handleValidationErrors,
  updateValidators,
  studentController.updateStudent
);

router.get(
  '/:id',
  handleValidationErrors,
  studentController.getStudentById
);

router.delete(
  '/:id',
  handleValidationErrors,
  deleteValidators,
  studentController.deleteStudent
);

router.get(
  '/',
  handleValidationErrors,
  studentController.getAllStudents
);

export default router;
