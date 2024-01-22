const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const linkDatabase = {};

app.use(cors());
app.use(bodyParser.json());

// Update the /generateLink route to only accept and use the password
// Update the /generateLink route to only accept and use the password
app.post("/generateLink", (req, res) => {
  try {
    const { password } = req.body;
    const linkToken = crypto.randomBytes(16).toString("hex");
    linkDatabase[linkToken] = { password, clicks: 0 };
    const link = `http://localhost:3000/Halaman2?token=${linkToken}`;
    // tidak berpengaruh jika dihapus cuma muncul di terminal
    console.log(`Data from Sender: Data - ${password}`);
    res.json({ link });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ...

app.get("/Halaman2", (req, res) => {
  const linkToken = req.query.token;
  const { password } = linkDatabase[linkToken] || {};

  if (password && linkDatabase[linkToken].clicks >= 0) {
    linkDatabase[linkToken].clicks--;

    // Send the text as part of an HTML response with styling
    res.send(`<html>
        <head>
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                    background-color: white;
                    color:white;
                }
                .password-container {
                    justify-content: center;
                    color: white;
                    font-size: 25px;
                    padding: 20px;
                    border: 2px solid #333;
                    border-radius: 10px;
                    background-color: black;
                    text-align: center;x    
                    align-item:center;
                }
            </style>
        </head>
        <body>
            <div class="password-container">${password.replace(/\n/g, "<br>")}</div>
        </body>
    </html>`);
  } else {
    res.send(`<html>
            <head>
                <style>
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        background-color: white;
                        color:white;
                    }
                    .expired-message {
                        display:inline-block;
                        text-align: center;
                        color:white;
                        font-size: 25px;
                        padding: 20px;
                        border: 2px solid #333;
                        border-radius: 10px;
                        background-color: orange;
                        
                        margin-left:600px;
                        margin-top: 275px;
                    }
                </style>
            </head>
            <body>
                <div class="expired-message">Link has Expired</div>
            </body>
        </html>
    `);
  }
});

// ...

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
