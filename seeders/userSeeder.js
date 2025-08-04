const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const {UserModel} = require("../models");

const UserSeeder = async () => {
    try {
        const users = [
            { name: "User1", devices: ["device1", "device2"] },
            { name: "User2", devices: ["device3","device4"] },
            { name: "User3", devices: ["device1"] },
        ];

        await UserModel.deleteMany({});
        await UserModel.insertMany(users);
        console.log("User seeding completed successfully.");
    } catch (error) {
        console.error("Error during user seeding:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

UserSeeder()