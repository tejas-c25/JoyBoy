const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//parsing middleware 
//parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//parse application /json
app.use(bodyParser.json());

//static files
app.use(express.static('public'));

//setting up templating engine
app.engine('hbs', exphbs.engine({ extName: '.hbs'}));
app.set("view engine", "hbs");


//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    port            : 3307,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

//connect to db
pool.getConnection((err, connection) => {
    if(err) throw err; //not connected
    console.log('Connected as ID ' + connection.threadId);
});


const routes = require('./servers/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));