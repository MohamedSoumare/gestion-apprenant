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
  const { studentId, moduleId, startDate, endDate, amount } = req.body;

  try {
    const registration = await prisma.registration.create({
      data: {
        studentId,
        moduleId,
        startDate,
        endDate,
        amount,
      },
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error("Erreur lors de la création de l'inscription :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la création de l'inscription." });
  }
};

// Fonction pour mettre à jour une inscription
export const updateRegistration = async (req, res) => {
  const { id } = req.params;
  const { studentId, moduleId, startDate, endDate, amount } = req.body;

  try {
    const updatedRegistration = await prisma.registration.update({
      where: { id: parseInt(id) },
      data: {
        studentId,
        moduleId,
        startDate,
        endDate,
        amount,
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
    const deletedRegistration = await prisma.registration.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Inscription supprimée avec succès.", deletedRegistration });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'inscription :", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la suppression de l'inscription." });
  }
};