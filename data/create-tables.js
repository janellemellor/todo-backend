/* eslint-disable no-console */
//consider exporting all the required Client dependencies into a separate library so that you can export just the one line. 
// const client = require('../lib/client');
require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;

// async/await needs to run in a function
run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        // initiate connecting to db
        await client.connect();

        // run a query to create tables
        await client.query(`        
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(256) NOT NULL,
                hash VARCHAR(512) NOT NULL
        );
        
            CREATE TABLE todos (
                    id SERIAL PRIMARY KEY NOT NULL,
                    task VARCHAR(512) NOT NULL,
                    complete BOOLEAN NOT NULL DEFAULT FALSE,
                    user_id INTEGER NOT NULL REFERENCES users(id)
            );
        `);

        console.log('create tables complete');
    }
    catch (err) {
        // problem? let's see the error...
        console.log(err);
    }
    finally {
        // success or failure, need to close the db connection
        client.end();
    }

}