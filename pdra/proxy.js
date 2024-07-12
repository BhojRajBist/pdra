const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('No URL provided');
    }

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
