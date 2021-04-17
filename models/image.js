const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = Schema({
    public_id: {
        type: String,
        require: true
    },
    secure_url: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    }
 
})
module.exports = mongoose.model("Image", ImageSchema);