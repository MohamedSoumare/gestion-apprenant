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
  '/students/add',
  handleValidationErrors,
  createValidators,
  studentController.addStudent
);

router.put(
  '/students/update/:id',
  handleValidationErrors,
  updateValidators,
  studentController.updateStudent
);

router.get(
  '/students/:id',
  handleValidationErrors,
  studentController.getStudentById
);

router.delete(
  '/students/delete/:id',
  handleValidationErrors,
  deleteValidators,
  studentController.deleteStudent
);

router.get(
  '/students',
  handleValidationErrors,
  studentController.getAllStudents
);

export default router;
