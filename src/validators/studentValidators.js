import { check, validationResult } from 'express-validator';
import prisma from '../config/PrismaClient.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

// Validateurs pour la création
export const createValidators = [
  check('fullName')
    .notEmpty()
    .withMessage('Veuillez entrer un nom complet.')
    .matches(/^[A-Za-z]+( [A-Za-z]+)*$/)
    .withMessage('Le nom complet doit contenir uniquement des lettres et des espaces.')
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom complet doit avoir entre 3 et 50 caractères.'),

  check('phoneNumber')
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis.')
    .isNumeric()
    .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres.')
    .isLength({ min: 8, max: 8 })
    .withMessage('Le numéro de téléphone doit comporter exactement 8 chiffres.'),

   // Ajout d'une vérification de l'email existant
check('email')
.notEmpty()
.withMessage('L\'email est requis.')
.isEmail()
.withMessage('Veuillez entrer une adresse email valide.')
.custom(async (email) => {

    const existingStudent = await prisma.student.findFirst({ where: { email } });
    if (existingStudent) {
      throw new Error('Cet email est déjà utilisé. Veuillez vérifier vos informations.');
    }
    return true;
}),

  check('address')
    .optional()
    .isLength({ max: 100 })
    .withMessage('L\'adresse ne doit pas dépasser 100 caractères.'),

  check('tutor')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Le nom du tuteur ne doit pas dépasser 50 caractères.'),

  check('status')
    .notEmpty()
    .withMessage('Le statut est requis.')
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Le statut doit être "active" ou "inactive".'),
];

// Validateurs pour la mise à jour
export const updateValidators = [
  check('id')
    .notEmpty()
    .withMessage('L\'ID de l\'apprenant est requis.')
    .isNumeric()
    .withMessage('L\'ID doit être un nombre.')
    .custom(async (id) => {
      const student = await prisma.student.findUnique({ where: { id: parseInt(id, 10) } });
      if (!student) {
        throw new Error('Aucun apprenant trouvé avec cet ID.');
      }
      return true;
    }),

  check('fullName')
    .optional()
    .matches(/^[A-Za-z]+( [A-Za-z]+)*$/)
    .withMessage('Le nom complet doit contenir uniquement des lettres et des espaces.')
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom complet doit avoir entre 3 et 50 caractères.'),

  check('phoneNumber')
    .optional()
    .isNumeric()
    .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres.')
    .isLength({ min: 8, max: 8 })
    .withMessage('Le numéro de téléphone doit comporter exactement 8 chiffres.'),

  check('email')
    .optional()
    .isEmail()
    .withMessage('Veuillez entrer une adresse email valide.')
    .custom(async (email, { req }) => {
      const studentId = parseInt(req.params.id, 10);
      const existingStudent = await prisma.student.findFirst({
        where: {
          email,
          id: { not: studentId },
        },
      });
      if (existingStudent) {
        throw new Error('Cet email est déjà utilisé par un autre apprenant.');
      }
      return true;
    }),

  check('address')
    .optional()
    .isLength({ max: 100 })
    .withMessage('L\'adresse ne doit pas dépasser 100 caractères.'),

  check('tutor')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Le nom du tuteur ne doit pas dépasser 50 caractères.'),

  check('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Le statut doit être "active" ou "inactive".'),
];

// Validateurs pour la suppression
export const deleteValidators = [
  check('id')
    .notEmpty()
    .withMessage('L\'ID de l\'apprenant est requis pour la suppression.')
    .isNumeric()
    .withMessage('L\'ID doit être un nombre.')
    .custom(async (id) => {
      const student = await prisma.student.findUnique({ where: { id: parseInt(id, 10) } });
      if (!student) {
        throw new Error('Aucun apprenant trouvé avec cet ID.');
      }
      return true;
    }),
];
