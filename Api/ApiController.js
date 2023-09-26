const express = require('express'); 
const router = express.Router();
const DataBase = require('../Db/fakeDb');


router.get('/', (req, res) => {
    res.json(DataBase);
});



module.exports = router;





