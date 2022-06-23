const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    guildID: { type: String, required: true },
    coins: { type: Number, default: 0 },
    bank: { type: Number },
});

const model = mongoose.model("coins", profileSchema);

module.exports = model;

