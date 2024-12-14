import { body, param } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Valider la création d'une inscription
export const createRegistrationValidators = [
  body('studentId')
    .isInt({ gt: 0 })
    .withMessage("L'ID de l'étudiant doit être un entier positif.")
    .custom(async (value) => {
      const studentExists = await prisma.student.findUnique({ where: { id: value } });
      if (!studentExists) {
        throw new Error("L'étudiant spécifié n'existe pas.");
      }
      return true;
    }),
  body('moduleId')
    .isInt({ gt: 0 })
    .withMessage("L'ID du module doit être un entier positif.")
    .custom(async (value) => {
      const moduleExists = await prisma.module.findUnique({ where: { id: value } });
      if (!moduleExists) {
        throw new Error("Le module spécifié n'existe pas.");
      }
      return true;
    }),
  body('startDate')
    .isISO8601()
    .withMessage("La date de début doit être au format  (yyyy-mm-dd)."),
  body('endDate')
    .isISO8601()
    .withMessage("La date de fin doit être au format (yyyy-mm-dd).")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("La date de fin doit être après la date de début.");
      }
      return true;
    }),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage("Le montant doit être un nombre positif."),
];

// Valider la mise à jour d'une inscription
export const updateRegistrationValidators = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage("L'ID de l'inscription doit être un entier positif."),
    body('studentId')
    .isInt({ gt: 0 })
    .withMessage("L'ID de l'étudiant doit être un entier positif.")
    .custom(async (value) => {
      const studentExists = await prisma.student.findUnique({ where: { id: value } });
      if (!studentExists) {
        throw new Error("L'étudiant spécifié n'existe pas.");
      }
      return true;
    }),
  body('moduleId')
    .isInt({ gt: 0 })
    .withMessage("L'ID du module doit être un entier positif.")
    .custom(async (value) => {
      const moduleExists = await prisma.module.findUnique({ where: { id: value } });
      if (!moduleExists) {
        throw new Error("Le module spécifié n'existe pas.");
      }
      return true;
    }),
  body('startDate')
  .optional()
    .isISO8601()
    .withMessage("La date de début doit être au format  (yyyy-mm-dd)."),
  body('endDate')
  .optional()
    .isISO8601()
    .withMessage("La date de fin doit être au format  (yyyy-mm-dd).")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("La date de fin doit être après la date de début.");
      }
      return true;
    }),
  body('amount')
  .optional()
    .isFloat({ gt: 0 })
    .withMessage("Le montant doit être un nombre positif."),
];

// Valider la suppression d'une inscription
export const deleteRegistrationValidators = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage("L'ID de l'inscription doit être un entier positif.")
    .custom(async (value) => {
      const registrationExists = await prisma.registration.findUnique({ where: { id: value } });
      if (!registrationExists) {
        throw new Error("L'inscription spécifiée n'existe pas.");
      }
      return true;
    }),
];
