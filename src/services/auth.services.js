import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { Usuario } from "../models/Usuario.js";
import { Rol } from "../models/Rol.js";
import { Compra } from "../models/Compra.js";
import { isValidEmail, isValidName, isValidPassword } from "../utils/validators.js";


// REGISTRAR USUARIO

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!isValidName(name) || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: "Password must have at least 8 characters, one uppercase and one lowercase letter"
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

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
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

        if (!isValidName(name) || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: "Password must have at least 8 characters, one uppercase and one lowercase letter"
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

// CONSULTAR TODOS LOS USUARIOS

export const getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            attributes: ['id', 'name', 'email', 'roleId']
        });

        return res.status(200).json(users);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error retrieving users"
        });
    }
};

// CONSULTAR USUARIO POR ID

export const getUserbyId = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id , {
            attributes: ['id', 'name', 'email', 'roleId']
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error retrieving user"
        });
    }
};

// ACTUALIZAR USUARIO

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, roleId } = req.body;

        const user = await Usuario.findByPk(id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name === undefined && email === undefined && password === undefined && roleId === undefined) {
            return res.status(400).json({
                message: "At least one field is required"
            });
        }

        if (roleId !== undefined && req.user.roleId !== 1) {
            return res.status(403).json({
                message: "Only superadmin can modify user roles"
            });
        }

        if (name !== undefined) {
            if(!isValidName(name)) {
                return res.status(400).json({
                    message: "Invalid name"
                });
            }
            user.name = name;
        }

        if (email !== undefined) {
            if(!isValidEmail(email)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }

            const existingUser = await Usuario.findOne({
                where: { email }
            });

            if (existingUser && existingUser.id !== user.id) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            user.email = email;
        }

        if (password !== undefined) {
            if(!isValidPassword(password)) {
                return res.status(400).json({
                    message: "Password must have at least 8 characters, one uppercase and one lowercase letter"
                });
            }

            user.password = await bcrypt.hash(password, 10);
        }

        if(roleId !== undefined) {
            if(!Number.isInteger(roleId) || roleId <= 0) {
                return res.status(400).json({
                    message: "Invalid role ID"
                });
            }

            const role = await Rol.findByPk(roleId);

            if (!role) {
                return res.status(404).json({
                    message: "Role not found"
                });
            }

            user.roleId = roleId;
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roleId: user.roleId
            }
        });

    } catch (error) {
         console.error(error);

        return res.status(500).json({
            message: "Error updating user"
        });
    }
};

// ELIMINAR USUARIO

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const purchases = await Compra.findOne({
            where: { userId: id }
        });

        if (purchases) {
            return res.status(409).json({
                message: "Cannot delete user because they have associated purchases"
            });
        }

        await user.destroy();

        return res.status(200).json({
            message: "User deleted succesfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error deleting user"
        });
    }
};