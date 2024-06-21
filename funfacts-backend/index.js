const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db', 'data.json');
app.use(cors())

// Function to read the database
const readDatabase = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dbFilePath, 'utf8', (err, data) => {
            if (err) {
                reject('Error reading database');
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

// Function to write to the database
const writeDatabase = (db) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                reject('Error writing to database');
            } else {
                resolve();
            }
        });
    });
};

// Endpoint to register a page visit
app.get('/increment', async (req, res) => {
    try {
        const db = await readDatabase();
        db.facts += 1;
        await writeDatabase(db);
        res.status(201).json({ facts: db.facts });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to get the visit count
app.get('/count', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json({ facts: db.facts });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/', async (req, res) => {
  res.send("Running.")
});

app.listen(port, () => {
    console.log(`Fun Facts backend Server Running.`);
});
