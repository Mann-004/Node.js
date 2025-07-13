const URL = require('../models/url.models');
const shortid = require('shortid');

async function handleCreateShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });
    const shortId = shortid.generate();
    console.log(shortId);

    await URL.create({
        url: body.url,               
        shortUrl: shortId,           
        redirectURL: body.url,       
        viewHistory: []             
    });
    


    return res.json({ id: shortId })
}

module.exports = {
    handleCreateShortUrl,
}