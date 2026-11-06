import { Op } from "sequelize";
import { Videojuego } from "../models/Videojuego.js";
import { sequelize } from "../db.js";
import { Compra } from "../models/Compra.js";
import { DetalleCompra } from "../models/DetalleCompra.js";
import { Usuario } from "../models/Usuario.js";

// REGISTRAR COMPRA

export const createPurchase = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one game is required",
      });
    }

    const gameIds = [];

    for (const item of items) {
      if (
        !item ||
        typeof item !== "object" ||
        !Number.isInteger(item.gameId) ||
        item.gameId <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          message: "Each item must have a valid game ID and quantity",
        });
      }

      if (gameIds.includes(item.gameId)) {
        return res.status(400).json({
          message: "Duplicate games are not allowed",
        });
      }

      gameIds.push(item.gameId);
    }

    const games = await Videojuego.findAll({
      where: {
        id: {
          [Op.in]: gameIds,
        },
      },
    });

    if (games.length !== gameIds.length) {
      return res.status(404).json({
        message: "One or more games were not found",
      });
    }

    let totalCents = 0;

    const details = items.map((item) => {
      const game = games.find((game) => game.id === item.gameId);

      const unitPriceCents = Math.round(Number(game.price) * 100);

      totalCents += unitPriceCents * item.quantity;

      return {
        gameId: game.id,
        quantity: item.quantity,
        unitPrice: (unitPriceCents / 100).toFixed(2),
      };
    });

    const purchase = await sequelize.transaction(async (transaction) => {
      const newPurchase = await Compra.create(
        {
          date: new Date(),
          total: (totalCents / 100).toFixed(2),
          status: "pending",
          userId,
        },
        { transaction },
      );

      const purchaseDetails = details.map((detail) => ({
        ...detail,
        purchaseId: newPurchase.id,
      }));

      await DetalleCompra.bulkCreate(purchaseDetails, { transaction });

      return newPurchase;
    });

    return res.status(201).json({
      message: "Purchase created successfully",
      purchase: {
        id: purchase.id,
        userId: purchase.userId,
        date: purchase.date,
        total: purchase.total,
        status: purchase.status,
        details,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error creating purchase",
    });
  }
};

// HISTORIAL DE COMPRAS

export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Compra.findAll({
      where: { userId },
      include: [
        {
          model: DetalleCompra,
          include: [
            {
              model: Videojuego,
            },
          ],
        },
      ],
      order: [["date", "DESC"]],
    });

    return res.status(200).json(purchases);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error retrieving purchase history",
    });
  }
};

// CONSULTAR TODAS LAS COMPRAS

export const getAllPurchases = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const filters = {};

    if (userId !== undefined) {
      const parsedUserId = Number(userId);

      if (
        !/^\d+$/.test(userId) ||
        !Number.isInteger(parsedUserId) ||
        parsedUserId <= 0
      ) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }

      filters.userId = parsedUserId;
    }

    if (date !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const parsedDate = new Date(`${date}T00:00:00.000Z`);

      if (
        typeof date !== "string" ||
        !dateRegex.test(date) ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
      ) {
        return res.status(400).json({
          message: "Invalid date. Use YYYY-MM-DD format",
        });
      }

      const startDate = new Date(`${date}T00:00:00.000-03:00`);
      const endDate = new Date(startDate);

      endDate.setUTCDate(endDate.getUTCDate() + 1);

      filters.date = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    const purchases = await Compra.findAll({
      where: filters,
      include: [
        {
          model: Usuario,
          attributes: ["id", "name", "email"],
        },
        {
          model: DetalleCompra,
          include: [
            {
              model: Videojuego,
            },
          ],
        },
      ],
      order: [["date", "DESC"]],
    });

    return res.status(200).json(purchases);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error retrieving purchases",
    });
  }
};

// MODIFICAR ESTADO DE COMPRA

export const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "paid", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid purchase status",
      });
    }

    const purchase = await Compra.findByPk(id);

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found",
      });
    }

    purchase.status = status;

    await purchase.save();

    return res.status(200).json({
      message: "Purchase status updated successfully",
      purchase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error updating purchase status",
    });
  }
};
