const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    viewHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        ipAddress: {
            type: String,
            default: null
        },
        userAgent: {
            type: String,
            default: null
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('URL', urlSchema);
