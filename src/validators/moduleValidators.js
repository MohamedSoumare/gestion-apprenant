import { check, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Validateurs pour créer un module
export const createModuleValidators = [
  check('name')
    .trim()
    .notEmpty().withMessage('Le nom du module est requis.')
    .isLength({ min: 3, max: 50 }).withMessage('Le nom doit contenir entre 3 et 50 caractères.'),
  check('duration')
    .isInt({ min: 1 }).withMessage('La durée doit être un entier supérieur à 0.'),
  check('price')
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif.'),
  handleValidationErrors,
];

// Validateurs pour mettre à jour un module
export const updateModuleValidators = [
  check('id')
    .notEmpty().withMessage('L\'ID du module est requis.')
    .isNumeric().withMessage('L\'ID doit être un nombre.')
    .custom(async (id) => {
      const moduleExists = await prisma.module.findUnique({ where: { id: parseInt(id, 10) } });
      if (!moduleExists) {
        throw new Error('Aucun module trouvé avec cet ID.');
      }
      return true;
    }),
  check('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Le nom doit contenir entre 3 et 50 caractères.'),
  check('duration')
    .optional()
    .isInt({ min: 1 }).withMessage('La durée doit être un entier supérieur à 0.'),
  check('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif.'),

  handleValidationErrors,
];

// Validateurs pour supprimer un module
export const deleteModuleValidators = [
  check('id')
    .notEmpty().withMessage('L\'ID du module est requis.')
    .isNumeric().withMessage('L\'ID doit être un nombre.')
    .custom(async (id) => {
      const moduleExists = await prisma.module.findUnique({ where: { id: parseInt(id, 10) } });
      if (!moduleExists) {
        throw new Error('Aucun module trouvé avec cet ID.');
      }
      return true;
    }),
  handleValidationErrors,
];
