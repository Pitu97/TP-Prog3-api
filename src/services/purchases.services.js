import { Op } from "sequelize";
import { Videojuego } from "../models/Videojuego.js";
import { sequelize } from "../db.js";
import { Compra } from "../models/Compra.js";
import { DetalleCompra } from "../models/DetalleCompra.js";

// REGISTRAR COMPRA

export const createPurchase = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.id;

        if(!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "At least one game is required"
            });
        }

        const gameIds = [];

        for (const item of items) {
            if(!item || typeof item !== "object" || !Number.isInteger(item.gameId) || item.gameId <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0) {
               return res.status(400).json({
                    message: "Each item must have a valid game ID and quantity"
                }); 
            }

            if (gameIds.includes(item.gameId)) {
                return res.status(400).json({
                    message: "Duplicate games are not allowed"
                });
            }

            gameIds.push(item.gameId);
        }

        const games = await Videojuego.findAll({
            where: {
                id: {
                    [Op.in]: gameIds
                }
            }
        });

        if (games.length !== gameIds.length) {
            return res.status(404).json({
                message: "One or more games were not found"
            });
        }

        let totalCents = 0;

        const details = items.map(item => {
            const game = games.find(
                game => game.id === item.gameId
            );

            const unitPriceCents = Math.round(
                Number(game.price) * 100
            );

            totalCents += unitPriceCents * item.quantity;

            return {
                gameId: game.id,
                quantity: item.quantity,
                unitPrice: (unitPriceCents / 100).toFixed(2)
            };
        });

        const purchase = await sequelize.transaction(
            async (transaction) => {
                const newPurchase = await Compra.create({
                    date: new Date(),
                    total: (totalCents / 100).toFixed(2),
                    status: "pending",
                    userId
                }, { transaction });

                const purchaseDetails = details.map(detail => ({
                    ...detail,
                    purchaseId: newPurchase.id
                }));

                await DetalleCompra.bulkCreate(
                    purchaseDetails,
                    { transaction }
                );

                return newPurchase;
            }
        );

        return res.status(201).json({
            message: "Purchase created successfully",
            purchase: {
                id: purchase.id,
                userId: purchase.userId,
                date: purchase.date,
                total: purchase.total,
                status: purchase.status,
                details
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error creating purchase"
        });
    }
};