import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Fonction pour récupérer tous les modules
export const getAllModules = async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        registrations: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(modules);
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des modules.' });
  }
};

// Fonction pour récupérer un module par ID
export const getModuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const module = await prisma.module.findUnique({
      where: { id: parseInt(id) },
      include: {
        registrations: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!module) {
      return res.status(404).json({ error: 'Module non trouvé.' });
    }

    res.status(200).json(module);
  } catch (error) {
    console.error('Erreur lors de la récupération du module:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du module.' });
  }
};

// Fonction pour créer un nouveau module
export const createModule = async (req, res) => {
  const { name, duration, price, status } = req.body;

  try {
    const module = await prisma.module.create({
      data: {
        name,
        duration:parseInt(duration, 10),
        price,
        status,
      },
    });

    res.status(201).json(module);
  } catch (error) {
    console.error('Erreur lors de la création du module:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la création du module.' });
  }
};

// Fonction pour mettre à jour un module
export const updateModule = async (req, res) => {
  const { id } = req.params;
  const { name, duration, price, status } = req.body;

  try {
    const updatedModule = await prisma.module.update({
      where: { id: parseInt(id) },
      data: {
        name,
        duration,
        price,
        status,
      },
    });

    res.status(200).json(updatedModule);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du module:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du module.' });
  }
};

// Fonction pour supprimer un module
export const deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedModule = await prisma.module.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Module supprimé avec succès.', deletedModule });
  } catch (error) {
    console.error('Erreur lors de la suppression du module:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du module.' });
  }
};
