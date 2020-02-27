require('dotenv').config();

// Application Dependencies
const express = require('express');
// (add cors, pg, and morgan...)
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');
const server = express();

console.log(process.env);
// Database Client
const Client = pg.Client;
// (create and connect using DATABASE_URL)
const client = new Client(process.env.DATABASE_URL);
client.connect();


// Application Setup
const app = express();
const PORT = process.env.PORT;
// (add middleware utils: logging, cors, static files from public)
// app.use(...)
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get route to todos API
app.get('/api/todos', async(req, res) => {
    try {
        const result = await client.query(`
        SELECT * FROM todos;
        `);
        res.json(result.rows);
        console.log(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

//post route to todos API
app.post('/api/todos', async(req, res) => {

    try {
        const result = await client.query(`
        INSERT INTO todos (task, complete)
        VALUES ($1, $2)
        RETURNING *;
        `,
    
        [req.task, req.complete]);

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

//start the server
app.listen(PORT, () => {
    console.log('server running PORT', PORT);
});

//set up export for testing 
module.exports = { server: server };