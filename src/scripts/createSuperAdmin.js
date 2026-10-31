import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcrypt";

import { sequelize } from "../db.js";
import { Usuario } from "../models/Usuario.js";
import { Rol } from "../models/Rol.js";

const rl = readline.createInterface({ input, output });

const createSuperAdmin = async () => {
    try {
        const name = await rl.question("Name: ");
        const email = await rl.question("Email: ");
        const password = await rl.question("Password: ");

        if (!name.trim() || !email.trim() || !password) {
            console.log("All fields are required.");
            return;
        }

        const existingUser = await Usuario.findOne({
            where: {email: email.trim()}
        });

        if (existingUser) {
            console.log("This email is already registered.");
            return;
        }

        const superAdminRole = await Rol.findOne({
            where: { name: "superadmin" }
        });

        if (!superAdminRole) {
            console.log("Superadmin role not found");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Usuario.create({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            roleId: superAdminRole.id
        });

        console.log("Superadmin created succesfully!");
        console.log(`User ID: ${newUser.id}`);
        console.log(`Email: ${newUser.email}`);

    } catch (error) {
        console.error("Error creating superadmin:", error);
    } finally {
        rl.close();
        await sequelize.close();
    }
};

createSuperAdmin();