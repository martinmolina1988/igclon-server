const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    public_id: {
        type: String,
        require: true
    },
    secure_url: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Publication", PublicationSchema);
