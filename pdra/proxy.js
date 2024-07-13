const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    console.log(`Fetching: ${url}`); // Log the URL being fetched
    request(
        { url: url, headers: { 'User-Agent': 'Mozilla/5.0' } },
        (error, response, body) => {
            if (error) {
                console.error(`Error fetching ${url}:`, error); // Log the error details
                res.status(500).send('Error fetching the data');
            } else {
                console.log(`Status Code: ${response.statusCode}`); // Log the response status code
                res.send(body);
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});

