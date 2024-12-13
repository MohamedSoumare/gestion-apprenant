import prisma from '../config/PrismaClient.js'; // Assurez-vous que le chemin est correct
import { validationResult } from 'express-validator';

const studentController = {
  // Ajouter un étudiant
  addStudent: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Échec de la validation des données.',
        errors: errors.array().map((err) => err.msg),
      });
    }
  
    const { fullName, phoneNumber, email, address, tutor, status } = req.body;
  
    try {
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [{ phoneNumber }, { email }],
        },
      });
  
      if (existingStudent) {
        const duplicateField = existingStudent.email === email ? 'email' : 'numéro de téléphone';
        return res.status(400).json({
          message: `Le ${duplicateField} est déjà utilisé.`,
        });
      }
  
      const student = await prisma.student.create({
        data: {
          fullName,
          phoneNumber,
          email,
          address,
          tutor,
          status,
        },
      });
  
      return res.status(201).json({
        message: 'Apprenant ajouté avec succès.',
        student,
      });
    } catch (error) {
      console.error('Erreur lors de la création de l’apprenant :', error);
      return res.status(500).json({
        message: 'Erreur interne du serveur. Veuillez réessayer plus tard.',
      });
    }
  },
  
  
  // Mettre à jour un étudiant
  updateStudent: async (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'L’ID de l’apprenant est invalide.' });
    }

    const { fullName, phoneNumber, email, address, tutor, status } = req.body;

    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return res.status(404).json({ error: 'Apprenant non trouvé.' });
      }
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [{ phoneNumber }, { email }],
        },
      });
  
      if (existingStudent) {
        const duplicateField = existingStudent.email === email ? 'email' : 'numéro de téléphone';
        return res.status(400).json({
          message: `Le ${duplicateField} est déjà utilisé.`,
        });
      }

      const updatedData = {};
      if (fullName) updatedData.fullName = fullName.trim();
      if (address) updatedData.address = address.trim();
      if (phoneNumber) updatedData.phoneNumber = phoneNumber;
      if (email) updatedData.email = String(email);
      if (tutor) updatedData.tutor = tutor.trim();
      if (status) updatedData.status = status;

      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: updatedData,
      });

      return res.status(200).json(updatedStudent);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’apprenant :', error.message);

      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Apprenant introuvable.' });
      }

      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  },

  // Récupérer un étudiant par ID
  getStudentById: async (req, res) => {
    const studentId = parseInt(req.params.id, 10);

    try {
      const student = await prisma.student.findFirst({
        where: { id: studentId },
        include: {
          payment: true,
          registration: true,
        },
      });

      if (!student) {
        return res.status(404).json({ error: 'Apprenant non trouvé.' });
      }

      return res.status(200).json(student);
    } catch (error) {
      console.error('Erreur lors de la récupération de l’apprenant :', error.message);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  },

  // Récupérer tous les étudiants
  getAllStudents: async (req, res) => {
    try {
      const students = await prisma.student.findMany({});
      return res.status(200).json(students);
    } catch (error) {
      console.error('Erreur lors de la récupération des apprenants :', error.message);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  },

  // Supprimer un étudiant
  deleteStudent: async (req, res) => {
    const studentId = parseInt(req.params.id, 10);

    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return res.status(404).json({ error: 'Apprenant non trouvé.' });
      }

      // const hasActivePayment = await prisma.payment.findFirst({
      //   where: {
      //     studentId: studentId,
      //     status: {
      //       in: ['CARD', 'BANK_TRANSFER', 'CASH'],
      //     },
      //   },
      // });

      // if (hasActivePayment) {
      //   return res.status(400).json({
      //     errorCode: 'PAYMENT_ACTIVE',
      //     error: 'Impossible de supprimer l’apprenant car il a des paiements actifs.',
      //   });
      // }

      await prisma.student.delete({ where: { id: studentId } });

      return res.status(200).json({ message: 'Apprenant supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l’apprenant :', error.message);

      if (error.code === 'P2025') {
        return res.status(404).json({
          errorCode: 'STUDENT_NOT_FOUND',
          message: 'Apprenant n’existe pas.',
        });
      }

      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  },
};

export default studentController;
