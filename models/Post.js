const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: String,
    body: String,
    createdBy: String,
    active: Boolean,
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [Number]
    }
});

module.exports = mongoose.model("Post", PostSchema);
