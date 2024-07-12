const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/proxy', (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('Missing url parameter');
    }
    request({ url, encoding: null }, (error, response, body) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.set('Content-Type', response.headers['content-type']);
        res.send(body);
    });
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
