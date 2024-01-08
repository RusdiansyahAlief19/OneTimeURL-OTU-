const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const linkDatabase = {};

app.use(cors());
app.use(bodyParser.json());

// Update the /generateLink route to only accept and use the password
// Update the /generateLink route to only accept and use the password
app.post('/generateLink', (req, res) => {
    try {
        const { password } = req.body;
        const linkToken = crypto.randomBytes(16).toString('hex');
        linkDatabase[linkToken] = { password, clicks: 0 };
        const link = `http://localhost:3000/Halaman2?token=${linkToken}`;
        console.log(`Data from Halaman1: Password - ${password}`);
        res.json({ link });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
});

// ...

app.get('/Halaman2', (req, res) => {
    const linkToken = req.query.token;
    const { password } = linkDatabase[linkToken] || {};

    if (password && linkDatabase[linkToken].clicks >= 0) {
        linkDatabase[linkToken].clicks--;

        // Send the text as part of an HTML response with styling
        res.send(`<div style="color: black; font-size: 25px;">${password}</div>`);
    } else {
        res.send('Link has expired or invalid.');
    }
});

// ...




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
