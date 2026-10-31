import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { Usuario } from "../models/Usuario.js";
import { Rol } from "../models/Rol.js";

// REGISTRAR USUARIO

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await Usuario.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const clientRole = await Rol.findOne({
            where: { name: "client" }
        });

        if (!clientRole) {
            return res.status(500).json({
                message: "Client role not configured"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Usuario.create({
            name,
            email,
            password: hashedPassword,
            roleId: clientRole.id
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                roleId: newUser.roleId
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error registering user"
        });
    }
}

// LOGIN USUARIO

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await Usuario.findOne({
            where: { email }
        });

        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
             return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                roleId: user.roleId
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successfull",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roleId: user.roleId
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error logging in"
        });
    }
};

// CREAR ADMIN

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await Usuario.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const adminRole = await Rol.findOne({
            where: { name: "admin" }
        });

        if (!adminRole) {
            return res.status(500).json({
                message: "Admin role not configured"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Usuario.create({
            name,
            email,
            password: hashedPassword,
            roleId: adminRole.id
        });

        return res.status(201).json({
            message: "Admin created successfully",
            user: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
                roleId: newAdmin.roleId
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error creating admin"
        });
    }
};