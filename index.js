const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Api = require('./Api/ApiController');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use('/', Api);





app.listen(8080, () => {
    console.log("app rodando porta 8080");
})