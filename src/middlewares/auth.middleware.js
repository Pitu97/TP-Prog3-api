import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                message: "Token not provided"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { roleId } = req.user;

            if(!allowedRoles.includes(roleId)) {
                return res.status(403).json({
                    message: "You do not have permission to perform this action"
                });
            }

            next();

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Authorization error"
            });
        }
    };
};