const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');
// const knex = require('knex');
const bcrypt = require('bcryptjs');
const register = require('./functions/controllers/register');
const signin = require('./functions/controllers/signin');
const image = require('./functions/controllers/image');
const profile = require('./functions/controllers/profile');

// const db = knex({
//     client: 'pg',
//     connection: {
//         host : '127.0.0.1',
//         user : 'postgres',
//         password: 'juk1213@BD',
//         database : 'smart-brain'
//     }
// });

const db = new Client({
    user: "venda_user",
    password: "IfXGJJJM6tc7CGwGbnL8DR5ffmd3GK5U",
    host: "dpg-cgvtnr1euhlhlbi04gng-a",
    port: "5432",
    database: "venda"
})

db.connect();

const app = express();

app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {res.json('Connected with backend')})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfile(db))
 
app.put('/image', image.handleEntry(db))

app.post('/imageurl', (req, res) => image.handleApiCall(req, res))

const PORT = process.env.PORT

app.listen(PORT || 3000, () => {
    console.log(`App is running on port ${PORT}`);
})