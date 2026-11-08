
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcrypt";

import { sequelize } from "../db.js";
import { Usuario } from "../models/Usuario.js";
import { isValidPassword } from "../utils/validators.js";

const rl = readline.createInterface({ input, output });

const resetSuperAdminPassword = async () => {
    try {
        const email = await rl.question("Superadmin email: ");
        const password = await rl.question("New password: ");

        if (!email.trim() || !password) {
            console.log("All fields are required.");
            return;
        }

        if (!isValidPassword(password)) {
            console.log("Invalid password format.");
            return;
        }

        const user = await Usuario.findOne({
            where: { email: email.trim() }
        });

        if (!user || user.roleId !== 1) {
            console.log("Superadmin not found.");
            return;
        }

        user.password = await bcrypt.hash(password, 10);

        await user.save();

        console.log("Superadmin password updated successfully!");
        console.log(`User ID: ${user.id}`);
        console.log(`Email: ${user.email}`);

    } catch (error) {
        console.error("Error resetting password:", error);
    } finally {
        rl.close();
        await sequelize.close();
    }
};

resetSuperAdminPassword();
