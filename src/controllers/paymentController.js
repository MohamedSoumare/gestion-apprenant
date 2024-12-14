import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Fonction pour lister tous les paiements
export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        registration: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                fullName: true,
              },
            },
            module: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements :', error);
    res.status(500).json({
      error: 'Une erreur est survenue lors de la récupération des paiements.',
    });
  }
};

// Fonction pour récupérer un paiement spécifique
export const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        registration: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                fullName: true,
              },
            },
            module: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Paiement non trouvé.' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement :', error);
    res.status(500).json({
      error: 'Une erreur est survenue lors de la récupération du paiement.',
    });
  }
};

// Fonction pour créer un paiement
export const createPayment = async (req, res) => {
  const {
    paymentDate,
    amount,
    payer,
    payerNumber,
    paymentMode,
    registrationId,
    moduleId,
    studentId,
  } = req.body;

  // Validation des champs obligatoires
  if (
    !paymentDate ||
    !amount ||
    !payer ||
    !payerNumber ||
    !paymentMode ||
    !registrationId ||
    !moduleId ||
    !studentId
  ) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  // Validation du montant payé (doit être un nombre positif)
  if (amount <= 0) {
    return res
      .status(400)
      .json({ error: 'Le montant du paiement doit être un nombre positif.' });
  }

  // Validation du numéro de payeur (uniquement des chiffres)
  const phoneRegex = /^[0-9]+$/;
  if (!phoneRegex.test(payerNumber)) {
    return res.status(400).json({
      error: 'Le numéro de payeur doit contenir uniquement des chiffres.',
    });
  }

  try {
    // Récupérer la registration associée à l'ID
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return res.status(404).json({ error: 'Inscription introuvable.' });
    }

    // Affecter registration.amount à registration.rest
    if (registration.rest === null || registration.rest === undefined) {
      registration.rest = registration.amount;
    }
    // Vérification que le montant ne dépasse pas le montant restant
    if (amount > registration.rest) {
      return res.status(400).json({
        error:
          'Le montant du paiement ne doit pas être supérieur au montant restant.',
      });
    }

    // Calculer le nouveau montant restant
    const newRest = registration.rest - amount;

    // Mettre à jour le champ 'rest' de la registration
    await prisma.registration.update({
      where: { id: registrationId },
      data: { rest: newRest },
    });

    // Créer le paiement
    const payment = await prisma.payment.create({
      data: {
        paymentDate: new Date(paymentDate),
        amount,
        payer,
        payerNumber,
        paymentMode,
        registrationId,
        moduleId,
        studentId,
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Erreur lors de la création du paiement :', error);
    res.status(500).json({
      error: 'Une erreur est survenue lors de la création du paiement.',
    });
  }
};

// Fonction pour mettre à jour un paiement
export const updatePayment = async (req, res) => {
    const {
      paymentDate,
      amount,
      payer,
      payerNumber,
      paymentMode,
      registrationId,
      moduleId,
      studentId,
    } = req.body;
  
    const { paymentId } = req.params;
  
    // Validation des champs obligatoires
    if (!paymentId) {
      return res.status(400).json({ error: "L'ID du paiement est requis." });
    }
  
  
    // Validation du montant payé (doit être un nombre positif)
    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Le montant du paiement doit être un nombre positif." });
    }
  
    // Validation du numéro de payeur (uniquement des chiffres)
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(payerNumber)) {
      return res.status(400).json({
        error: "Le numéro de payeur doit contenir uniquement des chiffres.",
      });
    }
  
    try {
      // Récupérer le paiement existant
      const existingPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });
  
      if (!existingPayment) {
        return res.status(404).json({ error: "Paiement introuvable." });
      }
  
      // Récupérer la registration associée à l'ID
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
      });
  
      if (!registration) {
        return res.status(404).json({ error: "Inscription introuvable." });
      }
  
      // Affecter registration.amount à registration.rest si nécessaire
      if (registration.rest === null || registration.rest === undefined) {
        registration.rest = registration.amount;
      }
  
      // Calculer le montant à ajuster
      const amountDifference = amount - existingPayment.amount;
  
      // Vérification que le nouveau montant ne dépasse pas le montant restant
      if (amountDifference > registration.rest) {
        return res.status(400).json({
          error:
            "Le montant du paiement ne doit pas être supérieur au montant restant.",
        });
      }
  
      // Mettre à jour le champ 'rest' de la registration
      const newRest = registration.rest - amountDifference;
      await prisma.registration.update({
        where: { id: registrationId },
        data: { rest: newRest },
      });
  
      // Mettre à jour le paiement
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          paymentDate: new Date(paymentDate),
          amount,
          payer,
          payerNumber,
          paymentMode,
          registrationId,
          moduleId,
          studentId,
        },
      });
  
      res.status(200).json(updatedPayment);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paiement :", error);
      res.status(500).json({
        error: "Une erreur est survenue lors de la mise à jour du paiement.",
      });
    }
  };
  // Fonction pour supprimer un paiement
export const deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPayment = await prisma.payment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: 'Paiement supprimé avec succès.',
      deletedPayment,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du paiement :', error);
    res.status(500).json({
      error: 'Une erreur est survenue lors de la suppression du paiement.',
    });
  }
};
