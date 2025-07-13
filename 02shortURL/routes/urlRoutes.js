const express = require('express');
const { handleCreateShortUrl, handleGetRedirectUrl } = require('../controllers/url.controllers');

const router = express.Router();

router.post('/', handleCreateShortUrl);




module.exports = router;
