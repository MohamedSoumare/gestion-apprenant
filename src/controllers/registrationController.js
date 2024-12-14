import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        module: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Erreur lors de la récupération des inscriptions :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la récupération des inscriptions." });
  }
};
export const getRegistrationById = async (req, res) => {
  const { id } = req.params;
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        module: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        },
      },
    });

    if (!registration) {
      return res.status(404).json({ error: "Inscription non trouvée." });
    }

    res.status(200).json(registration);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'inscription :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'inscription." });
  }
};

// Fonction pour créer une nouvelle inscription
export const createRegistration = async (req, res) => {
  try {
    const { dateRegister,studentId, moduleId, startDate, amount } = req.body;

    // Vérifier si l'étudiant existe
    const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
    if (!studentExists) {
      return res.status(400).json({ error: "L'étudiant spécifié n'existe pas." });
    }

    // Vérifier si le module existe
    const moduleExists = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!moduleExists) {
      return res.status(400).json({ error: "Le module spécifié n'existe pas." });
    }

    if (dateRegister && isNaN(Date.parse(dateRegister))) {
      return res.status(400).json({ error: "La date d'enregistrement spécifiée n'est pas valide." });
    }

    // Vérifier si startDate est une date valide
    if (!startDate || isNaN(Date.parse(startDate))) {
      return res.status(400).json({ error: "La date de début spécifiée n'est pas valide." });
    }

    // Calculer la date de fin
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + moduleExists.duration);

    // Créer l'inscription
    const newRegistration = await prisma.registration.create({
      data: {
        studentId,
        moduleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        amount,
        dateRegister: new Date(dateRegister),
      },
    });

    res.status(201).json(newRegistration);
  } catch (error) {
    console.error("Erreur lors de la création de l'inscription :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la création de l'inscription." });
  }
};

// Fonction pour mettre à jour une inscription
export const updateRegistration = async (req, res) => {
  const { id } = req.params;
  const { studentId, moduleId, startDate, endDate, amount, dateRegister } = req.body;

  try {
    // Vérifier si l'inscription existe
    const registrationExists = await prisma.registration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!registrationExists) {
      return res.status(404).json({ error: "L'inscription spécifiée n'existe pas." });
    }

    // Vérifier si l'étudiant existe
    if (studentId) {
      const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
      if (!studentExists) {
        return res.status(400).json({ error: "L'étudiant spécifié n'existe pas." });
      }
    }

    // Vérifier si le module existe
    if (moduleId) {
      const moduleExists = await prisma.module.findUnique({ where: { id: moduleId } });
      if (!moduleExists) {
        return res.status(400).json({ error: "Le module spécifié n'existe pas." });
      }
    }

    // Vérifier si startDate est une date valide
    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({ error: "La date de début spécifiée n'est pas valide." });
    }

    // Vérifier si endDate est une date valide
    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: "La date de fin spécifiée n'est pas valide." });
    }

    // Vérifier si dateRegister est une date valide
    if (dateRegister && isNaN(Date.parse(dateRegister))) {
      return res.status(400).json({ error: "La date d'enregistrement spécifiée n'est pas valide." });
    }

    // Mettre à jour l'inscription
    const updatedRegistration = await prisma.registration.update({
      where: { id: parseInt(id) },
      data: {
        studentId,
        moduleId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        amount,
        dateRegister: dateRegister ? new Date(dateRegister) : undefined,
      },
    });

    res.status(200).json(updatedRegistration);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'inscription :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de l'inscription." });
  }
};

// Fonction pour supprimer une inscription
export const deleteRegistration = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier s'il existe des paiements liés à cette inscription
    const paymentsLinked = await prisma.payment.findMany({
      where: { registrationId: parseInt(id) },
    });

    if (paymentsLinked.length > 0) {
      return res.status(400).json({ error: "Impossible de supprimer l'inscription car des paiements y sont liés." });
    }

    // Supprimer l'inscription si aucun paiement n'est lié
    const deletedRegistration = await prisma.registration.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Inscription supprimée avec succès.", deletedRegistration });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'inscription :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la suppression de l'inscription." });
  }
};
